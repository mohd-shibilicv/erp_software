from rest_framework import serializers
from .models import (
    Client,
    ClientRequest,
    ClientRelationship,
    ClientRequirement,
    RequirementImage,
    Feature,
    Quotation,
    QuotationItem,
    PaymentTerm,
    Agreement,
    Project,
    ProjectTask,
    ProjectAssignedStaffs,
    SubTask
)
from apps.users.models import User
from django.db import transaction
import logging
import json
from django.core.exceptions import ValidationError
from django.utils import timezone

logger = logging.getLogger(__name__)


class ClientRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientRequest
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at")
 
    def validate_scheduled_date(self, value):
        from django.utils import timezone

        if value < timezone.now():
            raise serializers.ValidationError("Scheduled date cannot be in the past.")
        return value


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            "id",
            "name",
            "mobile_number",
            "whatsapp_number",
            "email",
            "country",
            "city",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class ClientRelationshipSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(), source="client", write_only=True
    )

    class Meta:
        model = ClientRelationship
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["client"] = ClientSerializer(instance.client).data
        return representation


class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ["id", "name"]


class ClientSerializer(serializers.ModelSerializer):
    features = serializers.PrimaryKeyRelatedField(
        queryset=Feature.objects.all(), many=True, required=False
    )

    class Meta:
        model = Client
        fields = [
            "id",
            "name",
            "mobile_number",
            "whatsapp_number",
            "email",
            "country",
            "city",
            "features",
        ]


class RequirementImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequirementImage
        fields = ["id", "image"]


class ClientRequirementSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(), source="client", write_only=True
    )
    images = RequirementImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(
            max_length=1000000, allow_empty_file=False, use_url=False
        ),
        write_only=True,
        required=False,
    )
    existing_images = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    predefined_features = serializers.PrimaryKeyRelatedField(
        queryset=Feature.objects.all(), many=True, required=False
    )
    custom_features = serializers.ListField(
        child=serializers.CharField(max_length=255), required=False
    )
    status = serializers.ChoiceField(
        choices=ClientRequirement.STATUS_CHOICES, required=False
    )

    class Meta:
        model = ClientRequirement
        fields = [
            "id",
            "client",
            "client_id",
            "file_number",
            "color_theme",
            "layout",
            "additional_requirements",
            "predefined_features",
            "custom_features",
            "images",
            "uploaded_images",
            "existing_images",
            "status",
        ]

    def create(self, validated_data):
        client = validated_data.pop("client", None)
        uploaded_images = validated_data.pop("uploaded_images", [])
        predefined_features = validated_data.pop("predefined_features", [])
        custom_features = validated_data.pop("custom_features", [])
        client_requirement = ClientRequirement.objects.create(
            client=client, **validated_data
        )
        client_requirement.predefined_features.set(predefined_features)
        client_requirement.set_custom_features(custom_features)
        client_requirement.save()

        for image in uploaded_images:
            RequirementImage.objects.create(
                client_requirement=client_requirement, image=image
            )

        return client_requirement

    def update(self, instance, validated_data):
        client = validated_data.pop("client", None)
        uploaded_images = validated_data.pop("uploaded_images", [])
        existing_images = validated_data.pop("existing_images", [])

        predefined_features = validated_data.pop("predefined_features", [])
        if predefined_features is not None:
            instance.predefined_features.set(predefined_features)

        custom_features = validated_data.pop("custom_features", [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if client:
            instance.client = client

        instance.predefined_features.set(predefined_features)
        instance.set_custom_features(custom_features)
        current_images = set(instance.images.values_list("id", flat=True))
        images_to_keep = set(existing_images)
        images_to_delete = current_images - images_to_keep
        instance.images.filter(id__in=images_to_delete).delete()

        for image in uploaded_images:
            RequirementImage.objects.create(client_requirement=instance, image=image)

        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["client"] = ClientSerializer(instance.client).data
        representation["predefined_features"] = [
            {"id": feature.id, "name": feature.name}
            for feature in instance.predefined_features.all()
        ]
        representation["status"] = instance.status

        custom_features = instance.get_custom_features()
        representation["custom_features"] = (
            custom_features if isinstance(custom_features, list) else []
        )
        return representation

    def validate_custom_features(self, value):
        if isinstance(value, list):
            return value
        elif isinstance(value, str):
            return [feature.strip() for feature in value.split(",")]
        else:
            raise serializers.ValidationError(
                "Custom features must be a list or a comma-separated string."
            )

class QuotationItemSerializer(serializers.ModelSerializer):
    product_sku = serializers.CharField(source='product.sku', read_only=True)

    class Meta:
        model = QuotationItem
        fields = [
            "id",
            "product",
            "description",
            "quantity",
            "product_sku",
            "unit_price",
            "discount_percentage",
            "tax_percentage",
            "subtotal",
        ]


class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True)
    client_name = serializers.CharField(source="client.name", read_only=True)
    assigned_to_user = serializers.CharField(
        source="assigned_to.username", read_only=True
    )
    created_by_username = serializers.CharField(
        source="created_by.username", read_only=True
    )

    class Meta:
        model = Quotation
        fields = [
            "id",
            "quotation_number",
            "version",
            "status",
            "valid_until",
            "client",
            "client_reference",
            "client_name",
            "created_by_username",
            "assigned_to",
            "assigned_to_user",
            "subtotal",
            "discount_amount",
            "total_amount",
            "notes",
            "terms_and_conditions",
            "created_at",
            "requires_approval",
            "items",
        ]
        read_only_fields = ["subtotal", "discount_amount", "total_amount"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        quotation = Quotation.objects.create(**validated_data)
        for item_data in items_data:
            QuotationItem.objects.create(quotation=quotation, **item_data)
        quotation.update_totals()
        return quotation

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        instance = super().update(instance, validated_data)

        if items_data is not None:
            instance.items.all().delete()
            for item_data in items_data:
                QuotationItem.objects.create(quotation=instance, **item_data)

        instance.update_totals()
        return instance

class PaymentTermSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTerm
        fields = ["id", "date", "amount"]

class AgreementSerializer(serializers.ModelSerializer):
    quotation = serializers.PrimaryKeyRelatedField(queryset=Quotation.objects.all(), required=False, allow_null=True)
    payment_terms = serializers.JSONField(required=False)
    clientName = serializers.PrimaryKeyRelatedField(queryset=Client.objects.all(), source='client')
    quotation_number = serializers.SerializerMethodField()
    quotation_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Agreement
        fields = "__all__"
        read_only_fields = ["created_by", "created_at", "updated_at"]

    def get_quotation_number(self, obj):
        return obj.quotation.quotation_number if obj.quotation else None

    @transaction.atomic
    def create(self, validated_data):
        payment_terms_data = validated_data.pop("payment_terms", [])
        quotation_id = validated_data.pop("quotation_id", None)
       
        if quotation_id:
            try:
                quotation = Quotation.objects.get(id=quotation_id)
                validated_data["quotation"] = quotation
            except Quotation.DoesNotExist:
                raise serializers.ValidationError("Invalid quotation_id")

        agreement = Agreement.objects.create(**validated_data)

        if isinstance(payment_terms_data, str):
            try:
                payment_terms_data = json.loads(payment_terms_data)
            except json.JSONDecodeError:
                raise serializers.ValidationError("Invalid payment_terms data")

        if not isinstance(payment_terms_data, list):
            raise serializers.ValidationError("payment_terms must be a list")

        for payment_term_data in payment_terms_data:
            try:
                PaymentTerm.objects.create(agreement=agreement, **payment_term_data)
            except ValidationError as e:
                raise serializers.ValidationError(f"Invalid payment term data: {e}")

        return agreement


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['clientName'] = instance.client.name if instance.client else None
        representation['quotation_number'] = self.get_quotation_number(instance)
        representation['quotation_id'] = instance.quotation.id if instance.quotation else None
        representation['payment_terms'] = PaymentTermSerializer(instance.payment_terms.all(), many=True).data
        return representation

    @transaction.atomic
    def update(self, instance, validated_data):
        payment_terms_data = validated_data.pop("payment_terms", [])
        instance = super().update(instance, validated_data)
        quotation_id = validated_data.pop("quotation_id", None)

        for field in ['tc_file', 'signed_agreement']:
            if field not in self.initial_data:
                validated_data.pop(field, None)
            elif self.initial_data[field] in [None, '', 'null']:
                validated_data.pop(field, None)
        if quotation_id:
          validated_data["quotation"] = Quotation.objects.get(id=quotation_id)
        instance.payment_terms.all().delete()
        for payment_term_data in payment_terms_data:
            payment_term = PaymentTerm.objects.create(agreement=instance, **payment_term_data)

        return instance


class ProjectAssignedStaffsSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.username', read_only=True)
    staff_email = serializers.EmailField(source='staff.email', read_only=True)

    class Meta:
        model = ProjectAssignedStaffs
        fields = ['id', 'project_name', 'project_reference_id', 'staff_name','staff_email', 'assigned_date', 'is_active']
    

class ProjectSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    requirements = ClientRequirementSerializer(read_only=True)
    requirements_id = serializers.PrimaryKeyRelatedField(
        queryset=ClientRequirement.objects.all(),
        source='requirements',
        write_only=True,
        required=True
    )
    staff_assignments = ProjectAssignedStaffsSerializer(many=True, read_only=True)
    agreement = AgreementSerializer(read_only=True)
    agreement_id = serializers.PrimaryKeyRelatedField(
        queryset=Agreement.objects.all(),
        source='agreement',
        write_only=True,
        required=True
    )
    assigned_staffs = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=User.objects.all(),
        required=False
    )
    class Meta:
        model = Project
        fields = [
            'id', 'project_name', 'project_id', 'client',
            'requirements', 'requirements_id', 'agreement', 'agreement_id',
            'project_description', 'priority_level', 'status',
            'active', 'assigned_staffs','staff_assignments'
        ]
        read_only_fields = ['project_name', 'client']

    def validate(self, data):
        agreement = data.get('agreement')
        requirements = data.get('requirements')
        if not agreement:
            raise serializers.ValidationError({"agreement_id": "This field is required."})
        if not requirements:
            raise serializers.ValidationError({"requirements_id": "This field is required."})
        data['project_name'] = agreement.project_name
        if requirements.client != agreement.client:
            raise serializers.ValidationError("The selected requirement must belong to the same client as the agreement.")
        data['client'] = agreement.client

        return data

    def create(self, validated_data):
        assigned_staffs = validated_data.pop('assigned_staffs', [])
        project = Project.objects.create(**validated_data)
        
        if assigned_staffs:
            project.assigned_staffs.set(assigned_staffs)
            project._assigned_staffs = assigned_staffs  
            project.save() 
        
        return project

    def update(self, instance, validated_data):
        assigned_staffs = validated_data.pop('assigned_staffs', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if assigned_staffs is not None:
            instance.assigned_staffs.set(assigned_staffs)
            instance._assigned_staffs = assigned_staffs 
        instance.save() 
        return instance

class SubTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTask
        fields = ['id', 'title', 'description', 'status', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class ProjectTaskSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project_staff.project_name', read_only=True)
    staff_name = serializers.CharField(source='project_staff.staff.username', read_only=True)
    staff_email = serializers.CharField(source='project_staff.staff.email', read_only=True)
    attachment_url = serializers.SerializerMethodField()
    subtasks = SubTaskSerializer(many=True, required=False)

    class Meta:
        model = ProjectTask
        fields = [
            'id', 'project_staff', 'project_name', 'staff_name','staff_email',
            'title', 'description', 'deadline', 'attachment',
            'attachment_url', 'priority', 'status',
            'created_at', 'updated_at','subtasks'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_attachment_url(self, obj):
        if obj.attachment:
            return self.context['request'].build_absolute_uri(obj.attachment.url)
        return None

    def validate_project_staff(self, value):
        if not value.is_active:
            raise serializers.ValidationError(
                "Cannot create task for inactive project assignment"
            )
        return value

    def validate_deadline(self, value):
        if value < timezone.now():
            raise serializers.ValidationError(
                "Deadline cannot be in the past"
            )
        return value
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.deadline:
            representation['deadline'] = instance.deadline.strftime("%Y-%m-%d %H:%M")
        representation['subtasks'] = SubTaskSerializer(instance.subtasks.all(), many=True).data
        return representation

    def create(self, validated_data):
        subtasks_data = validated_data.pop('subtasks', [])
        project_task = ProjectTask.objects.create(**validated_data)
        for subtask_data in subtasks_data:
            SubTask.objects.create(project_task=project_task, **subtask_data)
        return project_task

    def update(self, instance, validated_data):
        subtasks_data = validated_data.pop('subtasks', [])
        instance = super().update(instance, validated_data)
        for subtask_data in subtasks_data:
            SubTask.objects.update_or_create(
                project_task=instance,
                id=subtask_data.get('id'),
                defaults=subtask_data
            )
        return instance
    

class StaffProjectAssignmentSerializer(serializers.ModelSerializer):
    project_details = serializers.SerializerMethodField()
    class Meta:
        model = ProjectAssignedStaffs
        fields = [
            'id', 'project_name', 'project_reference_id', 
            'assigned_date', 'is_active', 'project_details'
        ]

    def get_project_details(self, obj):
        return {
            'id': obj.project.id,
            'description': obj.project.project_description,
            'priority_level': obj.project.priority_level,
            'status': obj.project.status,
        }
  

from rest_framework import serializers
from .models import (
    Client,
    ClientRequest,
    ClientRelationship,
    ClientRequirement,
    RequirementImage,
    Feature,
)


class ClientRequestSerializer(serializers.ModelSerializer):
    platform = serializers.CharField(source="get_platform_display")

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

        try:
            representation["custom_features"] = instance.get_custom_features()
        except Exception:
            representation["custom_features"] = []
        return representation



from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Quotation, QuotationItem

class QuotationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotationItem
        fields = '__all__'

class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True, read_only=True)

    class Meta:
        model = Quotation
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'created_by', 'last_updated_by')

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['created_by'] = user
        validated_data['last_updated_by'] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['last_updated_by'] = self.context['request'].user
        return super().update(instance, validated_data)

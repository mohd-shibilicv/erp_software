from rest_framework import serializers
from .models import Client, ClientRequest, ClientRelationship, ClientRequirement, RequirementImage,Feature


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
        fields = '__all__'


class ClientRelationshipSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(), 
        source='client', 
        write_only=True
    )

    class Meta:
        model = ClientRelationship
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['client'] = ClientSerializer(instance.client).data
        return representation
    


#client Requirements


class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ['id', 'name']

class ClientSerializer(serializers.ModelSerializer):
    features = serializers.PrimaryKeyRelatedField(queryset=Feature.objects.all(), many=True, required=False)
    
    class Meta:
        model = Client
        fields = ['id', 'name', 'mobile_number', 'whatsapp_number', 'email', 'country', 'city', 'features']

class RequirementImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequirementImage
        fields = ['id', 'image']

class ClientRequirementSerializer(serializers.ModelSerializer):
    client = serializers.PrimaryKeyRelatedField(queryset=Client.objects.all())
    images = RequirementImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )
    predefined_features = serializers.PrimaryKeyRelatedField(
        queryset=Feature.objects.all(),
        many=True,
        required=False
    )
    custom_features = serializers.ListField(
        child=serializers.CharField(max_length=255),
        required=False
    )

    class Meta:
        model = ClientRequirement
        fields = ['id', 'client', 'file_number', 'color_theme', 'layout', 'additional_requirements', 
                  'predefined_features', 'custom_features', 'images', 'uploaded_images']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        predefined_features = validated_data.pop('predefined_features', [])
        custom_features = validated_data.pop('custom_features', [])

        client_requirement = ClientRequirement.objects.create(**validated_data)
        client_requirement.predefined_features.set(predefined_features)
        client_requirement.set_custom_features(custom_features)
        client_requirement.save()

        for image in uploaded_images:
            RequirementImage.objects.create(client_requirement=client_requirement, image=image)

        return client_requirement


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['predefined_features'] = [
            {'id': feature.id, 'name': feature.name}
            for feature in instance.predefined_features.all()
        ]
        representation['custom_features'] = instance.get_custom_features()
        return representation
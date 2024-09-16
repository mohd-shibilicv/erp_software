from rest_framework import serializers
from .models import Client, ClientRequest, ClientRelationship


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

from rest_framework import serializers
from .models import ClientRequest


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

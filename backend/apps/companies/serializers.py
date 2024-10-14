from rest_framework import serializers
from .models import (
    CompanyDetails,
    VehicleDetails)

class CompanyDetailsSerializer(serializers.ModelSerializer):
    """
    Serializer for the CompanyDetails model.
    Converts model instances into JSON and validates input data for API views.
    """
    
    class Meta:
        model = CompanyDetails
        fields = [
            'id', 'company_name', 'cr_no', 'cr_expiry', 
            'ruksa_number', 'ruksa_expiry', 
            'computer_card', 'computer_card_expiry', 
            'cr_image', 'ruksa_image', 'computer_card_image'
        ]


class VehicleDetailsSerializer(serializers.ModelSerializer):
    """
    Serializer for the VehicleDetails model.
    
    This serializer handles the conversion of VehicleDetails model instances
    to JSON representations and vice versa.
    """
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = VehicleDetails
        fields = ['id', 'vehicle_name', 'vehicle_no', 'expiry_date', 'vehicle_model', 
                  'owner_id', 'company', 'company_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_vehicle_no(self, value):
        """
        Check that the vehicle number is unique, excluding the current instance.
        """
        instance = getattr(self, 'instance', None)
        if VehicleDetails.objects.exclude(pk=instance.pk if instance else None).filter(vehicle_no=value).exists():
            raise serializers.ValidationError("A vehicle with this number already exists.")
        return value

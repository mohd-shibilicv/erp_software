from rest_framework import serializers
from .models import CompanyDetails

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

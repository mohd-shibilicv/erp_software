from rest_framework import serializers
from .models import (
    NatureGroup,
    MainGroup,
    Ledger,
    )

class NatureGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = NatureGroup
        fields = '__all__'

class MainGroupSerializer(serializers.ModelSerializer):
    nature_group = NatureGroupSerializer(read_only=True)  
    class Meta:
        model = MainGroup
        fields = '__all__'

class LedgerSerializer(serializers.ModelSerializer):
    group = MainGroupSerializer(read_only=True)  
    group_id = serializers.PrimaryKeyRelatedField(
        queryset=MainGroup.objects.all(), write_only=True, source='group'
    )

    class Meta:
        model = Ledger
        fields = '__all__'
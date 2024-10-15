from rest_framework import viewsets
from .models import AnnualMaintenanceCost, CompanyDetails, VehicleDetails
from .serializers import AnnualMaintenanceCostSerializer, CompanyDetailsSerializer, VehicleDetailsSerializer
from rest_framework.permissions import IsAuthenticated

class CompanyDetailsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing company details.
    Provides list, create, retrieve, update, and destroy actions.
    """
    
    queryset = CompanyDetails.objects.all()
    serializer_class = CompanyDetailsSerializer


class VehicleDetailsViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing vehicle details.

    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = VehicleDetails.objects.all()
    serializer_class = VehicleDetailsSerializer
    permission_classes = [IsAuthenticated]


class AnnualMaintenanceCostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing, creating, updating, and deleting AnnualMaintenanceCost records.
    Provides standard actions like list, retrieve, create, update, and delete.
    """
    
    queryset = AnnualMaintenanceCost.objects.all()
    serializer_class = AnnualMaintenanceCostSerializer
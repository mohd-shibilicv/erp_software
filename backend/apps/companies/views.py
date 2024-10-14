from rest_framework import viewsets
from .models import CompanyDetails, VehicleDetails
from .serializers import CompanyDetailsSerializer, VehicleDetailsSerializer
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

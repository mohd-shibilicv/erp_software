from rest_framework import viewsets
from .models import CompanyDetails
from .serializers import CompanyDetailsSerializer

class CompanyDetailsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing company details.
    Provides list, create, retrieve, update, and destroy actions.
    """
    
    queryset = CompanyDetails.objects.all()
    serializer_class = CompanyDetailsSerializer

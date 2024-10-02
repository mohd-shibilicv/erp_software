from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import (
    Client,
    ClientRequest,
    ClientRelationship,
    ClientRequirement,
    Feature,
    Quotation,
    QuotationItem,
    Agreement,
    Project
)
from .serializers import (
    ClientSerializer,
    ClientRequestSerializer,
    ClientRelationshipSerializer,
    ClientRequirementSerializer,
    FeatureSerializer,
    QuotationItemSerializer,
    QuotationSerializer,
    AgreementSerializer,
    ProjectSerializer
)
from django.contrib.auth import get_user_model
from .utils import create_google_calendar_event, send_calendar_invite_email
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import logging

logger = logging.getLogger(__name__)

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]


class ClientRequestViewSet(viewsets.ModelViewSet):
    queryset = ClientRequest.objects.all()
    serializer_class = ClientRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

    def get_queryset(self):
        queryset = ClientRequest.objects.all()
        status = self.request.query_params.get("status", None)
        if status is not None:
            queryset = queryset.filter(status=status)
        return queryset

    @action(detail=True, methods=["post"])
    def assign_staff(self, request, pk=None):
        demo_request = self.get_object()
        staff_id = request.data.get("staff_id")
        status = request.data.get("status")

        if not staff_id:
            return Response(
                {"error": "staff_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            User = get_user_model()
            staff = User.objects.get(id=staff_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Staff not found"}, status=status.HTTP_404_NOT_FOUND
            )

        demo_request.assigned_staff = staff
        demo_request.status = status

        # Create Google Calendar event
        # event = create_google_calendar_event(demo_request)
        # if event:
        #     demo_request.google_calendar_event_id = event["id"]

        demo_request.save()

        # # Send email with calendar invite
        # send_calendar_invite_email(demo_request, event)

        serializer = self.get_serializer(demo_request)
        return Response(serializer.data)


class ClientRelationshipViewSet(viewsets.ModelViewSet):
    queryset = ClientRelationship.objects.all()
    serializer_class = ClientRelationshipSerializer
    permission_classes = [permissions.IsAuthenticated]


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer


class FeatureViewSet(viewsets.ModelViewSet):
    queryset = Feature.objects.all()
    serializer_class = FeatureSerializer


class ClientRequirementViewSet(viewsets.ModelViewSet):
    queryset = ClientRequirement.objects.select_related("client").all()
    serializer_class = ClientRequirementSerializer


class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.all()
    serializer_class = QuotationSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, last_updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(last_updated_by=self.request.user)


class QuotationItemViewSet(viewsets.ModelViewSet):
    queryset = QuotationItem.objects.all()
    serializer_class = QuotationItemSerializer

from django.core.files.base import ContentFile
import json
from django.http import QueryDict

class AgreementViewSet(viewsets.ModelViewSet):
    queryset = Agreement.objects.all()
    serializer_class = AgreementSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def create(self, request, *args, **kwargs):
        logger.info(f"Received data for create: {request.data}")
        
        # If request.data is a QueryDict, convert it to a mutable dictionary
        if isinstance(request.data, QueryDict):
            data = request.data.dict()
        else:
            data = request.data.copy()

        # Handle payment_terms if it's a string
        if 'payment_terms' in data and isinstance(data['payment_terms'], str):
            try:
                data['payment_terms'] = json.loads(data['payment_terms'])
            except json.JSONDecodeError:
                return Response({"error": "Invalid payment_terms data"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def update(self, request, *args, **kwargs):
        logger.info(f"Received data for update: {request.data}")
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        mutable_data = request.data.copy()

        # Handle file fields
        for field in ['tc_file', 'signed_agreement']:
            if field in mutable_data:
                file_data = mutable_data.get(field)
                if not isinstance(file_data, ContentFile):
                    mutable_data.pop(field)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()

from django_filters import rest_framework as filters

class ProjectFilter(filters.FilterSet):
    assigned_staff = filters.NumberFilter(field_name='assigned_staffs', method='filter_assigned_staff')

    class Meta:
        model = Project
        fields = ['assigned_staff']

    def filter_assigned_staff(self, queryset, name, value):
        return queryset.filter(assigned_staffs__id=value)
    
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filterset_class = ProjectFilter

    def create(self, request, *args, **kwargs):
        if 'assigned_staffs' in request.data and isinstance(request.data['assigned_staffs'], str):
            request.data['assigned_staffs'] = [int(id) for id in request.data['assigned_staffs'].split(',') if id.isdigit()]
        
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            instance = self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(self.get_serializer(instance).data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        instance = serializer.save()
        return instance

    def update(self, request, *args, **kwargs):
        if 'assigned_staffs' in request.data and isinstance(request.data['assigned_staffs'], str):
            request.data['assigned_staffs'] = [int(id) for id in request.data['assigned_staffs'].split(',') if id.isdigit()]
        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        instance = serializer.save()
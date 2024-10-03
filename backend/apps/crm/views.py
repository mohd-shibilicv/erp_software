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
    pagination_class = None

    def create(self, request, *args, **kwargs):
        if 'assigned_staffs' in request.data and isinstance(request.data['assigned_staffs'], str):
            request.data['assigned_staffs'] = [int(id) for id in request.data['assigned_staffs'].split(',') if id.isdigit()]
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            self.get_serializer(instance).data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def perform_create(self, serializer):
        return serializer.save()

from .serializers import ProjectAssignedStaffsSerializer
from .models import ProjectAssignedStaffs

class ProjectAssignedStaffsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProjectAssignedStaffsSerializer
    pagination_class = None
    
    def get_queryset(self):
        return ProjectAssignedStaffs.objects.filter(is_active=True)

class ProjectAssignedStaffsFilter(filters.FilterSet):
    class Meta:
        model = ProjectAssignedStaffs
        fields = ['project', 'staff', 'is_active']

from .models import ProjectTask
import datetime
from django.utils import timezone
from .serializers import ProjectTaskSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from dateutil.parser import parse

class ProjectTaskFilter(filters.FilterSet):
    project = filters.NumberFilter(field_name='project_staff__project')
    staff = filters.NumberFilter(field_name='project_staff__staff')
    status = filters.ChoiceFilter(choices=ProjectTask.STATUS_CHOICES)
    priority = filters.ChoiceFilter(choices=ProjectTask.PRIORITY_CHOICES)
    deadline_before = filters.DateTimeFilter(field_name='deadline', lookup_expr='lte')
    deadline_after = filters.DateTimeFilter(field_name='deadline', lookup_expr='gte')

    class Meta:
        model = ProjectTask
        fields = ['project', 'staff', 'status', 'priority']

class ProjectTaskViewSet(viewsets.ModelViewSet):
    queryset = ProjectTask.objects.all()
    serializer_class = ProjectTaskSerializer
    parser_classes = (JSONParser, MultiPartParser, FormParser)
    filterset_class = ProjectTaskFilter

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        if 'deadline' in request.data and isinstance(request.data['deadline'], str):
            try:
                deadline = datetime.datetime.strptime(request.data['deadline'], "%Y-%m-%d %H:%M")
                deadline = timezone.make_aware(deadline)
                request.data['deadline'] = deadline
            except ValueError as e:
                return Response(
                    {'deadline': 'Invalid datetime format. Please use format YYYY-MM-DD HH:MM'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
from django.shortcuts import get_object_or_404

class ProjectIndividualTaskViewSet(viewsets.ModelViewSet):
    queryset = ProjectTask.objects.all()
    serializer_class = ProjectTaskSerializer
    parser_classes = (JSONParser, MultiPartParser, FormParser)
    filterset_class = ProjectTaskFilter

    @action(detail=False, methods=['get'], url_path='staff-tasks/(?P<staff_assignment_id>[^/.]+)')
    def staff_tasks(self, request, staff_assignment_id=None):
        """
        Get all tasks for a specific ProjectAssignedStaff
        """
        try:
            staff_assignment = get_object_or_404(
                ProjectAssignedStaffs, 
                id=staff_assignment_id,
                is_active=True
            )            
            tasks = self.queryset.filter(project_staff=staff_assignment)
            tasks = self.filter_queryset(tasks)            
            tasks = tasks.order_by('-created_at')
            
            serializer = self.serializer_class(
                tasks, 
                many=True,
                context={'request': request}
            )
            
            response_data = {
                'staff_assignment': {
                    'id': staff_assignment.id,
                    'project_name': staff_assignment.project_name,
                    'staff_name': staff_assignment.staff.username,
                    'staff_email': staff_assignment.staff.email,
                    'assigned_date': staff_assignment.assigned_date
                },
                'tasks': serializer.data
            }
            
            return Response(response_data)
            
        except ValueError:
            return Response(
                {'error': 'Invalid staff assignment ID'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
  
from rest_framework.response import Response
from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from .serializers import StaffProjectAssignmentSerializer

class StaffProjectAssignmentView(generics.ListAPIView):
    serializer_class = StaffProjectAssignmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Check if user is authenticated and has staff role
        if not user.is_authenticated:
            return ProjectAssignedStaffs.objects.none()
        
        if user.role != 'staff':
            return ProjectAssignedStaffs.objects.none()
            
        # Get all active project assignments for the logged-in staff
        return ProjectAssignedStaffs.objects.filter(
            staff=user,
            is_active=True
        ).select_related('project').order_by('-assigned_date')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        if not queryset.exists():
            return Response({
                "message": "No projects are currently assigned to you.",
                "assignments": []
            })
            
        serializer = self.get_serializer(queryset, many=True)
        
        response_data = {
            "staff_details": {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
                "phone_number": request.user.phone_number
            },
            "total_assignments": queryset.count(),
            "assignments": serializer.data
        }
        
        return Response(response_data)


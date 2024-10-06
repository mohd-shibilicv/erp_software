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
    Project,
    ProjectAssignedStaffs,
    ProjectTask,
    SubTask
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
    ProjectSerializer,
    ProjectAssignedStaffsSerializer,
    ProjectTaskSerializer,
    StaffProjectAssignmentSerializer,
    SubTaskSerializer
)
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .utils import create_google_calendar_event, send_calendar_invite_email
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import logging
from rest_framework.views import APIView
from django.core.mail import send_mail
from rest_framework.permissions import IsAuthenticated
import datetime
from django.utils import timezone
from django.core.files.base import ContentFile
import json
from django.http import QueryDict

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


class ProjectAssignedStaffsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProjectAssignedStaffsSerializer
    pagination_class = None
    
    def get_queryset(self):
        return ProjectAssignedStaffs.objects.filter(is_active=True)

class ProjectAssignedStaffsFilter(filters.FilterSet):
    class Meta:
        model = ProjectAssignedStaffs
        fields = ['project', 'staff', 'is_active']


class ProjectTaskFilter(filters.FilterSet):
    project = filters.NumberFilter(field_name='project_staff__project')
    staff = filters.NumberFilter(field_name='project_staff__staff')
    status = filters.ChoiceFilter(choices=ProjectTask.STATUS_CHOICES)
    priority = filters.ChoiceFilter(choices=ProjectTask.PRIORITY_CHOICES)
    deadline_before = filters.DateTimeFilter(field_name='deadline', lookup_expr='lte')
    deadline_after = filters.DateTimeFilter(field_name='deadline', lookup_expr='gte')

    class Meta:
        model = ProjectTask
        fields = ['project', 'staff', 'priority']


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
        data = request.data.copy() 

        if 'deadline' in data and isinstance(data['deadline'], str):
            try:
                deadline = datetime.datetime.strptime(data['deadline'], "%Y-%m-%d %H:%M")
                deadline = timezone.make_aware(deadline)
                data['deadline'] = deadline
            except ValueError:
                return Response(
                    {'deadline': 'Invalid datetime format. Please use format YYYY-MM-DD HH:MM'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        if 'subtasks' in data:
            try:
                subtasks = json.loads(data['subtasks'])
                if isinstance(subtasks, list):
                    data['subtasks'] = subtasks
                else:
                    return Response(
                        {'subtasks': 'Invalid format. Expected a JSON array.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except json.JSONDecodeError:
                return Response(
                    {'subtasks': 'Invalid JSON format for subtasks.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        if 'attachment' in request.FILES:
            data['attachment'] = request.FILES['attachment']
        elif 'attachment' in data:
            del data['attachment']

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        instance = serializer.save()
        subtasks_data = self.request.data.get('subtasks')
        if subtasks_data:
            subtasks = json.loads(subtasks_data)
            for subtask in subtasks:
                SubTask.objects.create(project_task=instance, **subtask)

    @action(detail=True, methods=['put'], url_path=r'subtask/(?P<subtask_id>\d+)')
    def update_subtask(self, request, pk=None, subtask_id=None):
        task = self.get_object()
        try:
            subtask = task.subtasks.get(id=subtask_id)
        except SubTask.DoesNotExist:
            return Response({"error": "Subtask not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = SubTaskSerializer(subtask, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        
  
class StaffProjectAssignmentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StaffProjectAssignmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user        
        if user.role != 'staff':
            return ProjectAssignedStaffs.objects.none()
            
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
    
class SendProjectEmailView(APIView):
    def post(self, request):
        deadline = request.data.get('deadline')
        description = request.data.get("description")
        staff_id = request.data.get('staff_id')
        staff_name = request.data.get('staff_name')
        project_name = request.data.get('project_name')
        staff_email = request.data.get('staff_email')
        prev_deadline = request.data.get('prev_deadline')
        project_reference_id = request.data.get('project_reference_id')
        subject = f"Deadline Revision: {staff_name} for {project_name}"

        message = f"""
        Dear Team,

        This email is to inform you that the project "{project_name}" (Reference ID: {project_reference_id}) assigned to {staff_name} (Staff ID: {staff_id}) has undergone a deadline revision.

        Please find the updated details below:

        ------------------------------------------------------
        📌 **Project Name**: {project_name}
        📌 **Project Reference ID**: {project_reference_id}
        📌 **Staff Assigned**: {staff_name} (Staff ID: {staff_id})
        📌 **Staff Email**: {staff_email}
        ------------------------------------------------------

        🕒 **Previous Deadline**: {prev_deadline}
        🕒 **New Deadline**: {deadline}

        ✍ **Reason for Revision**: 
        {description}

        We kindly request you to take note of this deadline change and adjust your schedules accordingly.

        Best Regards,
        {staff_name}
        """

        from_email = 'nashirnoor2002@gmail.com'
        recipient_list = ['nashirnoor1718@gmail.com']  

        try:
            send_mail(subject, message, from_email, recipient_list)
            return Response({"message": "Email sent successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

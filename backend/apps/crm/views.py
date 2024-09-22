from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Client, ClientRequest, ClientRelationship,ClientRequirement, Feature, Quotation, QuotationItem
from .serializers import ClientSerializer, ClientRequestSerializer, ClientRelationshipSerializer, ClientRequirementSerializer, FeatureSerializer, QuotationItemSerializer,QuotationSerializer
from django.contrib.auth import get_user_model
from .utils import create_google_calendar_event, send_calendar_invite_email


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
    queryset = ClientRequirement.objects.select_related('client').all()
    serializer_class = ClientRequirementSerializer



class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.all()
    serializer_class = QuotationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, last_updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(last_updated_by=self.request.user)

    


class QuotationItemViewSet(viewsets.ModelViewSet):
    queryset = QuotationItem.objects.all()
    serializer_class = QuotationItemSerializer
    permission_classes = [permissions.IsAuthenticated]


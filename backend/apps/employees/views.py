from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Employee, Attendance, Leave
from .serializers import EmployeeSerializer, AttendanceSerializer, LeaveSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["GET"])
    def directory(self, request):
        employees = self.get_queryset()
        serializer = self.get_serializer(employees, many=True)
        return Response(serializer.data)


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["POST"])
    def check_in(self, request):
        employee = request.user.employee
        attendance, created = Attendance.objects.get_or_create(
            employee=employee, date=timezone.now().date()
        )
        attendance.check_in = timezone.now()
        attendance.save()
        return Response({"message": "Check-in recorded successfully"})

    @action(detail=False, methods=["POST"])
    def check_out(self, request):
        employee = request.user.employee
        try:
            attendance = Attendance.objects.get(
                employee=employee, date=timezone.now().date()
            )
            attendance.check_out = timezone.now()
            attendance.save()
            return Response({"message": "Check-out recorded successfully"})
        except Attendance.DoesNotExist:
            return Response({"error": "No check-in found for today"}, status=400)


class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["POST"])
    def approve(self, request, pk=None):
        leave = self.get_object()
        leave.status = "A"
        leave.save()
        return Response({"message": "Leave request approved"})

    @action(detail=True, methods=["POST"])
    def reject(self, request, pk=None):
        leave = self.get_object()
        leave.status = "R"
        leave.save()
        return Response({"message": "Leave request rejected"})

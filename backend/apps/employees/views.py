from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Department, Position, Employee, Attendance, Leave, Performance, Payroll, Training, VPTrack
from .serializers import (
    DepartmentSerializer, PositionSerializer, EmployeeSerializer, 
    AttendanceSerializer, LeaveSerializer, PerformanceSerializer, 
    PayrollSerializer, TrainingSerializer, VPTrackSerializer
)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]


class PositionViewSet(viewsets.ModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticated]


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
        today = timezone.now().date()
        
        # Ensure employee has not already checked in today
        attendance, created = Attendance.objects.get_or_create(
            employee=employee, date=today
        )

        if attendance.check_in is not None:
            return Response(
                {"error": "You have already checked in today."},
                status=status.HTTP_400_BAD_REQUEST
            )

        attendance.check_in = timezone.now()

        # Mark if late
        start_time = timezone.now().replace(hour=9, minute=0, second=0, microsecond=0).time()  # Assuming 9 AM as default start time
        if attendance.check_in.time() > start_time:
            attendance.status = 'late'

        attendance.save()
        return Response({"message": "Check-in recorded successfully"})

    @action(detail=False, methods=["POST"])
    def check_out(self, request):
        employee = request.user.employee
        today = timezone.now().date()

        try:
            attendance = Attendance.objects.get(
                employee=employee, date=today
            )

            if attendance.check_in is None:
                return Response(
                    {"error": "You haven't checked in yet today."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if attendance.check_out is not None:
                return Response(
                    {"error": "You have already checked out today."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            attendance.check_out = timezone.now()

            # Check if early leave
            end_time = timezone.now().replace(hour=19, minute=0, second=0, microsecond=0).time()  # Assuming 7 PM as default end time
            if attendance.check_out.time() < end_time:
                attendance.status = 'early_leave'

            attendance.save()
            return Response({"message": "Check-out recorded successfully"})

        except Attendance.DoesNotExist:
            return Response(
                {"error": "No check-in found for today."},
                status=status.HTTP_400_BAD_REQUEST
            )

    # Get today's attendance for the logged-in user
    @action(detail=False, methods=["GET"])
    def today(self, request):
        employee = request.user.employee
        today = timezone.now().date()
        try:
            attendance = Attendance.objects.get(employee=employee, date=today)
            serializer = AttendanceSerializer(attendance)
            return Response(serializer.data)
        except Attendance.DoesNotExist:
            return Response(
                {"error": "No attendance record found for today."},
                status=status.HTTP_404_NOT_FOUND
            )


class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["POST"])
    def approve(self, request, pk=None):
        leave = self.get_object()
        leave.status = "A"
        leave.approved_by = request.user.employee
        leave.save()
        return Response({"message": "Leave request approved"})

    @action(detail=True, methods=["POST"])
    def reject(self, request, pk=None):
        leave = self.get_object()
        leave.status = "R"
        leave.approved_by = request.user.employee
        leave.save()
        return Response({"message": "Leave request rejected"})


class PerformanceViewSet(viewsets.ModelViewSet):
    queryset = Performance.objects.all()
    serializer_class = PerformanceSerializer
    permission_classes = [IsAuthenticated]


class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer
    permission_classes = [IsAuthenticated]


class TrainingViewSet(viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["POST"])
    def add_participant(self, request, pk=None):
        training = self.get_object()
        employee_id = request.data.get('employee_id')
        try:
            employee = Employee.objects.get(id=employee_id)
            training.participants.add(employee)
            return Response({"message": f"{employee} added to {training}"})
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["POST"])
    def remove_participant(self, request, pk=None):
        training = self.get_object()
        employee_id = request.data.get('employee_id')
        try:
            employee = Employee.objects.get(id=employee_id)
            training.participants.remove(employee)
            return Response({"message": f"{employee} removed from {training}"})
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_400_BAD_REQUEST)


class VPTrackViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing VPTrack instances.
    """
    queryset = VPTrack.objects.all()
    serializer_class = VPTrackSerializer
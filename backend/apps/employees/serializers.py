from rest_framework import serializers
from .models import Department, Position, Employee, Attendance, Leave, Performance, Payroll, Training, VPTrack
from django.contrib.auth import get_user_model
from apps.companies.serializers import CompanyDetailsSerializer

User = get_user_model()


class DepartmentSerializer(serializers.ModelSerializer):
    """
    Department serializer to handle department data.
    """
    class Meta:
        model = Department
        fields = "__all__"


class PositionSerializer(serializers.ModelSerializer):
    """
    Position serializer to handle position data.
    """
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = Position
        fields = "__all__"


class EmployeeSerializer(serializers.ModelSerializer):
    """
    Employee serializer to handle employee data.
    """
    name = serializers.CharField(source='employee_name', read_only=True)
    position = PositionSerializer(read_only=True)
    employee_position = serializers.CharField(source='position.title', read_only=True)
    employee_department = serializers.CharField(source='department.name', read_only=True)
    manager = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = "__all__"
        read_only_fields = ["employee_id"]

    def get_manager(self, obj):
        if obj.manager:
            return UserSerializer(obj.manager, read_only=True).data
        return None


class AttendanceSerializer(serializers.ModelSerializer):
    """
    Attendance serializer to handle attendance data, including computed working hours.
    """
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    employee_name = serializers.CharField(source='employee.employee_name', read_only=True)
    working_hours = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = "__all__"

    # Method to return the computed working_hours property
    def get_working_hours(self, obj):
        return obj.working_hours

    # Validation for check-in/check-out consistency
    def validate(self, data):
        if data.get('check_in') and data.get('check_out'):
            if data['check_in'] >= data['check_out']:
                raise serializers.ValidationError("Check-out must be after check-in.")
        return data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['employee'] = EmployeeSerializer(instance.employee).data
        return representation


class LeaveSerializer(serializers.ModelSerializer):
    """
    Leave serializer to handle leave data.
    """
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    approved_by = EmployeeSerializer(read_only=True)
    attachment = serializers.SerializerMethodField()

    class Meta:
        model = Leave
        fields = "__all__"

    def get_attachment(self, obj):
        if obj.attachment:
            return self.context['request'].build_absolute_uri(obj.attachment.url)
        return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['employee'] = EmployeeSerializer(instance.employee).data
        return representation


class PerformanceSerializer(serializers.ModelSerializer):
    """
    Performance serializer to handle performance data.
    """
    employee = EmployeeSerializer(read_only=True)
    reviewer = EmployeeSerializer(read_only=True)

    class Meta:
        model = Performance
        fields = "__all__"


class PayrollSerializer(serializers.ModelSerializer):
    """
    Payroll serializer to handle payroll data.
    """
    employee = EmployeeSerializer(read_only=True)

    class Meta:
        model = Payroll
        fields = "__all__"


class TrainingSerializer(serializers.ModelSerializer):
    """
    Training serializer to handle training data.
    """
    participants = EmployeeSerializer(many=True, read_only=True)

    class Meta:
        model = Training
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    """
    User serializer to handle user data.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class VPTrackSerializer(serializers.ModelSerializer):
    """
    Serializer for the VPTrack model, including all fields.
    """
    company_name = serializers.CharField(source='company.company_name', read_only=True)
    employee_name = serializers.CharField(source='employee.employee_name', read_only=True)

    class Meta:
        model = VPTrack 
        fields = ['id', 'company', 'company_name', 'employee', 'employee_name', 'computer_card', 'nation', 'vp_no', 'vp_expiry', 'employee_designation', 'visa_count']

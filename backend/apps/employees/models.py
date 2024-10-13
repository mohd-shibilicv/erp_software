from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
from django.utils import timezone

User = get_user_model()


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Position(models.Model):
    title = models.CharField(max_length=100, unique=True)
    is_manager = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title}"


class Employee(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    employee_id = models.CharField(max_length=10, unique=True, editable=False, blank=True, null=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    position = models.ForeignKey(Position, on_delete=models.SET_NULL, null=True)
    hire_date = models.DateField(default=None, null=True)
    birth_date = models.DateField(default=None, null=True)
    nationality = models.CharField(max_length=100, default=None, null=True)
    work_location = models.CharField(max_length=100)
    joining_date = models.DateField(auto_now_add=True)
    manager = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managed_employees",
    )
    emergency_contact = models.CharField(max_length=100, blank=True)
    emergency_phone = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-joining_date"]

    def save(self, *args, **kwargs):
        if not self.employee_id:
            self.employee_id = self.generate_employee_id()
        super().save(*args, **kwargs)

    def generate_employee_id(self):
        year = timezone.now().year
        last_employee = Employee.objects.filter(employee_id__startswith=f"{year}").order_by('employee_id').last()
        if not last_employee:
            return f"{year}0001"
        last_id = int(last_employee.employee_id[4:])
        new_id = last_id + 1
        return f"{year}{new_id:04d}"

    def __str__(self):
        return f"{self.get_full_name()} ({self.employee_id})"

    @property
    def employee_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def role(self):
        return self.position.title if self.position else None


class Attendance(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('on_leave', 'On Leave'),
        ('half_day', 'Half Day'),
        ('late', 'Late'),
        ('early_leave', 'Early Leave'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='present')
    date = models.DateField()
    check_in = models.DateTimeField(null=True, blank=True)
    check_out = models.DateTimeField(null=True, blank=True)
    overtime_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    is_remote = models.BooleanField(default=False)

    class Meta:
        unique_together = ["employee", "date"]
        ordering = ["-date"]

    @property
    def working_hours(self):
        if self.check_in and self.check_out:
            return (self.check_out - self.check_in).total_seconds() / 3600  # Convert to hours
        return 0


class Leave(models.Model):
    LEAVE_TYPES = (
        ("AL", "Annual Leave"),
        ("SL", "Sick Leave"),
        ("UL", "Unpaid Leave"),
        ("ML", "Maternity Leave"),
        ("PL", "Paternity Leave"),
        ("BL", "Bereavement Leave"),
    )

    STATUS_CHOICES = (
        ("P", "Pending"),
        ("A", "Approved"),
        ("R", "Rejected"),
        ("C", "Cancelled"),
    )

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    leave_type = models.CharField(max_length=2, choices=LEAVE_TYPES)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default="P")
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_leaves",
    )
    attachment = models.FileField(upload_to="leave_attachments/", blank=True, null=True)

    class Meta:
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.employee} - {self.get_leave_type_display()} ({self.start_date} to {self.end_date})"


class Performance(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="reviews_given"
    )
    review_date = models.DateField()
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comments = models.TextField()

    class Meta:
        ordering = ["-review_date"]

    def __str__(self):
        return f"{self.employee} - {self.review_date} ({self.rating}/5)"


class Payroll(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    pay_period_start = models.DateField()
    pay_period_end = models.DateField()
    base_salary = models.DecimalField(max_digits=10, decimal_places=2)
    overtime_pay = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_pay = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ["-pay_period_end"]

    def __str__(self):
        return f"{self.employee} - {self.pay_period_start} to {self.pay_period_end}"


class Training(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    participants = models.ManyToManyField(User, related_name="trainings")

    def __str__(self):
        return self.title

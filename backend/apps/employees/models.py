from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=10, unique=True)
    department = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    hire_date = models.DateField()
    nation = models.CharField(max_length=100, default="Qatar")
    work_branch = models.CharField(max_length=100, default="Qatar")
    joining_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-joining_date"]

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.employee_id})"


class Attendance(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    date = models.DateField()
    check_in = models.DateTimeField(null=True, blank=True)
    check_out = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ["employee", "date"]
        ordering = ["-date"]


class Leave(models.Model):
    LEAVE_TYPES = (
        ("AL", "Annual Leave"),
        ("SL", "Sick Leave"),
        ("UL", "Unpaid Leave"),
    )

    STATUS_CHOICES = (
        ("P", "Pending"),
        ("A", "Approved"),
        ("R", "Rejected"),
    )

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    leave_type = models.CharField(max_length=2, choices=LEAVE_TYPES)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default="P")

    class Meta:
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.employee} - {self.get_leave_type_display()} ({self.start_date} to {self.end_date})"

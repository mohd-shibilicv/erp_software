from django.contrib.auth.models import AbstractUser, Group
from django.contrib.auth.hashers import make_password
from django.db import models


class User(AbstractUser):
    ROLES = (
        ('branch_manager', 'Branch Manager'),
        ('admin', 'Admin'),
        ('staff', 'Staff'),
    )
    phone_number = models.CharField(max_length=15, blank=True)
    role = models.CharField(max_length=20, choices=ROLES)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("username",)

    def save(self, *args, **kwargs):
        if self.role == 'admin':
            self.is_staff = True
            self.is_superuser = True
        elif self.role == 'staff':
            self.is_staff = True
            self.is_superuser = False
        elif self.role == 'branch_manager':
            self.is_staff = False
            self.is_superuser = False
        
        if self.password and not self.password.startswith("pbkdf2_"):
            self.password = make_password(self.password)

        super().save(*args, **kwargs)

        if self.role == 'admin':
            admin_group, _ = Group.objects.get_or_create(name='Admin')
            self.groups.add(admin_group)
        elif self.role == 'staff':
            staffs_group, _ = Group.objects.get_or_create(name='Staff')
            self.groups.add(staffs_group)
        elif self.role == 'branch_manager':
            branch_manager_group, _ = Group.objects.get_or_create(name='Branch Manager')
            self.groups.add(branch_manager_group)

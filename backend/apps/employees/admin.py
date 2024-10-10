from django.contrib import admin
from unfold.admin import ModelAdmin as UnfoldAdmin
from .models import Employee


class EmployeeAdmin(UnfoldAdmin):
    list_display = ('user', 'employee_id', 'department', 'position', 'hire_date', 'nation', 'work_branch', 'joining_date', 'is_active')
    search_fields = ('user__first_name', 'user__last_name', 'employee_id', 'department', 'position')
    list_filter = ('nation', 'work_branch', 'is_active')
    ordering = ('-joining_date',)


admin.site.register(Employee, EmployeeAdmin)

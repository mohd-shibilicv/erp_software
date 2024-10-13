from django.contrib import admin
from unfold.admin import ModelAdmin as UnfoldAdmin
from .models import Employee, Department, Position, Attendance, Leave


class EmployeeAdmin(UnfoldAdmin):
    pass

admin.site.register(Employee, EmployeeAdmin)
admin.site.register(Department, UnfoldAdmin)
admin.site.register(Position, UnfoldAdmin)
admin.site.register(Attendance, UnfoldAdmin)
admin.site.register(Leave, UnfoldAdmin)

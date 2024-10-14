from unfold.admin import ModelAdmin as UnfoldModelAdmin
from django.contrib import admin
from .models import CompanyDetails,VehicleDetails

admin.site.register(CompanyDetails, UnfoldModelAdmin)
admin.site.register(VehicleDetails, UnfoldModelAdmin)



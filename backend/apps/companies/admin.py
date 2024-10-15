from unfold.admin import ModelAdmin as UnfoldModelAdmin
from django.contrib import admin
from .models import CompanyDetails,VehicleDetails,AnnualMaintenanceCost

admin.site.register(CompanyDetails, UnfoldModelAdmin)
admin.site.register(VehicleDetails, UnfoldModelAdmin)
admin.site.register(AnnualMaintenanceCost, UnfoldModelAdmin)



from unfold.admin import ModelAdmin as UnfoldModelAdmin
from django.contrib import admin
from .models import CompanyDetails

admin.site.register(CompanyDetails, UnfoldModelAdmin)



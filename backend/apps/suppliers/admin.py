from unfold.admin import ModelAdmin as UnfoldModelAdmin
from django.contrib import admin
from .models import Supplier


admin.site.register(Supplier, UnfoldModelAdmin)

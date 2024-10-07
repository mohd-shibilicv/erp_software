from unfold.admin import ModelAdmin as UnfoldModelAdmin
from django.contrib import admin
from .models import ProductInflow, ProductOutflow


admin.site.register(ProductInflow, UnfoldModelAdmin)
admin.site.register(ProductOutflow, UnfoldModelAdmin)

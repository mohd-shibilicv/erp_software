from unfold.admin import ModelAdmin as UnfoldModelAdmin
from django.contrib import admin
from .models import Product, Category, Brand


admin.site.register(Product, UnfoldModelAdmin)
admin.site.register(Category, UnfoldModelAdmin)
admin.site.register(Brand, UnfoldModelAdmin)

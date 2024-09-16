from django.contrib import admin
from .models import ClientRequest,ClientRequirement,RequirementImage, Feature,Client

admin.site.register(Client)
admin.site.register(ClientRequest)
admin.site.register(ClientRequirement)
admin.site.register(RequirementImage)
@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ('name',)

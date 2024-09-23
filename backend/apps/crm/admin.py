from django.contrib import admin
from .models import (
    ClientRequest,
    ClientRelationship,
    ClientRequirement,
    RequirementImage,
    Feature,
    Client,
    Quotation,
    QuotationItem
)

admin.site.register(Client)
admin.site.register(ClientRequest)
admin.site.register(ClientRelationship)
admin.site.register(ClientRequirement)
admin.site.register(RequirementImage)
admin.site.register(Quotation)
admin.site.register(QuotationItem)




@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ("name",)

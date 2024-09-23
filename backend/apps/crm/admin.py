from django.contrib import admin
from .models import (
    ClientRequest,
    ClientRelationship,
    ClientRequirement,
    RequirementImage,
    Feature,
    Client,
    Quotation,
    QuotationItem,
    Agreement,
    PaymentTerm
)

admin.site.register(Client)
admin.site.register(ClientRequest)
admin.site.register(ClientRelationship)
admin.site.register(ClientRequirement)
admin.site.register(RequirementImage)

@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ("name",)

admin.site.register(Quotation)
admin.site.register(QuotationItem)
admin.site.register(Agreement)
admin.site.register(PaymentTerm)

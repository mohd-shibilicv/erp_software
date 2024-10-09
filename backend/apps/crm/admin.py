from unfold.admin import ModelAdmin as UnfoldModelAdmin
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
    PaymentTerm,
    Project,
)

admin.site.register(Client, UnfoldModelAdmin)
admin.site.register(ClientRequest, UnfoldModelAdmin)
admin.site.register(ClientRelationship, UnfoldModelAdmin)
admin.site.register(ClientRequirement, UnfoldModelAdmin)
admin.site.register(RequirementImage, UnfoldModelAdmin)

@admin.register(Feature)
class FeatureAdmin(UnfoldModelAdmin):
    list_display = ("name",)

admin.site.register(Quotation, UnfoldModelAdmin)
admin.site.register(QuotationItem, UnfoldModelAdmin)
admin.site.register(Agreement, UnfoldModelAdmin)
admin.site.register(PaymentTerm, UnfoldModelAdmin)
admin.site.register(Project, UnfoldModelAdmin)

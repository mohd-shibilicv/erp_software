from django.contrib import admin
from unfold.admin import ModelAdmin as UnfoldModelAdmin
from .models import (
    PurchaseRequest,
    PurchaseRequestItem,
    LocalPurchaseOrder,
    LocalPurchaseOrderItem,
    Purchase,
    PurchaseItem,
    PurchaseReturn,
    PurchaseReturnItem,
    SalesOrder, 
    SalesOrderItem,
    Sale,
    SaleItem,
    SalesReturn,
    SalesReturnItem,
)


admin.site.register(PurchaseRequest, UnfoldModelAdmin)
admin.site.register(PurchaseRequestItem, UnfoldModelAdmin)
admin.site.register(LocalPurchaseOrder, UnfoldModelAdmin)
admin.site.register(LocalPurchaseOrderItem, UnfoldModelAdmin)
admin.site.register(Purchase, UnfoldModelAdmin)
admin.site.register(PurchaseItem, UnfoldModelAdmin)
admin.site.register(PurchaseReturn, UnfoldModelAdmin)
admin.site.register(PurchaseReturnItem, UnfoldModelAdmin)
admin.site.register(SalesOrder, UnfoldModelAdmin)
admin.site.register(SalesOrderItem, UnfoldModelAdmin)
admin.site.register(SalesReturn, UnfoldModelAdmin)
admin.site.register(Sale, UnfoldModelAdmin)
admin.site.register(SaleItem, UnfoldModelAdmin)
admin.site.register(SalesReturnItem, UnfoldModelAdmin)

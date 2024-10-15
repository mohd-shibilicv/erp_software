from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import (
    LocalPurchaseOrderItem,
    PurchaseRequestItem,
    PurchaseItem,
    PurchaseReturnItem,
    SalesReturnItem,
    SalesOrderItem,
    SaleItem,
)


@receiver([post_save, post_delete], sender=PurchaseRequestItem)
def update_purchase_request_total(sender, instance, **kwargs):
    purchase_request = instance.purchase_request
    purchase_request.total_amount = purchase_request.calculate_total()
    purchase_request.save()


@receiver([post_save, post_delete], sender=LocalPurchaseOrderItem)
def update_local_purchase_order_total(sender, instance, **kwargs):
    local_purchase_order = instance.lpo
    local_purchase_order.total_amount = local_purchase_order.calculate_total()
    local_purchase_order.save()


@receiver([post_save, post_delete], sender=PurchaseItem)
def update_purchase_total(sender, instance, **kwargs):
    purchase = instance.purchase
    purchase.total_amount = purchase.calculate_total()
    purchase.save()


@receiver([post_save, post_delete], sender=PurchaseReturnItem)
def update_purchase_return_total(sender, instance, **kwargs):
    purchase_return = instance.purchase_return
    purchase_return.total_amount = purchase_return.calculate_total()
    purchase_return.save()


@receiver([post_save, post_delete], sender=SalesReturnItem)
def update_sales_return_total(sender, instance, **kwargs):
    sales_return = instance.sales_return
    sales_return.total_amount = sales_return.calculate_total()
    sales_return.save()


@receiver([post_save, post_delete], sender=SalesOrderItem)
def update_sales_order_total(sender, instance, **kwargs):
    sales_order = instance.sales_order
    sales_order.total_amount = sales_order.calculate_total()
    sales_order.save()


@receiver([post_save, post_delete], sender=SaleItem)
def update_sale_total(sender, instance, **kwargs):
    sale = instance.sale
    sale.total_amount = sale.calculate_total()
    sale.save()

from django.db import models
from django.db.models import Sum
from django.contrib.auth import get_user_model
from apps.products.models import Product
from apps.suppliers.models import Supplier
from apps.crm.models import Client

User = get_user_model()


class PurchaseRequest(models.Model):
    request_number = models.CharField(max_length=20, unique=True, blank=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True)
    requested_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True
    )
    date_requested = models.DateField(auto_now_add=True)
    expected_delivery_date = models.DateField(null=True, blank=True)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ("Draft", "Draft"),
            ("Approved", "Approved"),
            ("Rejected", "Rejected"),
        ],
    )
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-date_requested']

    def save(self, *args, **kwargs):
        if not self.request_number:
            last_request = PurchaseRequest.objects.order_by('-id').first()
            if last_request:
                last_number = int(last_request.request_number[3:])
                self.request_number = f"PR-{last_number + 1:06d}"
            else:
                self.request_number = "PR-000001"
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.request_number}"

    def calculate_total(self):
        total = self.items.aggregate(
            total=Sum(models.F('quantity') * models.F('unit_price'))
        )['total'] or 0
        return total


class PurchaseRequestItem(models.Model):
    purchase_request = models.ForeignKey(
        PurchaseRequest, related_name="items", on_delete=models.CASCADE
    )
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE
    )
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    total_price = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )

    def save(self, *args, **kwargs):
        if self.quantity and self.unit_price:
            self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - {self.quantity}"


class LocalPurchaseOrder(models.Model):
    lpo_number = models.CharField(max_length=20, unique=True, editable=False, blank=True)  # LPO Number
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True)
    purchase_request = models.ForeignKey(
        PurchaseRequest, on_delete=models.SET_NULL, null=True, blank=True
    )  # Related PR
    date_issued = models.DateField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ("Pending", "Pending"),
            ("Approved", "Approved"),
            ("Cancelled", "Cancelled"),
            ("Received", "Received"),
        ],
    )
    delivery_date = models.DateField(null=True, blank=True)
    total_amount = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    remarks = models.TextField(blank=True)
    quotation_document = models.FileField(upload_to='quotations/', null=True, blank=True)

    class Meta:
        ordering = ['-date_issued']

    def save(self, *args, **kwargs):
        if not self.lpo_number:
            last_lpo = LocalPurchaseOrder.objects.order_by('-id').first()
            if last_lpo:
                last_number = int(last_lpo.lpo_number[4:])
                self.lpo_number = f"LPO-{last_number + 1:06d}"
            else:
                self.lpo_number = "LPO-000001"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.lpo_number}"
    
    def calculate_total(self):
        total = self.items.aggregate(
            total=Sum(models.F('quantity') * models.F('unit_price'))
        )['total'] or 0
        return total


class LocalPurchaseOrderItem(models.Model):
    lpo = models.ForeignKey(
        LocalPurchaseOrder, related_name="items", on_delete=models.CASCADE
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=15, decimal_places=2)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"{self.product.name} - {self.quantity}"


class Purchase(models.Model):
    purchase_number = models.CharField(max_length=20, unique=True, editable=False, blank=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True)
    lpo = models.ForeignKey(LocalPurchaseOrder, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ("Pending", "Pending"),
            ("Completed", "Completed"),
            ("Cancelled", "Cancelled"),
        ],
        default="Pending"
    )
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-date']

    def save(self, *args, **kwargs):
        if not self.purchase_number:
            last_purchase = Purchase.objects.order_by('-id').first()
            if last_purchase:
                last_number = int(last_purchase.purchase_number[4:])
                self.purchase_number = f"PUR-{last_number + 1:06d}"
            else:
                self.purchase_number = "PUR-000001"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.purchase_number}"

    def calculate_total(self):
        total = self.items.aggregate(
            total=Sum(models.F('quantity') * models.F('unit_price'))
        )['total'] or 0
        return total


class PurchaseItem(models.Model):
    purchase = models.ForeignKey(Purchase, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=15, decimal_places=2)

    class Meta:
        ordering = ['-id']

    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - {self.quantity}"


class PurchaseReturn(models.Model):
    return_number = models.CharField(max_length=20, unique=True, editable=False, blank=True)
    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE, related_name='returns')
    date = models.DateField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ("Pending", "Pending"),
            ("Approved", "Approved"),
            ("Completed", "Completed"),
            ("Cancelled", "Cancelled"),
        ],
        default="Pending"
    )
    reason = models.TextField(blank=True)

    class Meta:
        ordering = ['-date']

    def save(self, *args, **kwargs):
        if not self.return_number:
            last_return = PurchaseReturn.objects.order_by('-id').first()
            if last_return:
                last_number = int(last_return.return_number[4:])
                self.return_number = f"RET-{last_number + 1:06d}"
            else:
                self.return_number = "RET-000001"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.return_number}"

    def calculate_total(self):
        total = self.items.aggregate(
            total=Sum(models.F('quantity') * models.F('unit_price'))
        )['total'] or 0
        return total


class PurchaseReturnItem(models.Model):
    purchase_return = models.ForeignKey(PurchaseReturn, related_name="items", on_delete=models.CASCADE)
    purchase_item = models.ForeignKey(PurchaseItem, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=15, decimal_places=2)

    class Meta:
        ordering = ['-id']

    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.purchase_item.product.name} - {self.quantity}"


class SalesOrder(models.Model):
    order_number = models.CharField(max_length=20, unique=True, editable=False, blank=True)
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True)
    date_created = models.DateField(auto_now_add=True)
    expected_delivery_date = models.DateField(null=True, blank=True)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ("Draft", "Draft"),
            ("Confirmed", "Confirmed"),
            ("Cancelled", "Cancelled"),
        ],
        default="Draft"
    )
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-date_created']

    def save(self, *args, **kwargs):
        if not self.order_number:
            last_order = SalesOrder.objects.order_by('-id').first()
            if last_order:
                last_number = int(last_order.order_number[3:])
                self.order_number = f"SO-{last_number + 1:06d}"
            else:
                self.order_number = "SO-000001"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.order_number}"

    def calculate_total(self):
        total = self.items.aggregate(
            total=Sum(models.F('quantity') * models.F('unit_price'))
        )['total'] or 0
        return total


class SalesOrderItem(models.Model):
    sales_order = models.ForeignKey(SalesOrder, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    class Meta:
        ordering = ['-id']

    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - {self.quantity}"


class Sale(models.Model):
    sale_number = models.CharField(max_length=20, unique=True, editable=False, blank=True)
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True)
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ("Pending", "Pending"),
            ("Completed", "Completed"),
            ("Cancelled", "Cancelled"),
        ],
        default="Pending"
    )
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-date']

    def save(self, *args, **kwargs):
        if not self.sale_number:
            last_sale = Sale.objects.order_by('-id').first()
            if last_sale:
                last_number = int(last_sale.sale_number[4:])
                self.sale_number = f"SAL-{last_number + 1:06d}"
            else:
                self.sale_number = "SAL-000001"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.sale_number}"

    def calculate_total(self):
        total = self.items.aggregate(
            total=Sum(models.F('quantity') * models.F('unit_price'))
        )['total'] or 0
        return total


class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    class Meta:
        ordering = ['-id']

    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - {self.quantity}"


class SalesReturn(models.Model):
    return_number = models.CharField(max_length=20, unique=True, editable=False, blank=True)
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='returns')
    date = models.DateField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    reason = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ("Pending", "Pending"),
            ("Approved", "Approved"),
            ("Rejected", "Rejected"),
        ],
        default="Pending"
    )
    refund_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"Return {self.return_number} for Sale {self.sale.sale_number}"

    def save(self, *args, **kwargs):
        if not self.return_number:
            last_return = SalesReturn.objects.order_by('-id').first()
            if last_return:
                last_number = int(last_return.return_number[4:])
                self.return_number = f"RET-{last_number + 1:06d}"
            else:
                self.return_number = "RET-000001"
        super().save(*args, **kwargs)


class SalesReturnItem(models.Model):
    sales_return = models.ForeignKey(SalesReturn, related_name="items", on_delete=models.CASCADE)
    sale_item = models.ForeignKey(SaleItem, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    class Meta:
        ordering = ['-id']

    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.sale_item.product.name} - {self.quantity}"

# from django.db import models
# from django.contrib.auth.models import User

# class Account(models.Model):
#     name = models.CharField(max_length=100)
#     type = models.CharField(max_length=50, choices=[
#         ('CASH', 'Cash'),
#         ('BANK', 'Bank'),
#         ('PETTY', 'Petty Cash'),
#         # Add more account types as needed
#     ])
#     balance = models.DecimalField(max_digits=10, decimal_places=2)

#     def __str__(self):
#         return f"{self.name} ({self.get_type_display()})"

# class TransactionType(models.Model):
#     name = models.CharField(max_length=100)

#     def __str__(self):
#         return self.name

# class PaymentVoucher(models.Model):
#     date = models.DateField(auto_now_add=True)
#     from_account = models.ForeignKey(Account, on_delete=models.PROTECT, related_name='outgoing_payments')
#     total_amount = models.DecimalField(max_digits=10, decimal_places=2)
#     created_by = models.ForeignKey(User, on_delete=models.PROTECT)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"Payment Voucher {self.id} - {self.date}"

# class PaymentDetail(models.Model):
#     voucher = models.ForeignKey(PaymentVoucher, on_delete=models.CASCADE, related_name='payment_details')
#     to_account = models.ForeignKey(Account, on_delete=models.PROTECT, related_name='incoming_payments')
#     amount = models.DecimalField(max_digits=10, decimal_places=2)
#     remarks = models.TextField(blank=True)
#     transaction_type = models.ForeignKey(TransactionType, on_delete=models.PROTECT)

#     def __str__(self):
#         return f"Payment Detail for Voucher {self.voucher.id} - {self.to_account.name}"
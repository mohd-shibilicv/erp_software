from django.db import models
import datetime
from apps.employees.models import Employee
from apps.crm.models import Client
class NatureGroup(models.Model):
    """
    Represents a nature group that acts as a main group in the system.
    
    Attributes:
        name (CharField): The unique name of the nature group with a maximum length of 100 characters.
    """
    
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class MainGroup(models.Model):
    """
    Represents a main group that serves as a subgroup within a NatureGroup.
    
    Attributes:
        name (CharField): The unique name of the main group with a maximum length of 100 characters.
        nature_group (ForeignKey): A reference to the related NatureGroup, creating a many-to-one relationship.
    """
    
    name = models.CharField(max_length=100, unique=True)
    nature_group = models.ForeignKey(
        NatureGroup, on_delete=models.CASCADE, related_name="main_groups"
    )

    def __str__(self):
        return self.name




class Ledger(models.Model):
    """
    Represents a ledger for financial tracking, tied to a specific MainGroup.
    
    Attributes:
        name (CharField): The name of the ledger with a maximum length of 100 characters.
        opening_balance (DecimalField): The initial balance of the ledger, with up to 10 digits and 2 decimal places. Defaults to 0.00.
        date (DateField): The creation date of the ledger, defaulting to the current date.
        group (ForeignKey): A reference to the MainGroup that the ledger belongs to, creating a many-to-one relationship.
        debit_credit (CharField): Specifies whether the ledger is in Debit or Credit, with available choices "DEBIT" or "CREDIT".
        master_data (CharField): Specifies the type of master data, with choices "customer" or "employee".
        customer_ref (ForeignKey): A reference to the customer, related to the master_data type.
        employee_ref (ForeignKey): A reference to the employee, related to the master_data type.
    """
    
    MASTER_DATA_CHOICES = [
        ('customer', 'Customer'),
        ('employee', 'Employee')
    ]
    
    name = models.CharField(max_length=100)
    opening_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    date = models.DateField(default=datetime.date.today)
    group = models.ForeignKey(MainGroup, on_delete=models.CASCADE, related_name="ledgers")
    debit_credit = models.CharField(max_length=6, choices=[("DEBIT", "Debit"), ("CREDIT", "Credit")], blank=True)
    
    master_data = models.CharField(max_length=10, choices=MASTER_DATA_CHOICES, blank=True)
    customer_ref = models.ForeignKey(Client, on_delete=models.SET_NULL, blank=True, null=True)
    employee_ref = models.ForeignKey(Employee, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return self.name


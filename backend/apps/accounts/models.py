from django.db import models
import datetime


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
        mobile_no (CharField): An optional mobile number associated with the ledger, with a maximum length of 15 characters.
        opening_balance (DecimalField): The initial balance of the ledger, with up to 10 digits and 2 decimal places. Defaults to 0.00.
        date (DateField): The creation date of the ledger, defaulting to the current date.
        group (ForeignKey): A reference to the MainGroup that the ledger belongs to, creating a many-to-one relationship.
        debit_credit (CharField): Specifies whether the ledger is in Debit or Credit, with available choices "DEBIT" or "CREDIT".
    """
    
    name = models.CharField(max_length=100)
    mobile_no = models.CharField(max_length=15, blank=True, null=True)
    opening_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    date = models.DateField(default=datetime.date.today)
    group = models.ForeignKey(
        MainGroup, on_delete=models.CASCADE, related_name="ledgers"
    )
    debit_credit = models.CharField(
        max_length=6, choices=[("DEBIT", "Debit"), ("CREDIT", "Credit")], blank=True
    )

    def __str__(self):
        return self.name

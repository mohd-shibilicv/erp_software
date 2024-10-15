from django.db import models


from django.db import models

class CompanyDetails(models.Model):
    """
    Model to store company details including registration numbers, expiry dates, and document images.
    """

    company_name = models.CharField(
        max_length=255, 
        unique=True,
        help_text="The official name of the company."
    )
    cr_no = models.CharField(
        max_length=100, 
        blank=True, 
        help_text="The company's Commercial Registration (CR) number."
    )
    cr_expiry = models.DateField(
        blank=True, 
        null=True, 
        help_text="The expiry date of the company's Commercial Registration (CR)."
    )
    ruksa_number = models.CharField(
        max_length=100, 
        blank=True, 
        help_text="The company's Ruksa number."
    )
    ruksa_expiry = models.DateField(
        blank=True, 
        null=True, 
        help_text="The expiry date of the company's Ruksa."
    )
    computer_card = models.CharField(
        max_length=100, 
        blank=True, 
        help_text="The company's Computer Card number."
    )
    computer_card_expiry = models.DateField(
        blank=True, 
        null=True, 
        help_text="The expiry date of the company's Computer Card."
    )
    cr_image = models.ImageField(
        upload_to='cr_images/', 
        blank=True, 
        null=True, 
        help_text="Image of the company's CR document."
    )
    ruksa_image = models.ImageField(
        upload_to='ruksa_images/', 
        blank=True, 
        null=True, 
        help_text="Image of the company's Ruksa document."
    )
    computer_card_image = models.ImageField(
        upload_to='computer_card_images/', 
        blank=True, 
        null=True, 
        help_text="Image of the company's Computer Card document."
    )

    def __str__(self):
        return self.company_name


class VehicleDetails(models.Model):
    """
    A model representing details of a vehicle in the system.

    This model stores information about vehicles, including their identification,
    ownership, and associated company. It is used to track and manage vehicle
    information within the application.

    Fields:
    - vehicle_name: The name or identifier of the vehicle.
    - vehicle_no: The unique registration number or license plate of the vehicle.
    - expiry_date: The date when the vehicle's registration or permit expires.
    - vehicle_model: The model or type of the vehicle.
    - owner_id: An identifier for the owner of the vehicle.
    - company: A foreign key relationship to the Company model, representing the
               company that owns or is associated with the vehicle.

    The 'company' field allows for organizing vehicles by their associated companies,
    enabling efficient querying and management of vehicle fleets.
    """

    vehicle_name = models.CharField(max_length=100, help_text="Name or identifier of the vehicle")
    vehicle_no = models.CharField(max_length=20, unique=True, help_text="Unique registration number or license plate")
    expiry_date = models.DateField(help_text="Date when the vehicle's registration or permit expires")
    vehicle_model = models.CharField(max_length=50, help_text="Model or type of the vehicle")
    owner_id = models.CharField(max_length=50, help_text="Identifier for the owner of the vehicle")
    company = models.ForeignKey('CompanyDetails', on_delete=models.CASCADE, related_name='vehicles', help_text="Company associated with the vehicle")

    created_at = models.DateTimeField(auto_now_add=True, help_text="Timestamp when the record was created")
    updated_at = models.DateTimeField(auto_now=True, help_text="Timestamp when the record was last updated")

    def __str__(self):
        return f"{self.vehicle_name} ({self.vehicle_no})"

    class Meta:
        verbose_name = "Vehicle Detail"
        verbose_name_plural = "Vehicle Details"
        ordering = ['-created_at']


class AnnualMaintenanceCost(models.Model):
    """
    Model representing the annual maintenance cost (AMC) details for a company.

    Attributes:
    -----------
    fire_certification_image : ImageField
        An image field to upload the fire certification document.
    amc_contract_image : ImageField
        An image field to upload the AMC (Annual Maintenance Contract) document.
    fire_contract_remark : TextField
        A text field to provide remarks or notes about the fire certification and contract.
    amc_start_date : DateField
        The starting date of the AMC contract.
    amc_end_date : DateField
        The ending date of the AMC contract.
    amc_contract_remark : TextField
        A text field to provide additional remarks related to the AMC contract.
    amc_percentage : DecimalField
        A decimal field representing the percentage of the AMC.
    amc_amount : DecimalField
        A decimal field representing the total amount of the AMC.

    Methods:
    --------
    __str__():
        Returns a string representation of the AMC instance, showing the start and end date.
    """

    fire_certification_image = models.ImageField(upload_to='fire_certifications/', blank=True, null=True)
    amc_contract_image = models.ImageField(upload_to='amc_contracts/', blank=True, null=True)
    fire_contract_remark = models.TextField(blank=True, null=True)
    amc_start_date = models.DateField(blank=True, null=True)
    amc_end_date = models.DateField(blank=True, null=True)
    amc_contract_remark = models.TextField(blank=True, null=True)
    amc_percentage = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    amc_percentage_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    amc_total_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)


    def __str__(self):
        return f"AMC from {self.amc_start_date} to {self.amc_end_date}"

    class Meta:
        verbose_name = "Annual Maintenance Cost"
        verbose_name_plural = "Annual Maintenance Costs"
        ordering = ['-amc_end_date']
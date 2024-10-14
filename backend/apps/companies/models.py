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

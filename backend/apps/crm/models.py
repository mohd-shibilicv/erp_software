from django.db import models

class ClientRequests(models.Model):
    COMPANY_SIZE_CHOICES = [
        ('small', '0-10'),
        ('medium', '10-50'),
        ('large', '50-100'),
        ('corporate', 'Above 100'),
    ]

    PLATFORM_CHOICES = [
        ('zoom', 'Zoom'),
        ('meet', 'Google Meet'),
        ('phone', 'Phone Call'),
    ]

    client_name = models.CharField(max_length=255)
    client_email = models.EmailField(max_length=255)
    client_number = models.CharField(max_length=15)
    company_name = models.CharField(max_length=255)
    schedule_date = models.DateTimeField()
    company_size = models.CharField(choices=COMPANY_SIZE_CHOICES)
    platform = models.CharField(choices=PLATFORM_CHOICES)

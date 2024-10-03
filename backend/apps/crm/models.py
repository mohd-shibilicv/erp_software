import json
from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.postgres.fields import ArrayField
from apps.users.models import User
from apps.products.models import Product
from django.core.exceptions import ValidationError
from django.utils import timezone


class Client(models.Model):
    name = models.CharField(max_length=255)
    mobile_number = models.CharField(max_length=20)
    whatsapp_number = models.CharField(max_length=20)
    email = models.EmailField()
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("created_at",)

    def __str__(self):
        return self.name


class ClientRequest(models.Model):
    COMPANY_SIZE_CHOICES = [
        ("small", "0 - 10"),
        ("medium", "10 - 50"),
        ("large", "50 - 100"),
        ("corporate", "Above 100"),
    ]

    PLATFORM_CHOICES = [
        ("zoom", "Zoom"),
        ("google_meet", "Google Meet"),
        ("microsoft_teams", "Microsoft Teams"),
        ("phone", "Phone Call"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("cancelled", "Cancelled"),
        ("scheduled", "Scheduled"),
        ("completed", "Completed"),
    ]

    assigned_staff = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    client_name = models.CharField(max_length=255)
    client_email = models.EmailField(max_length=255)
    client_number = models.CharField(max_length=15)
    company_name = models.CharField(max_length=255)
    scheduled_date = models.DateTimeField()
    company_size = models.CharField(max_length=20, choices=COMPANY_SIZE_CHOICES)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    service_requested = models.CharField(max_length=255)
    project_details = models.TextField()

    class Meta:
        ordering = ("created_at",)

    def __str__(self):
        return f"Demo Request for {self.company_name} on {self.scheduled_date}"


class ClientRelationship(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
    ]

    CARE_OF_CHOICES = [
        ("nasscript", "Nasscript"),
        ("hisaan", "Hisaan"),
    ]

    client = models.ForeignKey(
        Client, on_delete=models.CASCADE, related_name="relationships"
    )
    reminder_date = models.DateField(null=True, blank=True)
    meeting_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    care_of = models.CharField(
        max_length=20, choices=CARE_OF_CHOICES, default="nasscript"
    )
    short_note = models.CharField(max_length=255, blank=True)
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    _products = models.JSONField(db_column="products")

    class Meta:
        ordering = ("created_at",)

    @property
    def products(self):
        return self._products if isinstance(self._products, list) else []

    @products.setter
    def products(self, value):
        self._products = value if isinstance(value, list) else []

    def __str__(self):
        return f"{self.client.name} - {self.get_status_display()}"


class Feature(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class ClientRequirement(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
    ]

    client = models.ForeignKey(
        Client, related_name="requirements", on_delete=models.CASCADE
    )
    file_number = models.CharField(max_length=255)
    color_theme = models.CharField(max_length=255)
    layout = models.CharField(max_length=255)
    additional_requirements = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    predefined_features = models.ManyToManyField(
        Feature, related_name="requirements", blank=True
    )
    custom_features = models.TextField(blank=True, default="[]")


    def __str__(self):
        return f"{self.client} - {self.file_number}"

    def set_custom_features(self, features):
        if isinstance(features, list):
            self.custom_features = json.dumps(features)
        elif isinstance(features, str):
            self.custom_features = json.dumps(features.split(','))
        else:
            raise ValueError("Features must be a list or a comma-separated string")
    
    def get_custom_features(self):
        if not self.custom_features:
            return []
        try:
            return json.loads(self.custom_features)
        except json.JSONDecodeError:
            return [feature.strip() for feature in self.custom_features.split(',')]


class RequirementImage(models.Model):
    client_requirement = models.ForeignKey(
        ClientRequirement, related_name="images", on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="requirement_images/")


class Quotation(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('PENDING_APPROVAL', 'Pending Approval'),
        ('APPROVED', 'Approved'),
        ('SENT', 'Sent to Client'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('EXPIRED', 'Expired'),
    ]
    quotation_number = models.CharField(max_length=50, unique=True)
    version = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    valid_until = models.DateField()
    client = models.ForeignKey(Client, on_delete=models.PROTECT)
    client_reference = models.CharField(max_length=100, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='quotations_created')
    last_updated_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='quotations_updated')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_quotations')
    subtotal = models.DecimalField(max_digits=14, decimal_places=2, validators=[MinValueValidator(0)])
    discount_amount = models.DecimalField(max_digits=14, decimal_places=2, validators=[MinValueValidator(0)])
    total_amount = models.DecimalField(max_digits=14, decimal_places=2, validators=[MinValueValidator(0)])
    notes = models.TextField(blank=True)
    terms_and_conditions = models.TextField(blank=True)
    requires_approval = models.BooleanField(default=False)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_quotations')
    approved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Quotation {self.quotation_number} - {self.client}"
    
    def calculate_subtotal(self):
        return sum(item.subtotal for item in self.items.all())

    def calculate_discount_amount(self):
        return sum(item.subtotal * (item.discount_percentage / 100) for item in self.items.all())

    def calculate_total(self):
        subtotal = self.calculate_subtotal()
        discount_amount = self.calculate_discount_amount()
        return subtotal - discount_amount

    def update_totals(self):
        self.subtotal = self.calculate_subtotal()
        self.discount_amount = self.calculate_discount_amount()
        self.total_amount = self.calculate_total()
        super(Quotation, self).save(update_fields=['subtotal', 'discount_amount', 'total_amount'])

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.subtotal = 0
            self.discount_amount = 0
            self.total_amount = 0
        super(Quotation, self).save(*args, **kwargs)


class QuotationItem(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    description = models.TextField(blank=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    unit_price = models.DecimalField(max_digits=14, decimal_places=2, validators=[MinValueValidator(0)])
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    subtotal = models.DecimalField(max_digits=14, decimal_places=2, validators=[MinValueValidator(0)])

    def __str__(self):
        return f"{self.product}"
    
    def save(self, *args, **kwargs):
        self.subtotal = self.quantity * self.unit_price
        super(QuotationItem, self).save(*args, **kwargs)
        self.quotation.update_totals()


class Agreement(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.SET_NULL, null=True)
    tc_file = models.FileField(upload_to='terms_conditions/', null=True, blank=True)
    signed_agreement = models.FileField(upload_to='signed_agreements/', null=True, blank=True)
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True)
    company_name = models.CharField(max_length=255)
    company_address = models.CharField(max_length=255, blank=True)
    cr_number = models.CharField(max_length=50)
    baladiya = models.CharField(max_length=255, blank=True)
    project_name = models.CharField(max_length=255)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    project_start_date = models.DateField()
    project_end_date = models.DateField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.cr_number


class PaymentTerm(models.Model):
    agreement = models.ForeignKey(Agreement, related_name='payment_terms', on_delete=models.CASCADE)
    date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)


class Project(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('on_hold', 'On Hold'),
        ('completed', 'Completed'),
    ]

    project_name = models.CharField(max_length=255)
    project_id = models.CharField(max_length=100, unique=True,null=True,blank=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    requirements = models.ForeignKey(ClientRequirement, on_delete=models.CASCADE, related_name='projects',null=True,blank=True)
    agreement = models.ForeignKey(Agreement, on_delete=models.CASCADE, related_name='project_agreement',null=True,blank=True)
    project_description = models.TextField(blank=True, null=True)
    priority_level = models.CharField(max_length=6, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default='not_started')  
    assigned_staffs = models.ManyToManyField(User, related_name='assigned_projects', blank=True)
    active = models.BooleanField(default=False)  

    def save(self, *args, **kwargs):
        if self.status == 'completed':
            self.active = True
        else:
            self.active = False
        super(Project, self).save(*args, **kwargs)

        if hasattr(self, '_assigned_staffs'):
            self.update_staff_assignments()

    
    def update_staff_assignments(self):
        current_assignments = ProjectAssignedStaffs.objects.filter(project=self)
        current_staff_ids = set(current_assignments.values_list('staff_id', flat=True))
        new_staff_ids = set(self.assigned_staffs.values_list('id', flat=True))
        staff_to_remove = current_staff_ids - new_staff_ids
        current_assignments.filter(staff_id__in=staff_to_remove).update(is_active=False)

        staff_to_add = new_staff_ids - current_staff_ids
        for staff_id in staff_to_add:
            ProjectAssignedStaffs.objects.create(
                project=self,
                staff_id=staff_id,
                project_name=self.project_name,
                project_reference_id=self.project_id,
                is_active=True
            )

        staff_to_reactivate = new_staff_ids & current_staff_ids
        current_assignments.filter(staff_id__in=staff_to_reactivate).update(is_active=True)

    def __str__(self):
        return self.project_name

    

class ProjectAssignedStaffs(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='staff_assignments')
    staff = models.ForeignKey(User, on_delete=models.CASCADE, related_name='project_assignments')
    project_name = models.CharField(max_length=255)
    project_reference_id = models.CharField(max_length=100, null=True, blank=True)  
    assigned_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Project Assigned Staff'
        verbose_name_plural = 'Project Assigned Staffs'
        unique_together = ('project', 'staff')

    def __str__(self):
        return f"{self.project_name} - {self.staff.username}"

def task_file_path(instance, filename):
    return f'uploads/project_{instance.project_staff.project.id}/tasks/{filename}'


class ProjectTask(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
    ]

    project_staff = models.ForeignKey(ProjectAssignedStaffs,on_delete=models.CASCADE,related_name='tasks')
    title = models.CharField(max_length=255,null=True,blank=True)
    description = models.TextField(null=True,blank=True)
    deadline = models.DateTimeField()
    attachment = models.FileField(
        upload_to=task_file_path,
        null=True,
        blank=True
    )
    priority = models.CharField(
        max_length=6,
        choices=PRIORITY_CHOICES,
        default='medium'
    )
    status = models.CharField(
        max_length=11,
        choices=STATUS_CHOICES,
        default='pending',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.project_staff.staff.username}"

    def clean(self):
        if self.deadline and self.deadline < timezone.now():
            raise ValidationError({'deadline': 'Deadline cannot be in the past'})
        
        if not self.project_staff.is_active:
            raise ValidationError('Cannot create task for inactive project assignment')
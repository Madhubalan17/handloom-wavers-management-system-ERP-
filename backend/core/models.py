from django.db import models

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Manager', 'Manager'),
        ('Staff', 'Staff'),
        ('Storekeeper', 'Storekeeper'),
        ('Weaver', 'Weaver'),
    ]
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]

    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Stored for demonstration in prototype
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='Weaver')
    phone = models.CharField(max_length=20, blank=True, default='')
    village = models.CharField(max_length=100, default='Erode')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    last_login_str = models.CharField(max_length=100, blank=True, default='Never')
    avatar = models.ImageField(upload_to='avatars/users/', max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.name} ({self.role}) - {self.email}"


class Weaver(models.Model):
    GENDER_CHOICES = [
        ('Female', 'Female'),
        ('Male', 'Male'),
        ('Other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]

    name = models.CharField(max_length=150)
    village = models.CharField(max_length=100, default='Nallapatti')
    phone = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='Female')
    age = models.CharField(max_length=10, default='38')
    father_spouse = models.CharField(max_length=150, blank=True, default='')
    artisan_card_no = models.CharField(max_length=100, default='TN-ERD-2026-884')
    address = models.TextField(blank=True, default='')
    pincode = models.CharField(max_length=20, default='638052')
    assigned_loom = models.CharField(max_length=50, default='L-001')
    loom_type = models.CharField(max_length=50, default='Handloom')
    experience_years = models.CharField(max_length=10, default='12')
    specialty = models.CharField(max_length=200, default='Pure Silk & Zari Weaving')
    daily_capacity = models.CharField(max_length=100, default='4.5 mtrs / day')
    bank_name = models.CharField(max_length=150, default='State Bank of India')
    bank_account = models.CharField(max_length=50, default='30495810294')
    ifsc_code = models.CharField(max_length=30, default='SBIN0001248')
    avatar = models.ImageField(upload_to='avatars/weavers/', max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.name} ({self.village}) - Loom: {self.assigned_loom}"


class Loom(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Maintenance', 'Maintenance'),
        ('Under Repair', 'Under Repair'),
    ]

    loom_no = models.CharField(max_length=50, unique=True)
    loom_type = models.CharField(max_length=100, default='Handloom')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Active')
    assigned_weaver = models.CharField(max_length=150, blank=True, default='')
    cluster_village = models.CharField(max_length=100, default='Nallapatti')
    daily_capacity = models.CharField(max_length=100, blank=True, default='12 mtrs / day')
    reed_width = models.CharField(max_length=50, blank=True, default='48 inches')
    image = models.ImageField(upload_to='looms/', max_length=500, blank=True, null=True)
    remarks = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['loom_no']

    def __str__(self):
        return f"{self.loom_no} - {self.loom_type} ({self.status})"


class YarnStock(models.Model):
    STATUS_CHOICES = [
        ('In Stock', 'In Stock'),
        ('Low Stock', 'Low Stock'),
        ('Out of Stock', 'Out of Stock'),
    ]

    yarn_type = models.CharField(max_length=150)
    quantity_kg = models.FloatField(default=0.0)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='In Stock')
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=450.00)
    supplier = models.CharField(max_length=200, default='Co-optex Yarn Depot')
    image = models.ImageField(upload_to='yarn_stock/', max_length=500, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.yarn_type}: {self.quantity_kg} Kg ({self.status})"


class ProductionRecord(models.Model):
    weaver_name = models.CharField(max_length=150)
    loom_no = models.CharField(max_length=50)
    meters_produced = models.FloatField(default=0.0)
    fabric_type = models.CharField(max_length=150, default='Pure Silk')
    production_date = models.DateField()
    fabric_image = models.ImageField(upload_to='production_fabric/', max_length=500, blank=True, null=True)
    remarks = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-production_date']

    def __str__(self):
        return f"{self.weaver_name} ({self.loom_no}) - {self.meters_produced}m on {self.production_date}"


class SalaryRecord(models.Model):
    STATUS_CHOICES = [
        ('Paid', 'Paid'),
        ('Pending', 'Pending'),
    ]

    weaver_name = models.CharField(max_length=150)
    month = models.CharField(max_length=50, default='Nov 2026')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=8000.00)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Paid')
    payment_date = models.DateField(null=True, blank=True)
    transaction_ref = models.CharField(max_length=100, blank=True, default='TXN-HWMS-8921')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"{self.weaver_name} - {self.month}: ₹{self.amount} ({self.status})"

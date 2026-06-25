from django.db import models

class Lead(models.Model):
    PRIORITY_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    company = models.CharField(max_length=255, blank=True, null=True)
    requirement = models.TextField()
    
    # AI Classification
    category = models.CharField(max_length=100, blank=True, null=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, blank=True, null=True)
    
    # Tracking
    tracking_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    email_sent = models.BooleanField(default=False)
    opened = models.BooleanField(default=False)
    clicked = models.BooleanField(default=False)
    open_count = models.IntegerField(default=0)
    click_count = models.IntegerField(default=0)
    
    # Metadata
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.email}"

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLES = [('patient','Patient'),('doctor','Doctor'),('nurse','Nurse'),('admin','Admin'),('staff','Staff')]
    role        = models.CharField(max_length=20, choices=ROLES, default='patient')
    phone       = models.CharField(max_length=20, blank=True)
    profile_pic = models.ImageField(upload_to='profiles/', blank=True, null=True)
    def __str__(self): return f"{self.get_full_name()} ({self.role})"

class Patient(models.Model):
    user        = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    dob         = models.DateField(null=True, blank=True)
    gender      = models.CharField(max_length=10, blank=True)
    blood_group = models.CharField(max_length=5, blank=True)
    division    = models.CharField(max_length=50, blank=True)
    address     = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"Patient: {self.user.get_full_name()}"

class Doctor(models.Model):
    user             = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialty        = models.CharField(max_length=100)
    hospital         = models.CharField(max_length=150)
    experience       = models.CharField(max_length=50)
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2, default=500)
    rating           = models.DecimalField(max_digits=3, decimal_places=1, default=4.5)
    is_available     = models.BooleanField(default=True)
    bio              = models.TextField(blank=True)
    created_at       = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"Dr. {self.user.get_full_name()} – {self.specialty}"

class TimeSlot(models.Model):
    doctor    = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='slots')
    slot_time = models.CharField(max_length=20)
    is_booked = models.BooleanField(default=False)
    def __str__(self): return f"{self.doctor} – {self.slot_time}"

class Appointment(models.Model):
    TYPES    = [('Online','Online'),('Offline','Offline')]
    STATUSES = [('Pending','Pending'),('Confirmed','Confirmed'),('Completed','Completed'),('Cancelled','Cancelled')]
    patient    = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor     = models.ForeignKey(Doctor,  on_delete=models.CASCADE, related_name='appointments')
    date       = models.DateField()
    time_slot  = models.CharField(max_length=20)
    type       = models.CharField(max_length=10, choices=TYPES, default='Online')
    status     = models.CharField(max_length=20, choices=STATUSES, default='Pending')
    complaint  = models.TextField(blank=True)
    fee        = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta: ordering = ['-date','-created_at']
    def __str__(self): return f"APT-{self.id}: {self.patient} → {self.doctor} on {self.date}"

class Prescription(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.SET_NULL, null=True, blank=True, related_name='prescription')
    patient     = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='prescriptions')
    doctor      = models.ForeignKey(Doctor,  on_delete=models.CASCADE, related_name='prescriptions')
    diagnosis   = models.CharField(max_length=255)
    note        = models.TextField(blank=True)
    follow_up   = models.DateField(null=True, blank=True)
    is_uploaded = models.BooleanField(default=False)
    upload_file = models.FileField(upload_to='prescriptions/', blank=True, null=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"PRX-{self.id}: {self.diagnosis}"

class Medicine(models.Model):
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='medicines')
    name         = models.CharField(max_length=200)
    dose         = models.CharField(max_length=100)
    duration     = models.CharField(max_length=100)
    instruction  = models.TextField(blank=True)
    def __str__(self): return f"{self.name} – {self.dose}"

class MedicalTest(models.Model):
    STATUSES = [('Pending','Pending'),('In Progress','In Progress'),('Completed','Completed')]
    patient      = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='tests')
    doctor       = models.ForeignKey(Doctor,  on_delete=models.CASCADE, related_name='test_requests')
    test_name    = models.CharField(max_length=200)
    category     = models.CharField(max_length=100, blank=True)
    notes        = models.TextField(blank=True)
    is_urgent    = models.BooleanField(default=False)
    status       = models.CharField(max_length=20, choices=STATUSES, default='Pending')
    report_file  = models.FileField(upload_to='test_reports/', blank=True, null=True)
    result_data  = models.JSONField(default=dict, blank=True)
    request_date = models.DateField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)
    class Meta: ordering = ['-request_date']
    def __str__(self): return f"TST-{self.id}: {self.test_name} – {self.status}"

class Payment(models.Model):
    METHODS  = [('bKash','bKash'),('Nagad','Nagad'),('Rocket','Rocket'),('Card','Card')]
    STATUSES = [('Pending','Pending'),('Paid','Paid'),('Failed','Failed'),('Refunded','Refunded')]
    appointment    = models.OneToOneField(Appointment, on_delete=models.SET_NULL, null=True, blank=True, related_name='payment')
    patient        = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='payments')
    amount         = models.DecimalField(max_digits=10, decimal_places=2)
    method         = models.CharField(max_length=20, choices=METHODS, default='bKash')
    status         = models.CharField(max_length=20, choices=STATUSES, default='Pending')
    transaction_id = models.CharField(max_length=100, blank=True)
    description    = models.CharField(max_length=255, blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)
    class Meta: ordering = ['-created_at']
    def __str__(self): return f"PAY-{self.id}: ৳{self.amount} ({self.status})"

class Notification(models.Model):
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message    = models.TextField()
    is_read    = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta: ordering = ['-created_at']
    def __str__(self): return f"Notif → {self.user}: {self.message[:50]}"

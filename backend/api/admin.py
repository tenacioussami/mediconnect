from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Patient, Doctor, TimeSlot, Appointment, Prescription, Medicine, MedicalTest, Payment, Notification

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ['username', 'email', 'get_full_name', 'role', 'is_active']
    list_filter   = ['role', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    fieldsets     = BaseUserAdmin.fieldsets + (('Role & Contact', {'fields': ('role', 'phone', 'profile_pic')}),)

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display  = ['user', 'blood_group', 'gender', 'division', 'created_at']
    search_fields = ['user__first_name', 'user__last_name', 'user__email']
    list_filter   = ['gender', 'blood_group', 'division']

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display  = ['user', 'specialty', 'hospital', 'consultation_fee', 'rating', 'is_available']
    list_filter   = ['specialty', 'is_available']
    search_fields = ['user__first_name', 'user__last_name', 'specialty', 'hospital']
    list_editable = ['is_available', 'consultation_fee']

@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ['doctor', 'slot_time', 'is_booked']
    list_filter  = ['is_booked']

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display  = ['id', 'patient', 'doctor', 'date', 'time_slot', 'type', 'status', 'fee']
    list_filter   = ['status', 'type', 'date']
    search_fields = ['patient__user__first_name', 'doctor__user__first_name']
    list_editable = ['status']
    date_hierarchy = 'date'

class MedicineInline(admin.TabularInline):
    model  = Medicine
    extra  = 1

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient', 'doctor', 'diagnosis', 'created_at']
    inlines      = [MedicineInline]
    search_fields = ['diagnosis', 'patient__user__first_name', 'doctor__user__first_name']

@admin.register(MedicalTest)
class MedicalTestAdmin(admin.ModelAdmin):
    list_display  = ['id', 'patient', 'doctor', 'test_name', 'status', 'is_urgent', 'request_date']
    list_filter   = ['status', 'is_urgent', 'category']
    list_editable = ['status']
    search_fields = ['test_name', 'patient__user__first_name']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display  = ['id', 'patient', 'amount', 'method', 'status', 'transaction_id', 'created_at']
    list_filter   = ['status', 'method']
    search_fields = ['patient__user__first_name', 'transaction_id']

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'message', 'is_read', 'created_at']
    list_filter  = ['is_read']

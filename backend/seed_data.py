"""
Run this after migrations to populate demo data:
    python seed_data.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mediconnect.settings')
django.setup()

from django.contrib.auth import get_user_model
from api.models import Patient, Doctor, TimeSlot, Appointment, Prescription, Medicine, MedicalTest, Payment, Notification
from decimal import Decimal
import datetime

User = get_user_model()

print("🌱 Seeding MediConnect database...")

# ── Superuser / Admin ──────────────────────────────────────────────────────────
if not User.objects.filter(username='admin').exists():
    admin = User.objects.create_superuser(
        username='admin', email='admin@mediconnect.com',
        password='admin123', first_name='Admin', last_name='User', role='admin'
    )
    print("  ✅ Admin created  → username: admin  password: admin123")

# ── Doctors ───────────────────────────────────────────────────────────────────
doctors_data = [
    dict(username='dr_ayesha',  email='ayesha@mediconnect.com',  first_name='Ayesha',  last_name='Rahman',
         specialty='Cardiology',      hospital='Dhaka Medical Center', experience='12 years', fee=800,  rating=4.9),
    dict(username='dr_tanvir',  email='tanvir@mediconnect.com',  first_name='Tanvir',  last_name='Ahmed',
         specialty='Neurology',       hospital='Square Hospital',       experience='8 years',  fee=1000, rating=4.7),
    dict(username='dr_nusrat',  email='nusrat@mediconnect.com',  first_name='Nusrat',  last_name='Jahan',
         specialty='Dermatology',     hospital='Popular Diagnostic',   experience='6 years',  fee=600,  rating=4.8),
    dict(username='dr_kamrul',  email='kamrul@mediconnect.com',  first_name='Kamrul',  last_name='Islam',
         specialty='Orthopedics',     hospital='Ibn Sina Hospital',     experience='15 years', fee=1200, rating=4.6),
    dict(username='dr_farida',  email='farida@mediconnect.com',  first_name='Farida',  last_name='Begum',
         specialty='Pediatrics',      hospital='Shishu Hospital',       experience='10 years', fee=700,  rating=4.9),
    dict(username='dr_rezaul',  email='rezaul@mediconnect.com',  first_name='Rezaul',  last_name='Karim',
         specialty='General Medicine',hospital='City Health Clinic',    experience='5 years',  fee=500,  rating=4.5),
]

slots_map = {
    'dr_ayesha': ['9:00 AM','10:00 AM','2:00 PM','4:00 PM'],
    'dr_tanvir': ['10:30 AM','12:00 PM','3:00 PM'],
    'dr_nusrat': ['9:30 AM','11:00 AM'],
    'dr_kamrul': ['8:00 AM','1:00 PM','5:00 PM'],
    'dr_farida': ['9:00 AM','11:00 AM','3:30 PM'],
    'dr_rezaul': ['10:00 AM','12:30 PM','4:30 PM'],
}

for d in doctors_data:
    if not User.objects.filter(username=d['username']).exists():
        u = User.objects.create_user(
            username=d['username'], email=d['email'], password='doctor123',
            first_name=d['first_name'], last_name=d['last_name'], role='doctor',
            phone='017' + str(hash(d['username']))[-8:]
        )
        doc = Doctor.objects.create(
            user=u, specialty=d['specialty'], hospital=d['hospital'],
            experience=d['experience'], consultation_fee=Decimal(str(d['fee'])),
            rating=Decimal(str(d['rating'])), is_available=True
        )
        for slot in slots_map.get(d['username'], []):
            TimeSlot.objects.create(doctor=doc, slot_time=slot)
        print(f"  ✅ Doctor created → {d['username']}  password: doctor123")

# ── Patient ───────────────────────────────────────────────────────────────────
if not User.objects.filter(username='farhan').exists():
    pu = User.objects.create_user(
        username='farhan', email='farhan@gmail.com', password='patient123',
        first_name='Md Farhan', last_name='Hossain', role='patient', phone='01712345678'
    )
    patient = Patient.objects.create(
        user=pu, dob=datetime.date(2001, 5, 15), gender='Male',
        blood_group='B+', division='Dhaka'
    )
    print("  ✅ Patient created → farhan  password: patient123")
else:
    pu = User.objects.get(username='farhan')
    patient = pu.patient_profile

# ── Nurse ─────────────────────────────────────────────────────────────────────
if not User.objects.filter(username='nurse_sadia').exists():
    User.objects.create_user(
        username='nurse_sadia', email='sadia@mediconnect.com', password='nurse123',
        first_name='Sadia', last_name='Akter', role='nurse', phone='01911223344'
    )
    print("  ✅ Nurse created  → nurse_sadia  password: nurse123")

# ── Appointments ──────────────────────────────────────────────────────────────
doc1 = Doctor.objects.get(user__username='dr_ayesha')
doc2 = Doctor.objects.get(user__username='dr_tanvir')
doc3 = Doctor.objects.get(user__username='dr_farida')

if not Appointment.objects.filter(patient=patient).exists():
    a1 = Appointment.objects.create(
        patient=patient, doctor=doc1, date=datetime.date(2026, 4, 20),
        time_slot='10:00 AM', type='Online', status='Confirmed',
        complaint='Chest pain, shortness of breath', fee=Decimal('850')
    )
    a2 = Appointment.objects.create(
        patient=patient, doctor=doc2, date=datetime.date(2026, 4, 18),
        time_slot='3:00 PM', type='Offline', status='Completed',
        complaint='Headache and dizziness', fee=Decimal('1050')
    )
    a3 = Appointment.objects.create(
        patient=patient, doctor=doc3, date=datetime.date(2026, 4, 25),
        time_slot='9:00 AM', type='Online', status='Pending',
        complaint='Routine check-up', fee=Decimal('750')
    )
    print("  ✅ Appointments created")

    # ── Prescription ──────────────────────────────────────────────────────────
    rx = Prescription.objects.create(
        appointment=a2, patient=patient, doctor=doc2,
        diagnosis='Migraine', note='Rest in dark room during attacks. Stay hydrated.',
        follow_up=datetime.date(2026, 5, 10)
    )
    Medicine.objects.create(prescription=rx, name='Sumatriptan 50mg', dose='1 tablet when needed', duration='15 days', instruction='Take at onset of migraine')
    Medicine.objects.create(prescription=rx, name='Propranolol 20mg', dose='1 tablet twice daily', duration='30 days', instruction='Do not stop abruptly')
    print("  ✅ Prescription created")

    # ── Medical Tests ──────────────────────────────────────────────────────────
    MedicalTest.objects.create(
        patient=patient, doctor=doc1, test_name='Complete Blood Count (CBC)',
        category='Blood Tests', status='Completed',
        result_data={'Hemoglobin':'13.5 g/dL','WBC':'7,500/μL','Platelets':'250,000/μL','RBC':'4.8 M/μL'}
    )
    MedicalTest.objects.create(
        patient=patient, doctor=doc2, test_name='Chest X-Ray',
        category='Imaging', status='In Progress', is_urgent=True
    )
    MedicalTest.objects.create(
        patient=patient, doctor=doc2, test_name='MRI Brain',
        category='Imaging', status='Pending'
    )
    print("  ✅ Medical tests created")

    # ── Payments ───────────────────────────────────────────────────────────────
    Payment.objects.create(
        patient=patient, appointment=a2, amount=Decimal('1050'),
        method='Card', status='Paid', transaction_id='TXN-CARD-001',
        description='Consultation – Dr. Tanvir Ahmed'
    )
    Payment.objects.create(
        patient=patient, appointment=a3, amount=Decimal('750'),
        method='Nagad', status='Pending',
        description='Consultation – Dr. Farida Begum'
    )
    print("  ✅ Payments created")

    # ── Notifications ──────────────────────────────────────────────────────────
    pu_user = User.objects.get(username='farhan')
    Notification.objects.create(user=pu_user, message='Appointment confirmed with Dr. Ayesha Rahman')
    Notification.objects.create(user=pu_user, message='Test report for CBC is ready to download')
    Notification.objects.create(user=pu_user, message='Prescription updated by Dr. Tanvir Ahmed', is_read=True)
    print("  ✅ Notifications created")

print("\n🎉 Database seeded successfully!")
print("\n📋 Login Credentials:")
print("   Admin    → admin / admin123           → http://localhost:8000/admin/")
print("   Patient  → farhan / patient123")
print("   Doctor   → dr_ayesha / doctor123")
print("   Nurse    → nurse_sadia / nurse123")
print("\n🚀 Run the server: python manage.py runserver")

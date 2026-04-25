from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Sum
import datetime

from .models import Patient, Doctor, TimeSlot, Appointment, Prescription, MedicalTest, Payment, Notification
from .serializers import (
    UserSerializer, RegisterSerializer,
    PatientSerializer, DoctorSerializer,
    AppointmentSerializer, AppointmentCreateSerializer,
    PrescriptionSerializer, PrescriptionCreateSerializer,
    MedicalTestSerializer, MedicalTestCreateSerializer,
    PaymentSerializer, PaymentCreateSerializer,
    NotificationSerializer,
)
User = get_user_model()

# ── Auth ──────────────────────────────────────────────────────────────────────
class RegisterView(generics.CreateAPIView):
    serializer_class   = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    def create(self, request, *args, **kwargs):
        s = self.get_serializer(data=request.data)
        s.is_valid(raise_exception=True)
        user = s.save()
        r = RefreshToken.for_user(user)
        return Response({'user': UserSerializer(user).data, 'access': str(r.access_token), 'refresh': str(r)}, status=201)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        identifier = request.data.get('username') or request.data.get('email', '')
        password   = request.data.get('password', '')
        user = authenticate(request, username=identifier, password=password)
        if not user:
            try:
                u = User.objects.get(email=identifier)
                user = authenticate(request, username=u.username, password=password)
            except User.DoesNotExist:
                pass
        if not user:
            return Response({'detail': 'Invalid credentials.'}, status=401)
        r = RefreshToken.for_user(user)
        return Response({'user': UserSerializer(user).data, 'access': str(r.access_token), 'refresh': str(r)})

class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    def get_object(self): return self.request.user

# ── Doctors ───────────────────────────────────────────────────────────────────
class DoctorListView(generics.ListAPIView):
    serializer_class   = DoctorSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends    = [filters.SearchFilter]
    search_fields      = ['specialty','user__first_name','user__last_name','hospital']
    def get_queryset(self):
        qs = Doctor.objects.select_related('user').prefetch_related('slots')
        sp = self.request.query_params.get('specialty')
        av = self.request.query_params.get('available')
        if sp: qs = qs.filter(specialty__icontains=sp)
        if av == 'true': qs = qs.filter(is_available=True)
        return qs

class DoctorDetailView(generics.RetrieveAPIView):
    serializer_class   = DoctorSerializer
    permission_classes = [permissions.AllowAny]
    queryset           = Doctor.objects.select_related('user').prefetch_related('slots')

# ── Add Doctor (Admin only) ───────────────────────────────────────────────────
@api_view(['POST'])
def add_doctor(request):
    data = request.data
    # Validate required fields
    required = ['username', 'first_name', 'last_name', 'email', 'password', 'specialty', 'hospital', 'consultation_fee']
    for field in required:
        if not data.get(field):
            return Response({'detail': f'{field} is required.'}, status=400)

    if User.objects.filter(username=data['username']).exists():
        return Response({'detail': 'Username already exists.'}, status=400)
    if User.objects.filter(email=data['email']).exists():
        return Response({'detail': 'Email already exists.'}, status=400)

    # Create user
    user = User.objects.create_user(
        username   = data['username'],
        email      = data['email'],
        password   = data['password'],
        first_name = data['first_name'],
        last_name  = data.get('last_name', ''),
        role       = 'doctor',
        phone      = data.get('phone', ''),
    )

    # Create doctor profile
    doctor = Doctor.objects.create(
        user             = user,
        specialty        = data['specialty'],
        hospital         = data['hospital'],
        experience       = data.get('experience', ''),
        consultation_fee = data['consultation_fee'],
        rating           = data.get('rating', 4.5),
        is_available     = True,
        bio              = data.get('bio', ''),
    )

    # Add time slots if provided
    slots = data.get('slots', [])
    for slot in slots:
        if slot.strip():
            TimeSlot.objects.create(doctor=doctor, slot_time=slot.strip())

    return Response(DoctorSerializer(doctor).data, status=201)

# ── Delete Doctor (Admin only) ────────────────────────────────────────────────
@api_view(['DELETE'])
def delete_doctor(request, pk):
    try:
        doctor = Doctor.objects.get(pk=pk)
        doctor.user.delete()
        return Response({'detail': 'Doctor deleted successfully.'}, status=200)
    except Doctor.DoesNotExist:
        return Response({'detail': 'Doctor not found.'}, status=404)

# ── Toggle Doctor Availability ────────────────────────────────────────────────
@api_view(['PATCH'])
def toggle_doctor(request, pk):
    try:
        doctor = Doctor.objects.get(pk=pk)
        doctor.is_available = not doctor.is_available
        doctor.save()
        return Response(DoctorSerializer(doctor).data)
    except Doctor.DoesNotExist:
        return Response({'detail': 'Doctor not found.'}, status=404)

# ── Patients ──────────────────────────────────────────────────────────────────
class PatientListView(generics.ListAPIView):
    serializer_class = PatientSerializer
    queryset         = Patient.objects.select_related('user')

class PatientDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = PatientSerializer
    queryset         = Patient.objects.select_related('user')

# ── Appointments ──────────────────────────────────────────────────────────────
class AppointmentListCreateView(generics.ListCreateAPIView):
    def get_serializer_class(self):
        return AppointmentCreateSerializer if self.request.method == 'POST' else AppointmentSerializer
    def get_queryset(self):
        u = self.request.user
        qs = Appointment.objects.select_related('doctor__user','patient__user')
        if u.role == 'patient': return qs.filter(patient__user=u)
        if u.role == 'doctor':  return qs.filter(doctor__user=u)
        return qs

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    queryset         = Appointment.objects.select_related('doctor__user','patient__user')

# ── Prescriptions ─────────────────────────────────────────────────────────────
class PrescriptionListCreateView(generics.ListCreateAPIView):
    def get_serializer_class(self):
        return PrescriptionCreateSerializer if self.request.method == 'POST' else PrescriptionSerializer
    def get_queryset(self):
        u = self.request.user
        qs = Prescription.objects.prefetch_related('medicines')
        if u.role == 'patient': return qs.filter(patient__user=u)
        if u.role == 'doctor':  return qs.filter(doctor__user=u)
        return qs

class PrescriptionDetailView(generics.RetrieveAPIView):
    serializer_class = PrescriptionSerializer
    queryset         = Prescription.objects.prefetch_related('medicines')

# ── Medical Tests ─────────────────────────────────────────────────────────────
class MedicalTestListCreateView(generics.ListCreateAPIView):
    def get_serializer_class(self):
        return MedicalTestCreateSerializer if self.request.method == 'POST' else MedicalTestSerializer
    def get_queryset(self):
        u = self.request.user
        if u.role == 'patient': return MedicalTest.objects.filter(patient__user=u)
        if u.role == 'doctor':  return MedicalTest.objects.filter(doctor__user=u)
        return MedicalTest.objects.all()

class MedicalTestDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = MedicalTestSerializer
    queryset         = MedicalTest.objects.all()

@api_view(['POST'])
def upload_report(request, pk):
    try: test = MedicalTest.objects.get(pk=pk)
    except MedicalTest.DoesNotExist: return Response({'detail':'Not found.'}, status=404)
    if 'report_file' not in request.FILES: return Response({'detail':'No file.'}, status=400)
    test.report_file = request.FILES['report_file']
    test.status = 'Completed'; test.save()
    return Response(MedicalTestSerializer(test).data)

# ── Payments ──────────────────────────────────────────────────────────────────
class PaymentListCreateView(generics.ListCreateAPIView):
    def get_serializer_class(self):
        return PaymentCreateSerializer if self.request.method == 'POST' else PaymentSerializer
    def get_queryset(self):
        u = self.request.user
        return Payment.objects.filter(patient__user=u) if u.role == 'patient' else Payment.objects.all()

# ── Notifications ─────────────────────────────────────────────────────────────
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    def get_queryset(self): return Notification.objects.filter(user=self.request.user)

@api_view(['POST'])
def mark_notifications_read(request):
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({'status':'ok'})

# ── Admin Stats ───────────────────────────────────────────────────────────────
@api_view(['GET'])
def admin_stats(request):
    return Response({
        'total_patients':       Patient.objects.count(),
        'total_doctors':        Doctor.objects.count(),
        'appointments_today':   Appointment.objects.filter(date=datetime.date.today()).count(),
        'total_appointments':   Appointment.objects.count(),
        'pending_tests':        MedicalTest.objects.filter(status='Pending').count(),
        'online_consultations': Appointment.objects.filter(type='Online', status='Confirmed').count(),
        'total_revenue':        float(Payment.objects.filter(status='Paid').aggregate(t=Sum('amount'))['t'] or 0),
    })

# ── AI Symptom Checker ────────────────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def symptom_check(request):
    raw      = request.query_params.get('symptoms', '')
    selected = set(s.strip() for s in raw.split(',') if s.strip())
    rules = [
        ({'Fever','Cough','Sore Throat'},           {'disease':'Upper Respiratory Infection','severity':'Mild','specialist':'General Medicine','advice':'Rest, stay hydrated, take paracetamol for fever.'}),
        ({'Chest Pain','Shortness of Breath'},       {'disease':'Possible Cardiac Issue','severity':'High','specialist':'Cardiology','advice':'Seek immediate medical attention. Avoid physical exertion.'}),
        ({'Headache','Dizziness','Blurred Vision'},  {'disease':'Possible Hypertension / Migraine','severity':'Moderate','specialist':'Neurology','advice':'Monitor BP regularly. Rest in a quiet, dark room.'}),
        ({'Nausea','Vomiting','Abdominal Pain'},     {'disease':'Gastroenteritis','severity':'Mild','specialist':'General Medicine','advice':'ORS fluids, bland diet, avoid dairy.'}),
        ({'Joint Pain','Swelling','Fatigue'},        {'disease':'Possible Rheumatoid Arthritis','severity':'Moderate','specialist':'Orthopedics','advice':'Anti-inflammatory medication. Consult orthopedic specialist.'}),
        ({'Skin Rash'},                              {'disease':'Allergic Reaction / Dermatitis','severity':'Mild','specialist':'Dermatology','advice':'Antihistamines, avoid triggers. Topical creams.'}),
    ]
    best, best_score = None, 0
    for rule_set, result in rules:
        score = len(rule_set & selected)
        if score > best_score: best_score, best = score, result
    if not best:
        best = {'disease':'General Health Concern','severity':'Mild','specialist':'General Medicine','advice':'Monitor symptoms and consult a doctor.'}
    doctors = Doctor.objects.filter(specialty=best['specialist'], is_available=True)[:3]
    best['recommended_doctors'] = DoctorSerializer(doctors, many=True).data
    return Response(best)

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Patient, Doctor, TimeSlot, Appointment, Prescription, Medicine, MedicalTest, Payment, Notification

User = get_user_model()


# ── User / Auth ───────────────────────────────────────────────────────────────
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'profile_pic']
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)
    dob       = serializers.DateField(required=False, allow_null=True)
    gender    = serializers.CharField(required=False, allow_blank=True)
    blood_group = serializers.CharField(required=False, allow_blank=True)
    division  = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model  = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password2',
                  'phone', 'dob', 'gender', 'blood_group', 'division']

    def validate(self, data):
        if data['password'] != data.pop('password2'):
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        extra = {k: validated_data.pop(k, None) for k in ['dob', 'gender', 'blood_group', 'division']}
        user = User.objects.create_user(**validated_data, role='patient')
        Patient.objects.create(
            user        = user,
            dob         = extra.get('dob'),
            gender      = extra.get('gender') or '',
            blood_group = extra.get('blood_group') or '',
            division    = extra.get('division') or '',
        )
        return user


# ── Patient ───────────────────────────────────────────────────────────────────
class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model  = Patient
        fields = '__all__'


# ── Doctor ────────────────────────────────────────────────────────────────────
class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model  = TimeSlot
        fields = ['id', 'slot_time', 'is_booked']


class DoctorSerializer(serializers.ModelSerializer):
    user      = UserSerializer(read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    slots     = TimeSlotSerializer(many=True, read_only=True)
    phone     = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model  = Doctor
        fields = ['id', 'full_name', 'user', 'phone', 'specialty', 'hospital',
                  'experience', 'consultation_fee', 'rating', 'is_available', 'bio', 'slots']


# ── Appointment ───────────────────────────────────────────────────────────────
class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name  = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)
    specialty    = serializers.CharField(source='doctor.specialty', read_only=True)

    class Meta:
        model  = Appointment
        fields = ['id', 'patient', 'doctor', 'patient_name', 'doctor_name', 'specialty',
                  'date', 'time_slot', 'type', 'status', 'complaint', 'fee', 'created_at']
        read_only_fields = ['id', 'created_at']


class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Appointment
        fields = ['doctor', 'date', 'time_slot', 'type', 'complaint', 'fee']

    def create(self, validated_data):
        request = self.context['request']
        patient = request.user.patient_profile
        return Appointment.objects.create(patient=patient, status='Pending', **validated_data)


# ── Prescription ──────────────────────────────────────────────────────────────
class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Medicine
        fields = ['id', 'name', 'dose', 'duration', 'instruction']


class PrescriptionSerializer(serializers.ModelSerializer):
    medicines    = MedicineSerializer(many=True, read_only=True)
    doctor_name  = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)

    class Meta:
        model  = Prescription
        fields = ['id', 'appointment', 'patient', 'doctor', 'patient_name', 'doctor_name',
                  'diagnosis', 'note', 'follow_up', 'is_uploaded', 'upload_file', 'medicines', 'created_at']
        read_only_fields = ['id', 'created_at']


class PrescriptionCreateSerializer(serializers.ModelSerializer):
    medicines = MedicineSerializer(many=True)

    class Meta:
        model  = Prescription
        fields = ['appointment', 'patient', 'diagnosis', 'note', 'follow_up', 'medicines']

    def create(self, validated_data):
        meds_data = validated_data.pop('medicines', [])
        request   = self.context['request']
        doctor    = request.user.doctor_profile
        rx = Prescription.objects.create(doctor=doctor, **validated_data)
        for m in meds_data:
            Medicine.objects.create(prescription=rx, **m)
        return rx


# ── Medical Test ──────────────────────────────────────────────────────────────
class MedicalTestSerializer(serializers.ModelSerializer):
    doctor_name  = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)

    class Meta:
        model  = MedicalTest
        fields = ['id', 'patient', 'doctor', 'patient_name', 'doctor_name', 'test_name',
                  'category', 'notes', 'is_urgent', 'status', 'report_file',
                  'result_data', 'request_date', 'updated_at']
        read_only_fields = ['id', 'request_date', 'updated_at']


class MedicalTestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MedicalTest
        fields = ['patient', 'test_name', 'category', 'notes', 'is_urgent']

    def create(self, validated_data):
        doctor = self.context['request'].user.doctor_profile
        return MedicalTest.objects.create(doctor=doctor, **validated_data)


# ── Payment ───────────────────────────────────────────────────────────────────
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Payment
        fields = ['id', 'appointment', 'patient', 'amount', 'method',
                  'status', 'transaction_id', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class PaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Payment
        fields = ['appointment', 'amount', 'method', 'description']

    def create(self, validated_data):
        patient = self.context['request'].user.patient_profile
        import uuid
        return Payment.objects.create(
            patient        = patient,
            status         = 'Paid',
            transaction_id = str(uuid.uuid4())[:16].upper(),
            **validated_data
        )


# ── Notification ──────────────────────────────────────────────────────────────
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Notification
        fields = ['id', 'message', 'is_read', 'created_at']

from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('auth/register/', views.RegisterView.as_view()),
    path('auth/login/',    views.LoginView.as_view()),
    path('auth/me/',       views.MeView.as_view()),

    # Doctors
    path('doctors/',              views.DoctorListView.as_view()),
    path('doctors/<int:pk>/',     views.DoctorDetailView.as_view()),
    path('doctors/add/',          views.add_doctor),
    path('doctors/<int:pk>/delete/', views.delete_doctor),
    path('doctors/<int:pk>/toggle/', views.toggle_doctor),

    # Patients
    path('patients/',          views.PatientListView.as_view()),
    path('patients/<int:pk>/', views.PatientDetailView.as_view()),

    # Appointments
    path('appointments/',          views.AppointmentListCreateView.as_view()),
    path('appointments/<int:pk>/', views.AppointmentDetailView.as_view()),

    # Prescriptions
    path('prescriptions/',          views.PrescriptionListCreateView.as_view()),
    path('prescriptions/<int:pk>/', views.PrescriptionDetailView.as_view()),

    # Tests
    path('tests/',                      views.MedicalTestListCreateView.as_view()),
    path('tests/<int:pk>/',             views.MedicalTestDetailView.as_view()),
    path('tests/<int:pk>/upload/',      views.upload_report),

    # Payments
    path('payments/', views.PaymentListCreateView.as_view()),

    # Notifications
    path('notifications/',          views.NotificationListView.as_view()),
    path('notifications/read-all/', views.mark_notifications_read),

    # Admin
    path('admin/stats/', views.admin_stats),

    # Symptoms
    path('symptoms/check/', views.symptom_check),
]

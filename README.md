# 🩺 ShasthoSheba — Smart Telemedicine & Healthcare System
### IUB Final Project · Md Farhan Hossain Sami (ID: 2310717) · Section 05

---

## 📁 Project Structure

```
mediconnect-fullstack/
├── frontend/          ← React + Vite + Tailwind CSS
└── backend/           ← Django + Django REST Framework + SQLite
```

---

## 🚀 How to Run (VS Code)

### Step 1 — Start Django Backend

Open a terminal in VS Code and run:

```bash
cd backend

# Install Python packages
pip install -r requirements.txt

# Run database migrations (only first time)
python manage.py migrate

# Seed demo data (only first time)
python seed_data.py

# Start the Django server
python manage.py runserver
```

✅ Django API is now running at: **http://localhost:8000**
✅ Django Admin panel: **http://localhost:8000/admin/**

---

### Step 2 — Start React Frontend

Open a **second terminal** in VS Code and run:

```bash
cd frontend

# Install Node packages
npm install

# Start the React dev server
npm run dev
```

✅ React app is now running at: **http://localhost:5173**

---

## 🔐 Demo Login Credentials

| Role    | Username      | Password     |
|---------|---------------|--------------|
| Patient | `farhan`      | `patient123` |
| Doctor  | `dr_ayesha`   | `doctor123`  |
| Admin   | `admin`       | `admin123`   |
| Nurse   | `nurse_sadia` | `nurse123`   |

> Click any role card on the login screen to auto-fill credentials!

---

## 🌐 API Endpoints

| Method | Endpoint                       | Description                    |
|--------|-------------------------------|--------------------------------|
| POST   | `/api/auth/register/`         | Patient registration           |
| POST   | `/api/auth/login/`            | Login → returns JWT tokens     |
| GET    | `/api/auth/me/`               | Current user profile           |
| GET    | `/api/doctors/`               | List all doctors               |
| GET    | `/api/doctors/?specialty=X`   | Filter by specialty            |
| GET    | `/api/appointments/`          | My appointments                |
| POST   | `/api/appointments/`          | Book new appointment           |
| PATCH  | `/api/appointments/<id>/`     | Update / cancel appointment    |
| GET    | `/api/prescriptions/`         | My prescriptions               |
| POST   | `/api/prescriptions/`         | Create prescription (Doctor)   |
| GET    | `/api/tests/`                 | My test reports                |
| POST   | `/api/tests/`                 | Request test (Doctor)          |
| POST   | `/api/tests/<id>/upload/`     | Upload report file (Nurse)     |
| GET    | `/api/payments/`              | My payments                    |
| POST   | `/api/payments/`              | Make payment                   |
| GET    | `/api/symptoms/check/?symptoms=Fever,Cough` | AI symptom check |
| GET    | `/api/admin/stats/`           | Dashboard statistics           |
| GET    | `/api/notifications/`         | My notifications               |

---

## 🛠 Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS v3     |
| Routing  | React Router v6                     |
| Backend  | Django 4.x, Django REST Framework   |
| Auth     | JWT (djangorestframework-simplejwt) |
| Database | SQLite (pre-seeded, ready to use)   |
| CORS     | django-cors-headers                 |
| Uploads  | Django media files (Pillow)         |

---

## 🗄 Switch to MySQL (Optional)

In `backend/mediconnect/settings.py`, replace the DATABASES block:

```python
# Install: pip install mysqlclient
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mediconnect_db',
        'USER': 'root',
        'PASSWORD': 'your_mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

Then run:
```bash
python manage.py migrate
python seed_data.py
```

---

## ✅ Features Implemented

- ✅ Patient Registration & JWT Login
- ✅ Role-based Access (Patient / Doctor / Admin / Nurse)
- ✅ Doctor Listing with Search & Specialty Filter
- ✅ Appointment Booking (Online & Offline)
- ✅ Appointment Management (Cancel, Status Update)
- ✅ AI Symptom Checker → Disease Prediction → Doctor Recommendation
- ✅ Video Consultation UI with Live Chat
- ✅ Digital Prescription (Medicines, Dose, Duration)
- ✅ Handwritten Prescription Upload
- ✅ Medical Test Request (CBC, MRI, X-Ray, etc.)
- ✅ Test Report Upload by Nurse (PDF/Image)
- ✅ Lab Results Viewer for Patient & Doctor
- ✅ SSLCommerz Payment UI (bKash, Nagad, Rocket, Card)
- ✅ Admin Dashboard with Live Stats from Django
- ✅ Nurse Patient Monitoring & Test Upload Panel
- ✅ Django Admin Panel for full data management
- ✅ Notifications System
- ✅ Fully Responsive (Mobile + Desktop)
- ✅ Collapsible Sidebar Navigation

---

*MediConnect — Smart Telemedicine for Bangladesh*
*Independent University, Bangladesh (IUB)*

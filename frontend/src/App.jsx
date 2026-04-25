import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import Home            from './pages/Home'
import Login           from './pages/Login'
import Register        from './pages/Register'

// Patient
import PatientDashboard    from './pages/patient/PatientDashboard'
import BookAppointment     from './pages/patient/BookAppointment'
import PatientAppointments from './pages/patient/PatientAppointments'
import SymptomChecker      from './pages/patient/SymptomChecker'
import Prescriptions       from './pages/patient/Prescriptions'
import TestReports         from './pages/patient/TestReports'
import VideoCall           from './pages/patient/VideoCall'
import Payments            from './pages/patient/Payments'

// Doctor
import DoctorDashboard    from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import WritePrescription  from './pages/doctor/WritePrescription'
import RequestTest        from './pages/doctor/RequestTest'
import PatientRecords     from './pages/doctor/PatientRecords'
import DoctorVideo        from './pages/doctor/DoctorVideo'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminPatients  from './pages/admin/AdminPatients'

// Nurse
import NurseDashboard from './pages/nurse/NurseDashboard'

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"         element={<Home />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient routes */}
      <Route path="/patient"              element={<ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>} />
      <Route path="/patient/book"         element={<ProtectedRoute role="patient"><BookAppointment /></ProtectedRoute>} />
      <Route path="/patient/appointments" element={<ProtectedRoute role="patient"><PatientAppointments /></ProtectedRoute>} />
      <Route path="/patient/symptoms"     element={<ProtectedRoute role="patient"><SymptomChecker /></ProtectedRoute>} />
      <Route path="/patient/prescriptions"element={<ProtectedRoute role="patient"><Prescriptions /></ProtectedRoute>} />
      <Route path="/patient/tests"        element={<ProtectedRoute role="patient"><TestReports /></ProtectedRoute>} />
      <Route path="/patient/video"        element={<ProtectedRoute role="patient"><VideoCall /></ProtectedRoute>} />
      <Route path="/patient/payments"     element={<ProtectedRoute role="patient"><Payments /></ProtectedRoute>} />

      {/* Doctor routes */}
      <Route path="/doctor"                element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/appointments"   element={<ProtectedRoute role="doctor"><DoctorAppointments /></ProtectedRoute>} />
      <Route path="/doctor/prescriptions"  element={<ProtectedRoute role="doctor"><WritePrescription /></ProtectedRoute>} />
      <Route path="/doctor/request-test"   element={<ProtectedRoute role="doctor"><RequestTest /></ProtectedRoute>} />
      <Route path="/doctor/patients"       element={<ProtectedRoute role="doctor"><PatientRecords /></ProtectedRoute>} />
      <Route path="/doctor/video"          element={<ProtectedRoute role="doctor"><DoctorVideo /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/patients" element={<ProtectedRoute role="admin"><AdminPatients /></ProtectedRoute>} />

      {/* Nurse routes */}
      <Route path="/nurse" element={<ProtectedRoute role="nurse"><NurseDashboard /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

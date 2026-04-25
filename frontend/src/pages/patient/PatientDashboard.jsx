import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { appointmentsAPI, prescriptionsAPI, testsAPI } from '../../services/api'

const StatCard = ({ icon, label, value, color, sub }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-extrabold text-gray-900 leading-none">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
      {sub && <p className="text-xs font-semibold text-teal-600 mt-0.5">{sub}</p>}
    </div>
  </div>
)

export default function PatientDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([appointmentsAPI.list(), prescriptionsAPI.list(), testsAPI.list()])
      .then(([a, p, t]) => {
        setAppointments(a?.results ?? a ?? [])
        setPrescriptions(p?.results ?? p ?? [])
        setTests(t?.results ?? t ?? [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const upcoming = appointments.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled')
  const nextAppt = upcoming[0]
  const totalSpent = appointments.filter(a => a.status === 'Completed').reduce((s, a) => s + Number(a.fee || 0), 0)

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Patient Dashboard" />
        <div className="p-6 animate-fade-in">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-teal-700 to-teal-500 rounded-2xl p-6 mb-6 flex justify-between items-center flex-wrap gap-4">
            <div>
              <p className="text-white/75 text-sm">Good morning 👋</p>
              <h2 className="text-white font-extrabold text-2xl mt-1">{user?.first_name} {user?.last_name}</h2>
              <p className="text-white/70 text-sm mt-1">Patient ID: <strong>{user?.id}</strong></p>
            </div>
            {nextAppt && (
              <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl p-4 min-w-[200px]">
                <p className="text-white/70 text-xs mb-1 uppercase tracking-wide">Next Appointment</p>
                <p className="text-white font-bold text-sm">{nextAppt.doctor_name}</p>
                <p className="text-white/80 text-xs">{nextAppt.date} · {nextAppt.time_slot}</p>
                <span className="inline-block mt-2 bg-teal-400 text-teal-900 text-xs font-bold px-2.5 py-0.5 rounded-full">{nextAppt.type}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon="📅" label="Total Appointments" value={loading ? '…' : appointments.length} color="bg-blue-50" sub={`${upcoming.length} upcoming`} />
            <StatCard icon="💊" label="Prescriptions" value={prescriptions.length} color="bg-green-50" sub="Active" />
            <StatCard icon="🧪" label="Test Reports" value={tests.length} color="bg-amber-50" sub="All results" />
            <StatCard icon="💰" label="Total Spent" value={`৳${totalSpent.toLocaleString()}`} color="bg-teal-50" sub="Completed visits" />
          </div>

          {/* Quick Actions */}
          <div className="card p-5 mb-6">
            <h3 className="font-bold text-sm mb-4">Quick Actions</h3>
            <div className="flex gap-2.5 flex-wrap">
              {[
                { label: '📅 Book Appointment', path: '/patient/book',          cls: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100' },
                { label: '🔍 Check Symptoms',   path: '/patient/symptoms',      cls: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
                { label: '📹 Video Call',        path: '/patient/video',         cls: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' },
                { label: '💊 Prescriptions',    path: '/patient/prescriptions', cls: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
              ].map(a => (
                <button key={a.path} onClick={() => navigate(a.path)} className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${a.cls}`}>{a.label}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Appointments */}
            <div className="card p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm">Appointments</h3>
                <button onClick={() => navigate('/patient/appointments')} className="text-teal-600 text-xs font-semibold hover:underline">View All</button>
              </div>
              {loading ? <div className="text-center py-6 text-gray-400 text-sm">Loading…</div>
              : appointments.length ? (
                <div className="flex flex-col gap-2.5">
                  {appointments.slice(0, 3).map(a => (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                      <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center text-lg shrink-0">👨‍⚕️</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{a.doctor_name}</p>
                        <p className="text-xs text-gray-400">{a.date} · {a.time_slot}</p>
                      </div>
                      <span className={`badge ${a.status === 'Confirmed' ? 'badge-success' : a.status === 'Pending' ? 'badge-warning' : 'badge-info'}`}>{a.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-3xl mb-2">📅</p><p className="text-sm">No appointments yet</p>
                  <button onClick={() => navigate('/patient/book')} className="btn-primary mt-3 py-2 px-4 text-xs">Book Now</button>
                </div>
              )}
            </div>

            {/* Test Reports */}
            <div className="card p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm">Test Reports</h3>
                <button onClick={() => navigate('/patient/tests')} className="text-teal-600 text-xs font-semibold hover:underline">View All</button>
              </div>
              {tests.length ? (
                <div className="flex flex-col gap-2.5">
                  {tests.map(t => (
                    <div key={t.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-sm">{t.test_name}</p>
                        <span className={`badge ${t.status === 'Completed' ? 'badge-success' : t.status === 'In Progress' ? 'badge-info' : 'badge-warning'}`}>{t.status}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">By {t.doctor_name} · {t.request_date}</p>
                      {t.status === 'Completed' && t.report_file && (
                        <a href={`http://localhost:8000${t.report_file}`} target="_blank" rel="noreferrer"
                          className="mt-1.5 inline-block text-xs text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full font-semibold hover:bg-teal-100 transition-colors">📥 Download</a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm"><p className="text-3xl mb-2">🧪</p><p>No test reports yet</p></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'

const queue = [
  { id:'A1', patient:'Farhan Hossain', age:25, time:'10:00 AM', type:'Online',  status:'Confirmed', complaint:'Chest pain' },
  { id:'A2', patient:'Rina Begum',     age:42, time:'11:30 AM', type:'Offline', status:'Waiting',   complaint:'Hypertension follow-up' },
  { id:'A3', patient:'Kamal Hossain',  age:55, time:'2:00 PM',  type:'Online',  status:'Confirmed', complaint:'Irregular heartbeat' },
  { id:'A4', patient:'Sumaiya Islam',  age:30, time:'3:30 PM',  type:'Offline', status:'Pending',   complaint:'Routine check-up' },
]

export default function DoctorDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const stats = [
    { icon:'👥', label:"Today's Patients", value:queue.length, bg:'bg-blue-50',   sub:'2 online'    },
    { icon:'✅', label:'Completed',        value:128,          bg:'bg-green-50',  sub:'This month'  },
    { icon:'📋', label:'Prescriptions',    value:86,           bg:'bg-teal-50',   sub:'This month'  },
    { icon:'⭐', label:'Rating',           value:'4.9',        bg:'bg-amber-50',  sub:'42 reviews'  },
  ]

  const sc = { Confirmed:'badge-success', Waiting:'badge-danger', Pending:'badge-warning' }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Doctor Dashboard" />
        <div className="p-6 animate-fade-in">

          {/* Banner */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-6 mb-6 flex justify-between items-center flex-wrap gap-4">
            <div>
              <p className="text-white/75 text-sm">Welcome back 👋</p>
              <h2 className="text-white font-extrabold text-2xl mt-1">{user?.name}</h2>
              <p className="text-white/70 text-sm mt-1">{user?.specialty || 'Cardiology'} · Dhaka Medical Center</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/doctor/appointments')} className="bg-white/15 text-white text-sm font-semibold px-4 py-2 rounded-xl border border-white/30 hover:bg-white/25 transition-colors">📅 Schedule</button>
              <button onClick={() => navigate('/doctor/video')} className="bg-white text-blue-700 text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors">📹 Start Call</button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className="card p-4 flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center text-2xl shrink-0`}>{s.icon}</div>
                <div>
                  <p className="text-2xl font-extrabold leading-none">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                  <p className="text-xs font-semibold text-teal-600 mt-0.5">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="card p-5 mb-6">
            <h3 className="font-bold text-sm mb-3">Quick Actions</h3>
            <div className="flex gap-2.5 flex-wrap">
              {[
                { label:'💊 Write Prescription', path:'/doctor/prescriptions', cls:'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' },
                { label:'🧪 Request Test',        path:'/doctor/request-test',  cls:'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
                { label:'👥 Patient Records',     path:'/doctor/patients',      cls:'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'   },
                { label:'📹 Video Consult',       path:'/doctor/video',         cls:'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'   },
              ].map(a => (
                <button key={a.path} onClick={() => navigate(a.path)}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${a.cls}`}>{a.label}</button>
              ))}
            </div>
          </div>

          {/* Today's Queue */}
          <div className="card p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm">Today's Appointments</h3>
              <button onClick={() => navigate('/doctor/appointments')} className="text-teal-600 text-xs font-semibold hover:underline">View All</button>
            </div>
            <div className="flex flex-col gap-3">
              {queue.map(a => (
                <div key={a.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl bg-gray-50 flex-wrap gap-3">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-bold text-blue-700 text-base shrink-0">{a.patient.charAt(0)}</div>
                    <div>
                      <p className="font-bold text-sm">{a.patient}</p>
                      <p className="text-xs text-gray-400">Age {a.age} · {a.time} · {a.type}</p>
                      <p className="text-xs text-gray-400">📋 {a.complaint}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className={`badge ${sc[a.status]}`}>{a.status}</span>
                    {a.type === 'Online'
                      ? <button className="btn-primary py-1.5 px-3 text-xs">📹 Start</button>
                      : <button onClick={() => navigate('/doctor/prescriptions')} className="py-1.5 px-3 text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors">💊 Prescribe</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'

const allAppts = [
  { id:'A1', patient:'Farhan Hossain', age:25, time:'10:00 AM', date:'2026-04-20', type:'Online',  status:'Confirmed', complaint:'Chest pain' },
  { id:'A2', patient:'Rina Begum',     age:42, time:'11:30 AM', date:'2026-04-20', type:'Offline', status:'Waiting',   complaint:'Hypertension follow-up' },
  { id:'A3', patient:'Kamal Hossain',  age:55, time:'2:00 PM',  date:'2026-04-20', type:'Online',  status:'Confirmed', complaint:'Irregular heartbeat' },
  { id:'A4', patient:'Sumaiya Islam',  age:30, time:'3:30 PM',  date:'2026-04-21', type:'Offline', status:'Pending',   complaint:'Routine check-up' },
  { id:'A5', patient:'Hasan Ali',      age:60, time:'9:00 AM',  date:'2026-04-21', type:'Online',  status:'Completed', complaint:'Diabetes follow-up' },
]
const sc = { Confirmed:'badge-success', Waiting:'badge-danger', Pending:'badge-warning', Completed:'badge-info' }

export default function DoctorAppointments() {
  const [filter, setFilter]   = useState('All')
  const [dateFilter, setDate] = useState('')
  const filtered = allAppts.filter(a => (filter === 'All' || a.status === filter) && (!dateFilter || a.date === dateFilter))

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Manage Appointments" />
        <div className="p-6 animate-fade-in">
          <div className="flex gap-2 mb-5 flex-wrap items-center">
            {['All','Confirmed','Pending','Waiting','Completed'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${filter === f ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>{f}</button>
            ))}
            <input type="date" value={dateFilter} onChange={e => setDate(e.target.value)}
              className="ml-auto px-3 py-1.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-400" />
          </div>
          <div className="flex flex-col gap-3">
            {filtered.map(a => (
              <div key={a.id} className="card p-4 flex justify-between items-center flex-wrap gap-3">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center font-bold text-teal-700">{a.patient.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-sm">{a.patient}</p>
                    <p className="text-xs text-gray-400">Age {a.age} · {a.date} · {a.time} · {a.type}</p>
                    <p className="text-xs text-gray-400">📋 {a.complaint}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                  <span className={`badge ${sc[a.status]}`}>{a.status}</span>
                  {a.type === 'Online' && a.status !== 'Completed' && <button className="btn-primary py-1.5 px-3 text-xs">📹 Start</button>}
                  {a.status !== 'Completed' && <button className="py-1.5 px-3 text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors">💊 Prescribe</button>}
                  <button className="py-1.5 px-3 text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors">🧪 Tests</button>
                </div>
              </div>
            ))}
            {!filtered.length && <div className="card p-12 text-center text-gray-400"><p className="text-3xl mb-2">📅</p><p>No appointments found</p></div>}
          </div>
        </div>
      </div>
    </div>
  )
}

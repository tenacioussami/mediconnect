import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { appointmentsAPI } from '../../services/api'

export default function PatientAppointments() {
  const [appointments, setAppts] = useState([])
  const [loading, setLoading]    = useState(true)
  const [filter, setFilter]      = useState('All')
  const [showCancel, setShowCancel] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    appointmentsAPI.list()
      .then(d => setAppts(d?.results ?? d ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = appointments.filter(a => filter === 'All' || a.status === filter)
  const sc = { Confirmed: 'badge-success', Pending: 'badge-warning', Completed: 'badge-info', Cancelled: 'badge-danger' }

  const handleCancel = async (id) => {
    setCancelling(true)
    try {
      await appointmentsAPI.cancel(id)
      setAppts(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a))
    } catch (err) { alert(err.message) }
    finally { setCancelling(false); setShowCancel(null) }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="My Appointments" />
        <div className="p-6 animate-fade-in">
          <div className="flex gap-2 mb-5 flex-wrap">
            {['All','Confirmed','Pending','Completed','Cancelled'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${filter === f ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>{f}</button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400"><p className="text-3xl mb-3">⏳</p><p>Loading from Django API…</p></div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map(a => (
                <div key={a.id} className="card p-5">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-700 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shrink-0">
                        {a.doctor_name?.split(' ').slice(-1)[0]?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <p className="font-bold">{a.doctor_name}</p>
                        <p className="text-teal-600 text-xs font-semibold">{a.specialty}</p>
                        <div className="flex gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                          <span>📅 {a.date}</span>
                          <span>🕐 {a.time_slot}</span>
                          <span>{a.type === 'Online' ? '📹' : '🏥'} {a.type}</span>
                          <span>💰 ৳{a.fee}</span>
                        </div>
                        {a.complaint && <p className="text-xs text-gray-400 mt-1">📋 {a.complaint}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`badge ${sc[a.status] || 'badge-info'}`}>{a.status}</span>
                      {a.type === 'Online' && a.status === 'Confirmed' && (
                        <button className="btn-primary py-1.5 px-3 text-xs">📹 Join Call</button>
                      )}
                      {a.status !== 'Completed' && a.status !== 'Cancelled' && (
                        <button onClick={() => setShowCancel(a.id)}
                          className="py-1.5 px-3 text-xs font-semibold bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                  {showCancel === a.id && (
                    <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                      <p className="font-semibold text-red-600 text-sm mb-3">Are you sure you want to cancel this appointment?</p>
                      <div className="flex gap-2">
                        <button onClick={() => setShowCancel(null)} className="btn-outline py-2 px-4 text-xs border-gray-300 text-gray-600 hover:bg-gray-100">Keep</button>
                        <button onClick={() => handleCancel(a.id)} disabled={cancelling} className="btn-danger py-2 px-4 text-xs">
                          {cancelling ? 'Cancelling…' : 'Yes, Cancel'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {!filtered.length && (
                <div className="card p-12 text-center text-gray-400">
                  <p className="text-3xl mb-2">📅</p><p>No appointments found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

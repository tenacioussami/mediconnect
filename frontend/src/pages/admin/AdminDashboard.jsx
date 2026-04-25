import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { adminAPI, doctorsAPI, getToken } from '../../services/api'

const BASE_URL = 'http://localhost:8000/api'
const specialties = ['General Medicine','Cardiology','Neurology','Dermatology','Orthopedics','Pediatrics','Gynecology','Psychiatry','Ophthalmology','ENT','Urology','Oncology']
const defaultSlots = ['9:00 AM','10:00 AM','11:00 AM','2:00 PM','3:00 PM','4:00 PM']
const emptyForm = { username:'', first_name:'', last_name:'', email:'', phone:'', password:'', specialty:'General Medicine', hospital:'', experience:'', consultation_fee:'', bio:'', slots:[] }

export default function AdminDashboard() {
  const [stats, setStats]         = useState(null)
  const [doctors, setDoctors]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')

  useEffect(() => {
    Promise.all([adminAPI.stats(), doctorsAPI.list()])
      .then(([s, d]) => { setStats(s); setDoctors(d?.results ?? d ?? []) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleSlot = (slot) => setForm(f => ({ ...f, slots: f.slots.includes(slot) ? f.slots.filter(s => s !== slot) : [...f.slots, slot] }))

  const handleAddDoctor = async (e) => {
    e.preventDefault()
    setSaving(true); setError(''); setSuccess('')
    try {
      const res = await fetch(`${BASE_URL}/doctors/add/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to add doctor')
      setDoctors(prev => [...prev, data])
      setSuccess(`✅ Dr. ${form.first_name} ${form.last_name} added successfully!`)
      setForm(emptyForm)
      setTimeout(() => { setShowModal(false); setSuccess('') }, 2000)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return
    try {
      await fetch(`${BASE_URL}/doctors/${id}/delete/`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } })
      setDoctors(prev => prev.filter(d => d.id !== id))
    } catch { alert('Failed to delete doctor') }
  }

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/doctors/${id}/toggle/`, { method: 'PATCH', headers: { Authorization: `Bearer ${getToken()}` } })
      const data = await res.json()
      setDoctors(prev => prev.map(d => d.id === id ? data : d))
    } catch { alert('Failed to update') }
  }

  const statCards = stats ? [
    { icon:'👥', label:'Total Patients',  value: stats.total_patients,       bg:'bg-teal-50'   },
    { icon:'👨‍⚕️', label:'Doctors',       value: stats.total_doctors,         bg:'bg-blue-50'   },
    { icon:'📅', label:"Today's Appt.",  value: stats.appointments_today,   bg:'bg-green-50'  },
    { icon:'💰', label:'Revenue',        value:'৳'+(stats.total_revenue/1000).toFixed(0)+'K', bg:'bg-amber-50' },
    { icon:'🧪', label:'Pending Tests',  value: stats.pending_tests,        bg:'bg-red-50'    },
    { icon:'📹', label:'Live Calls',     value: stats.online_consultations, bg:'bg-purple-50' },
  ] : []

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Admin Dashboard" />
        <div className="p-6 animate-fade-in">

          {/* Banner */}
          <div className="bg-gradient-to-r from-purple-800 to-purple-600 rounded-2xl p-6 mb-6 flex justify-between items-center flex-wrap gap-4">
            <div>
              <p className="text-white/75 text-sm">System Administrator</p>
              <h2 className="text-white font-extrabold text-2xl mt-1">Control Panel</h2>
              <p className="text-white/65 text-sm mt-1">MediConnect · Django + React ✅</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setShowModal(true)} className="bg-white text-purple-700 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-purple-50 transition-colors">
                ➕ Add Doctor
              </button>
              <a href="http://localhost:8000/admin/" target="_blank" rel="noreferrer"
                className="bg-white/15 text-white text-sm font-semibold px-4 py-2.5 rounded-xl border border-white/30 hover:bg-white/25 transition-colors no-underline">
                ⚙️ Django Admin
              </a>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-400"><p className="text-3xl mb-3">⏳</p><p>Loading…</p></div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {statCards.map(s => (
                  <div key={s.label} className="card p-4">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-xl mb-2`}>{s.icon}</div>
                    <p className="text-2xl font-extrabold leading-none">{s.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Doctors Table */}
              <div className="card p-5">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold">All Doctors ({doctors.length})</h3>
                  <button onClick={() => setShowModal(true)} className="btn-primary py-2 px-4 text-sm">➕ Add New Doctor</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-100">
                        {['Doctor','Specialty','Hospital','Experience','Fee','Status','Actions'].map(h => (
                          <th key={h} className="py-3 px-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map(d => (
                        <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex gap-2 items-center">
                              <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 font-bold shrink-0">
                                {d.full_name?.charAt(0) || 'D'}
                              </div>
                              <div>
                                <p className="font-semibold">{d.full_name}</p>
                                <p className="text-xs text-gray-400">{d.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-teal-600 font-semibold text-xs">{d.specialty}</td>
                          <td className="py-3 px-3 text-gray-500 text-xs">{d.hospital}</td>
                          <td className="py-3 px-3 text-gray-500 text-xs">{d.experience || '—'}</td>
                          <td className="py-3 px-3 font-bold">৳{d.consultation_fee}</td>
                          <td className="py-3 px-3">
                            <button onClick={() => handleToggle(d.id)} className={`badge cursor-pointer ${d.is_available ? 'badge-success' : 'badge-danger'}`}>
                              {d.is_available ? '● Active' : '● Inactive'}
                            </button>
                          </td>
                          <td className="py-3 px-3">
                            <button onClick={() => handleDelete(d.id)} className="text-xs bg-red-50 text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors">
                              🗑 Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!doctors.length && (
                    <div className="text-center py-10 text-gray-400">
                      <p className="text-3xl mb-2">👨‍⚕️</p>
                      <p>No doctors yet. Click "Add New Doctor" to get started!</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Add Doctor Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
              <div>
                <h2 className="font-extrabold text-lg">➕ Add New Doctor</h2>
                <p className="text-gray-400 text-xs mt-0.5">Fill in the doctor's details below</p>
              </div>
              <button onClick={() => { setShowModal(false); setForm(emptyForm); setError('') }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500 font-bold flex items-center justify-center">✕</button>
            </div>

            <form onSubmit={handleAddDoctor} className="p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Personal Information</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="form-group"><label>First Name *</label><input value={form.first_name} onChange={e => set('first_name', e.target.value)} placeholder="Ayesha" required /></div>
                <div className="form-group"><label>Last Name *</label><input value={form.last_name} onChange={e => set('last_name', e.target.value)} placeholder="Rahman" required /></div>
                <div className="form-group"><label>Email *</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="doctor@example.com" required /></div>
                <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="017XXXXXXXX" /></div>
              </div>

              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Account Credentials</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="form-group"><label>Username *</label><input value={form.username} onChange={e => set('username', e.target.value)} placeholder="dr_ayesha" required /></div>
                <div className="form-group"><label>Password *</label><input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters" required minLength={6} /></div>
              </div>

              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Professional Information</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="form-group">
                  <label>Specialty *</label>
                  <select value={form.specialty} onChange={e => set('specialty', e.target.value)} required>
                    {specialties.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Hospital *</label><input value={form.hospital} onChange={e => set('hospital', e.target.value)} placeholder="Dhaka Medical Center" required /></div>
                <div className="form-group"><label>Experience</label><input value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="5 years" /></div>
                <div className="form-group"><label>Consultation Fee (৳) *</label><input type="number" value={form.consultation_fee} onChange={e => set('consultation_fee', e.target.value)} placeholder="800" required /></div>
              </div>
              <div className="form-group mb-5">
                <label>Bio</label>
                <textarea value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Brief description about the doctor..." rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 resize-none" />
              </div>

              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Available Time Slots</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {defaultSlots.map(slot => (
                  <button key={slot} type="button" onClick={() => toggleSlot(slot)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${form.slots.includes(slot) ? 'bg-teal-600 text-white border-teal-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-teal-300'}`}>
                    {form.slots.includes(slot) ? '✓ ' : ''}{slot}
                  </button>
                ))}
              </div>

              {error   && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm mb-4">❌ {error}</div>}
              {success && <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm mb-4">{success}</div>}

              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowModal(false); setForm(emptyForm); setError('') }} className="btn-outline flex-1 py-3">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-[2] py-3 text-sm">
                  {saving ? '⏳ Adding Doctor…' : '➕ Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

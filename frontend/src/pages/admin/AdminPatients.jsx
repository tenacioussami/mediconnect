import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { getToken } from '../../services/api'

const BASE_URL = 'http://localhost:8000/api'

export default function AdminPatients() {
  const [patients, setPatients]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [selected, setSelected]     = useState(null)
  const [editForm, setEditForm]     = useState({})
  const [saving, setSaving]         = useState(false)
  const [showEdit, setShowEdit]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(null)
  const [success, setSuccess]       = useState('')
  const [error, setError]           = useState('')

  useEffect(() => {
    fetch(`${BASE_URL}/patients/`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(d => setPatients(d?.results ?? d ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = patients.filter(p =>
    `${p.user?.first_name} ${p.user?.last_name} ${p.user?.email} ${p.user?.phone}`
      .toLowerCase().includes(search.toLowerCase())
  )

  const openEdit = (p) => {
    setSelected(p)
    setEditForm({
      first_name:  p.user?.first_name || '',
      last_name:   p.user?.last_name  || '',
      email:       p.user?.email      || '',
      phone:       p.user?.phone      || '',
      gender:      p.gender           || '',
      blood_group: p.blood_group      || '',
      division:    p.division         || '',
      dob:         p.dob              || '',
    })
    setShowEdit(true)
    setError(''); setSuccess('')
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true); setError(''); setSuccess('')
    try {
      const res = await fetch(`${BASE_URL}/patients/${selected.id}/`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body:    JSON.stringify(editForm)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Update failed')
      setPatients(prev => prev.map(p => p.id === selected.id ? { ...p, ...data } : p))
      setSuccess('✅ Patient updated successfully!')
      setTimeout(() => { setShowEdit(false); setSuccess('') }, 1500)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`${BASE_URL}/patients/${id}/`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      setPatients(prev => prev.filter(p => p.id !== id))
      setShowConfirm(null)
    } catch { setError('Failed to delete patient') }
  }

  const set = (k, v) => setEditForm(f => ({ ...f, [k]: v }))

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Manage Patients" />
        <div className="p-6 animate-fade-in">

          {/* Header */}
          <div className="bg-gradient-to-r from-teal-700 to-teal-500 rounded-2xl p-6 mb-6 flex justify-between items-center flex-wrap gap-4">
            <div>
              <p className="text-white/75 text-sm">Admin Control</p>
              <h2 className="text-white font-extrabold text-2xl mt-1">Patient Management</h2>
              <p className="text-white/70 text-sm mt-1">View, update or delete patient accounts</p>
            </div>
            <div className="bg-white/15 rounded-xl px-5 py-3 text-center border border-white/25">
              <p className="text-white/70 text-xs">Total Patients</p>
              <p className="text-white font-extrabold text-3xl">{patients.length}</p>
            </div>
          </div>

          {/* Search */}
          <div className="card p-4 mb-5">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email or phone..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 outline-none focus:border-teal-400 focus:bg-white transition-colors" />
            </div>
          </div>

          {/* Patients Table */}
          <div className="card p-5">
            {loading ? (
              <div className="text-center py-12 text-gray-400"><p className="text-3xl mb-3">⏳</p><p>Loading patients…</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      {['Patient','Email','Phone','Blood Group','Gender','Division','Actions'].map(h => (
                        <th key={h} className="py-3 px-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex gap-2 items-center">
                            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 font-bold shrink-0">
                              {p.user?.first_name?.charAt(0) || 'P'}
                            </div>
                            <div>
                              <p className="font-semibold">{p.user?.first_name} {p.user?.last_name}</p>
                              <p className="text-xs text-gray-400">ID: {p.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-gray-500 text-xs">{p.user?.email || '—'}</td>
                        <td className="py-3 px-3 text-gray-500 text-xs">{p.user?.phone || '—'}</td>
                        <td className="py-3 px-3">
                          {p.blood_group ? (
                            <span className="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-0.5 rounded-full">{p.blood_group}</span>
                          ) : '—'}
                        </td>
                        <td className="py-3 px-3 text-gray-500 text-xs">{p.gender || '—'}</td>
                        <td className="py-3 px-3 text-gray-500 text-xs">{p.division || '—'}</td>
                        <td className="py-3 px-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(p)}
                              className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-semibold">
                              ✏️ Edit
                            </button>
                            <button onClick={() => setShowConfirm(p.id)}
                              className="text-xs bg-red-50 text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-semibold">
                              🗑 Delete
                            </button>
                          </div>
                          {/* Delete Confirm */}
                          {showConfirm === p.id && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                              <p className="text-xs font-semibold text-red-600 mb-2">Delete this patient?</p>
                              <div className="flex gap-2">
                                <button onClick={() => setShowConfirm(null)} className="text-xs px-3 py-1 bg-white border border-gray-200 rounded-lg">Cancel</button>
                                <button onClick={() => handleDelete(p.id)} className="text-xs px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">Yes, Delete</button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!filtered.length && (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-3xl mb-2">👥</p>
                    <p>{search ? 'No patients found for your search.' : 'No patients registered yet.'}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Edit Patient Modal ── */}
      {showEdit && selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setShowEdit(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="font-extrabold text-lg">✏️ Edit Patient</h2>
                <p className="text-gray-400 text-xs mt-0.5">ID: {selected.id} · {selected.user?.username}</p>
              </div>
              <button onClick={() => { setShowEdit(false); setError(''); setSuccess('') }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500 font-bold flex items-center justify-center">✕</button>
            </div>

            <form onSubmit={handleUpdate} className="p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Personal Information</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="form-group"><label>First Name</label><input value={editForm.first_name} onChange={e => set('first_name', e.target.value)} /></div>
                <div className="form-group"><label>Last Name</label><input value={editForm.last_name} onChange={e => set('last_name', e.target.value)} /></div>
                <div className="form-group"><label>Email</label><input type="email" value={editForm.email} onChange={e => set('email', e.target.value)} /></div>
                <div className="form-group"><label>Phone</label><input value={editForm.phone} onChange={e => set('phone', e.target.value)} /></div>
              </div>

              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Medical Information</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="form-group">
                  <label>Gender</label>
                  <select value={editForm.gender} onChange={e => set('gender', e.target.value)}>
                    <option value="">Select</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <select value={editForm.blood_group} onChange={e => set('blood_group', e.target.value)}>
                    <option value="">Select</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Division</label>
                  <select value={editForm.division} onChange={e => set('division', e.target.value)}>
                    <option value="">Select</option>
                    {['Dhaka','Chittagong','Rajshahi','Khulna','Barisal','Sylhet','Rangpur','Mymensingh'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" value={editForm.dob} onChange={e => set('dob', e.target.value)} />
                </div>
              </div>

              {error   && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm mb-4">❌ {error}</div>}
              {success && <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm mb-4">{success}</div>}

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowEdit(false)} className="btn-outline flex-1 py-3">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-[2] py-3 text-sm">
                  {saving ? '⏳ Saving…' : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { doctorsAPI, appointmentsAPI } from '../../services/api'

const specialties = ['All','Cardiology','Neurology','Dermatology','Orthopedics','Pediatrics','General Medicine']

export default function BookAppointment() {
  const [doctors, setDoctors]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [filter, setFilter]           = useState('All')
  const [search, setSearch]           = useState('')
  const [selectedDoctor, setSelected] = useState(null)
  const [selectedSlot, setSlot]       = useState('')
  const [type, setType]               = useState('Online')
  const [date, setDate]               = useState('')
  const [complaint, setComplaint]     = useState('')
  const [booking, setBooking]         = useState(false)
  const [booked, setBooked]           = useState(false)
  const [error, setError]             = useState('')

  useEffect(() => {
    doctorsAPI.list().then(d => setDoctors(d?.results ?? d ?? [])).catch(console.error).finally(() => setLoading(false))
  }, [])

  const filtered = doctors.filter(d =>
    (filter === 'All' || d.specialty === filter) &&
    (d.full_name?.toLowerCase().includes(search.toLowerCase()) || d.specialty?.toLowerCase().includes(search.toLowerCase()))
  )

  const handleBook = async () => {
    if (!selectedSlot || !date) { setError('Please select a date and time slot.'); return }
    setBooking(true); setError('')
    try {
      await appointmentsAPI.create({
        doctor:    selectedDoctor.id,
        date, time_slot: selectedSlot, type, complaint,
        fee: Number(selectedDoctor.consultation_fee) + 50,
      })
      setBooked(true)
    } catch (err) {
      setError(err.message || 'Booking failed. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (booked) return (
    <div className="app-layout"><Sidebar />
      <div className="main-content"><Topbar title="Book Appointment" />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="card p-10 text-center max-w-sm w-full">
            <p className="text-5xl mb-4">✅</p>
            <h2 className="text-xl font-extrabold mb-2">Appointment Booked!</h2>
            <p className="text-gray-500 text-sm mb-4">With <strong>{selectedDoctor?.full_name}</strong> on <strong>{date}</strong> at <strong>{selectedSlot}</strong> ({type})</p>
            <div className="bg-teal-50 rounded-xl p-3 mb-5 text-xs text-teal-700">📱 A reminder will be sent 30 minutes before.</div>
            <button className="btn-primary w-full py-3" onClick={() => { setBooked(false); setSelected(null); setSlot(''); setDate(''); setComplaint('') }}>Book Another</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Book Appointment" />
        <div className="p-6 animate-fade-in">
          {/* Search & Filter */}
          <div className="card p-4 mb-5 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[180px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search doctors or specialties…"
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 outline-none focus:border-teal-400 focus:bg-white transition-colors" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {specialties.map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${filter === s ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className={`grid gap-5 ${selectedDoctor ? 'grid-cols-1 lg:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">{filtered.length} doctors found</p>
              {loading ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-3xl mb-3 animate-spin-slow">⏳</p><p>Loading doctors from server…</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map(d => (
                    <div key={d.id} onClick={() => { setSelected(d); setSlot('') }}
                      className={`card p-4 cursor-pointer transition-all hover:-translate-y-0.5 ${selectedDoctor?.id === d.id ? 'ring-2 ring-teal-500' : ''}`}>
                      <div className="flex gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-700 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shrink-0">
                          {d.full_name?.split(' ').slice(-1)[0]?.charAt(0) || 'D'}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{d.full_name}</p>
                          <p className="text-teal-600 text-xs font-semibold">{d.specialty}</p>
                          <p className="text-gray-400 text-xs">{d.experience} · {d.hospital}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm">⭐ {d.rating} · <strong className="text-teal-700">৳{d.consultation_fee}</strong></p>
                        <span className={`badge ${d.is_available ? 'badge-success' : 'badge-danger'}`}>{d.is_available ? '● Available' : '● Busy'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedDoctor && (
              <div className="card p-5 self-start sticky top-20">
                <h3 className="font-bold mb-4 pb-3 border-b border-gray-100 text-sm">Book with {selectedDoctor.full_name}</h3>

                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Consultation Type</p>
                <div className="flex gap-2 mb-4">
                  {['Online','Offline'].map(t => (
                    <button key={t} onClick={() => setType(t)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${type === t ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
                      {t === 'Online' ? '📹' : '🏥'} {t}
                    </button>
                  ))}
                </div>

                <div className="form-group">
                  <label>Select Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                </div>

                <div className="form-group">
                  <label>Chief Complaint</label>
                  <input value={complaint} onChange={e => setComplaint(e.target.value)} placeholder="Describe your symptoms briefly" />
                </div>

                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Available Slots</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {selectedDoctor.slots?.length ? selectedDoctor.slots.map(s => (
                    <button key={s.id} onClick={() => !s.is_booked && setSlot(s.slot_time)} disabled={s.is_booked}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${s.is_booked ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed' : selectedSlot === s.slot_time ? 'bg-teal-600 text-white border-teal-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-teal-300'}`}>
                      {s.slot_time}{s.is_booked ? ' ✗' : ''}
                    </button>
                  )) : <p className="text-xs text-gray-400">No slots configured</p>}
                </div>

                <div className="bg-gray-50 rounded-xl p-3.5 mb-4 text-sm">
                  <div className="flex justify-between mb-1.5"><span className="text-gray-400">Consultation Fee</span><strong>৳{selectedDoctor.consultation_fee}</strong></div>
                  <div className="flex justify-between mb-1.5"><span className="text-gray-400">Platform Fee</span><strong>৳50</strong></div>
                  <div className="flex justify-between border-t border-dashed border-gray-200 pt-2 mt-2">
                    <strong>Total</strong><strong className="text-teal-700 text-base">৳{Number(selectedDoctor.consultation_fee) + 50}</strong>
                  </div>
                </div>

                {error && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-600 text-xs mb-3">{error}</div>}
                <button className="btn-primary w-full py-3 text-sm" onClick={handleBook} disabled={booking}>
                  {booking ? '⏳ Booking…' : `Confirm & Pay ৳${Number(selectedDoctor.consultation_fee) + 50}`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

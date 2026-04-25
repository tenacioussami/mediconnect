import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const specialties = ['General Medicine','Cardiology','Neurology','Dermatology','Orthopedics','Pediatrics','Gynecology','Psychiatry','Ophthalmology','ENT','Urology','Oncology']
const defaultSlots = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM']

const emptyForm = {
  first_name:'', last_name:'', email:'', phone:'',
  username:'', password:'', confirm:'',
  specialty:'General Medicine', hospital:'', experience:'',
  consultation_fee:'', bio:'', slots:[]
}

export default function RegisterDoctor() {
  const navigate    = useNavigate()
  const [step, setStep]   = useState(1)
  const [form, setForm]   = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleSlot = (slot) => setForm(f => ({
    ...f, slots: f.slots.includes(slot) ? f.slots.filter(s => s !== slot) : [...f.slots, slot]
  }))

  const validateStep1 = () => {
    const e = {}
    if (!form.first_name.trim()) e.first_name = 'First name required'
    if (!form.email.trim())      e.email = 'Email required'
    if (!form.specialty)         e.specialty = 'Specialty required'
    if (!form.hospital.trim())   e.hospital = 'Hospital required'
    if (!form.consultation_fee)  e.consultation_fee = 'Fee required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.username.trim())            e.username = 'Username required'
    if (form.password.length < 6)         e.password = 'Minimum 6 characters'
    if (form.password !== form.confirm)   e.confirm  = 'Passwords do not match'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep2()) return
    setLoading(true); setApiError('')
    try {
      const res = await fetch('http://localhost:8000/api/doctors/add/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username:         form.username,
          email:            form.email,
          phone:            form.phone,
          first_name:       form.first_name,
          last_name:        form.last_name,
          password:         form.password,
          specialty:        form.specialty,
          hospital:         form.hospital,
          experience:       form.experience,
          consultation_fee: form.consultation_fee,
          bio:              form.bio,
          slots:            form.slots,
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Registration failed')
      setSuccess(true)
    } catch (err) {
      setApiError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="card p-10 text-center max-w-sm w-full">
        <p className="text-6xl mb-4">🎉</p>
        <h2 className="text-2xl font-extrabold mb-2 text-gray-900">Registration Successful!</h2>
        <p className="text-gray-500 text-sm mb-1">Dr. <strong>{form.first_name} {form.last_name}</strong> has been registered.</p>
        <p className="text-gray-400 text-xs mb-6">They can now login with username: <strong>{form.username}</strong></p>
        <div className="flex gap-3">
          <button onClick={() => { setForm(emptyForm); setStep(1); setSuccess(false) }}
            className="btn-outline flex-1 py-2.5 text-sm">Register Another</button>
          <button onClick={() => navigate('/login')}
            className="btn-primary flex-1 py-2.5 text-sm">Go to Login</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="text-center mb-6">
          <div onClick={() => navigate('/')} className="inline-flex items-center gap-2 cursor-pointer mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-700 to-teal-400 rounded-xl flex items-center justify-center text-xl">🩺</div>
            <span className="font-extrabold text-xl text-teal-700">MediConnect</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Registration</h1>
          <p className="text-gray-400 text-sm mt-1">Step {step} of 2</p>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div className={`h-full rounded-full bg-gradient-to-r from-teal-700 to-teal-400 transition-all duration-500 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
        </div>

        <div className="card p-7">
          {step === 1 ? (
            <>
              <h3 className="font-bold text-base mb-5">👨‍⚕️ Professional Information</h3>

              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label>First Name *</label>
                  <input value={form.first_name} onChange={e => set('first_name', e.target.value)} placeholder="Ayesha" />
                  {errors.first_name && <span className="text-red-500 text-xs">{errors.first_name}</span>}
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input value={form.last_name} onChange={e => set('last_name', e.target.value)} placeholder="Rahman" />
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="doctor@example.com" />
                  {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="017XXXXXXXX" />
                </div>
              </div>

              {/* Specialty & Hospital */}
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label>Specialty *</label>
                  <select value={form.specialty} onChange={e => set('specialty', e.target.value)}>
                    {specialties.map(s => <option key={s}>{s}</option>)}
                  </select>
                  {errors.specialty && <span className="text-red-500 text-xs">{errors.specialty}</span>}
                </div>
                <div className="form-group">
                  <label>Hospital *</label>
                  <input value={form.hospital} onChange={e => set('hospital', e.target.value)} placeholder="Dhaka Medical Center" />
                  {errors.hospital && <span className="text-red-500 text-xs">{errors.hospital}</span>}
                </div>
              </div>

              {/* Experience & Fee */}
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label>Experience</label>
                  <input value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="5 years" />
                </div>
                <div className="form-group">
                  <label>Consultation Fee (৳) *</label>
                  <input type="number" value={form.consultation_fee} onChange={e => set('consultation_fee', e.target.value)} placeholder="800" />
                  {errors.consultation_fee && <span className="text-red-500 text-xs">{errors.consultation_fee}</span>}
                </div>
              </div>

              {/* Bio */}
              <div className="form-group">
                <label>Bio / Description</label>
                <textarea value={form.bio} onChange={e => set('bio', e.target.value)}
                  placeholder="Brief description about yourself, expertise, achievements..."
                  rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 resize-none transition-colors" />
              </div>

              {/* Time Slots */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-600 mb-2">Available Time Slots</label>
                <div className="flex flex-wrap gap-2">
                  {defaultSlots.map(slot => (
                    <button key={slot} type="button" onClick={() => toggleSlot(slot)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${form.slots.includes(slot) ? 'bg-teal-600 text-white border-teal-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-teal-300'}`}>
                      {form.slots.includes(slot) ? '✓ ' : ''}{slot}
                    </button>
                  ))}
                </div>
              </div>

              <button type="button" className="btn-primary w-full py-3"
                onClick={() => { if (validateStep1()) setStep(2) }}>
                Continue → Account Setup
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="font-bold text-base mb-5">🔐 Account Credentials</h3>

              <div className="form-group">
                <label>Username *</label>
                <input value={form.username} onChange={e => set('username', e.target.value)} placeholder="dr_ayesha" />
                {errors.username && <span className="text-red-500 text-xs">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Minimum 6 characters" />
                {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>
                <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Repeat password" />
                {errors.confirm && <span className="text-red-500 text-xs">{errors.confirm}</span>}
              </div>

              {/* Summary */}
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-5">
                <p className="text-xs font-bold text-teal-700 mb-2 uppercase tracking-wide">Registration Summary</p>
                <div className="grid grid-cols-2 gap-y-1 text-xs text-teal-800">
                  <span className="text-teal-500">Name:</span>      <span className="font-semibold">Dr. {form.first_name} {form.last_name}</span>
                  <span className="text-teal-500">Specialty:</span> <span className="font-semibold">{form.specialty}</span>
                  <span className="text-teal-500">Hospital:</span>  <span className="font-semibold">{form.hospital}</span>
                  <span className="text-teal-500">Fee:</span>       <span className="font-semibold">৳{form.consultation_fee}</span>
                  <span className="text-teal-500">Slots:</span>     <span className="font-semibold">{form.slots.length} selected</span>
                </div>
              </div>

              {apiError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm mb-4">
                  ❌ {apiError}
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1 py-3">← Back</button>
                <button type="submit" disabled={loading} className="btn-primary flex-[2] py-3 text-sm">
                  {loading ? '⏳ Registering…' : '✅ Register Doctor'}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center mt-4 text-sm text-gray-400">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className="text-teal-700 font-semibold cursor-pointer hover:underline">Login</span>
        </p>
      </div>
    </div>
  )
}

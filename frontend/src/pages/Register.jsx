import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate  = useNavigate()
  const { register } = useAuth()
  const [step, setStep]     = useState(1)
  const [form, setForm]     = useState({ first_name:'', last_name:'', email:'', phone:'', dob:'', gender:'', blood_group:'', division:'', username:'', password:'', confirm:'' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const v1 = () => {
    const e = {}
    if (!form.first_name.trim()) e.first_name = 'First name required'
    if (!form.email && !form.phone) e.email = 'Email or phone required'
    if (!form.dob) e.dob = 'Date of birth required'
    if (!form.gender) e.gender = 'Gender required'
    setErrors(e); return !Object.keys(e).length
  }
  const v2 = () => {
    const e = {}
    if (!form.username.trim()) e.username = 'Username required'
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e); return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!v2()) return
    setLoading(true); setApiError('')
    try {
      const payload = {
        username: form.username, email: form.email, phone: form.phone,
        first_name: form.first_name, last_name: form.last_name,
        password: form.password, password2: form.confirm,
        dob: form.dob, gender: form.gender,
        blood_group: form.blood_group, division: form.division,
      }
      await register(payload)
      navigate('/patient')
    } catch (err) {
      setApiError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div onClick={() => navigate('/')} className="inline-flex items-center gap-2 cursor-pointer mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-700 to-teal-400 rounded-xl flex items-center justify-center text-lg">🩺</div>
            <span className="font-extrabold text-lg text-teal-700">MediConnect</span>
          </div>
          <h1 className="text-2xl font-bold">Create Patient Account</h1>
          <p className="text-gray-400 text-sm mt-1">Step {step} of 2</p>
        </div>

        <div className="h-1 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div className={`h-full rounded-full bg-gradient-to-r from-teal-700 to-teal-400 transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
        </div>

        <div className="card p-7">
          {step === 1 ? (
            <>
              <h3 className="font-bold mb-5">Personal Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label>First Name *</label>
                  <input value={form.first_name} onChange={e => set('first_name', e.target.value)} placeholder="Farhan" />
                  {errors.first_name && <span className="text-red-500 text-xs">{errors.first_name}</span>}
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input value={form.last_name} onChange={e => set('last_name', e.target.value)} placeholder="Hossain" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
                  {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="017XXXXXXXX" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input type="date" value={form.dob} onChange={e => set('dob', e.target.value)} />
                  {errors.dob && <span className="text-red-500 text-xs">{errors.dob}</span>}
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select value={form.gender} onChange={e => set('gender', e.target.value)}>
                    <option value="">Select</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                  {errors.gender && <span className="text-red-500 text-xs">{errors.gender}</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label>Blood Group</label>
                  <select value={form.blood_group} onChange={e => set('blood_group', e.target.value)}>
                    <option value="">Select</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Division</label>
                  <select value={form.division} onChange={e => set('division', e.target.value)}>
                    <option value="">Select</option>
                    {['Dhaka','Chittagong','Rajshahi','Khulna','Barisal','Sylhet','Rangpur','Mymensingh'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn-primary w-full py-3 mt-1" onClick={() => { if (v1()) setStep(2) }}>Continue →</button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="font-bold mb-5">Account Credentials</h3>
              <div className="form-group">
                <label>Username *</label>
                <input value={form.username} onChange={e => set('username', e.target.value)} placeholder="Choose a username" />
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
              {apiError && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-600 text-sm mb-4">{apiError}</div>}
              <div className="bg-teal-50 rounded-lg px-4 py-3 mb-4 text-xs text-teal-700">
                ✅ Doctor and staff accounts are created by hospital administration.
              </div>
              <div className="flex gap-3">
                <button type="button" className="btn-outline flex-1 py-3" onClick={() => setStep(1)}>← Back</button>
                <button type="submit" className="btn-primary flex-[2] py-3" disabled={loading}>
                  {loading ? '⏳ Creating…' : 'Create Account 🎉'}
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

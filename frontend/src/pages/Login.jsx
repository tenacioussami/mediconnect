import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roles = [
  { value: 'patient', label: 'Patient', icon: '🧑‍⚕️', hint: 'farhan / patient123' },
  { value: 'doctor',  label: 'Doctor',  icon: '👨‍⚕️', hint: 'dr_ayesha / doctor123' },
  { value: 'admin',   label: 'Admin',   icon: '⚙️',   hint: 'admin / admin123' },
  { value: 'nurse',   label: 'Nurse',   icon: '👩‍⚕️', hint: 'nurse_sadia / nurse123' },
]
const routeMap = { patient: '/patient', doctor: '/doctor', admin: '/admin', nurse: '/nurse', staff: '/admin' }

export default function Login() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [role, setRole]         = useState('patient')
  const [identifier, setId]     = useState('farhan')
  const [password, setPassword] = useState('patient123')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const fillDemo = (r) => {
    setRole(r.value)
    const [u, p] = r.hint.split(' / ')
    setId(u); setPassword(p)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const user = await login(identifier, password)
      navigate(routeMap[user.role] || '/')
    } catch (err) {
      setError(err.message || 'Login failed. Check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-7">
          <div onClick={() => navigate('/')} className="inline-flex items-center gap-2 cursor-pointer mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-700 to-teal-400 rounded-xl flex items-center justify-center text-xl">🩺</div>
            <span className="font-extrabold text-xl text-teal-700">ShasthoBondhu</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your healthcare portal</p>
        </div>

        <div className="card p-7">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Login As</p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {roles.map(r => (
              <button key={r.value} onClick={() => fillDemo(r)}
                className={`p-3 rounded-xl text-left transition-all border ${role === r.value ? 'bg-teal-50 border-teal-500' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                <p className="text-xl">{r.icon}</p>
                <p className={`font-semibold text-sm mt-1 ${role === r.value ? 'text-teal-700' : 'text-gray-800'}`}>{r.label}</p>
                <p className="text-gray-400 text-[11px] leading-tight font-mono">{r.hint}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username or Email</label>
              <input type="text" value={identifier} onChange={e => setId(e.target.value)} placeholder="Enter username or email" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />
            </div>
            {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-600 text-sm mb-4">{error}</div>}
            <button type="submit" className="btn-primary w-full py-3 text-sm rounded-xl" disabled={loading}>
              {loading ? '⏳ Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-4">
            Don't have an account?{' '}
            <span onClick={() => navigate('/register')} className="text-teal-700 font-semibold cursor-pointer hover:underline">Register here</span>
          </p>

          <div className="bg-teal-50 rounded-lg px-4 py-3 mt-4 text-xs text-teal-700">
            🎯 <strong>Click any role card</strong> above to auto-fill demo credentials.
          </div>
        </div>
        <p onClick={() => navigate('/')} className="text-center mt-4 text-sm text-gray-400 cursor-pointer hover:text-teal-600">← Back to Home</p>
      </div>
    </div>
  )
}

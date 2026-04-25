import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navConfig = {
  patient: [
    { label: 'Dashboard',        path: '/patient',                icon: '🏠' },
    { label: 'Book Appointment', path: '/patient/book',           icon: '📅' },
    { label: 'My Appointments',  path: '/patient/appointments',   icon: '📋' },
    { label: 'Symptom Checker',  path: '/patient/symptoms',       icon: '🔍' },
    { label: 'Prescriptions',    path: '/patient/prescriptions',  icon: '💊' },
    { label: 'Test Reports',     path: '/patient/tests',          icon: '🧪' },
    { label: 'Video Call',       path: '/patient/video',          icon: '📹' },
    { label: 'Payments',         path: '/patient/payments',       icon: '💳' },
  ],
  doctor: [
    { label: 'Dashboard',       path: '/doctor',               icon: '🏠' },
    { label: 'Appointments',    path: '/doctor/appointments',  icon: '📅' },
    { label: 'Prescriptions',   path: '/doctor/prescriptions', icon: '💊' },
    { label: 'Request Test',    path: '/doctor/request-test',  icon: '🧪' },
    { label: 'Patient Records', path: '/doctor/patients',      icon: '👥' },
    { label: 'Video Consult',   path: '/doctor/video',         icon: '📹' },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin',          icon: '🏠' },
    { label: 'Doctors',   path: '/admin/doctors',  icon: '👨‍⚕️' },
    { label: 'Patients',  path: '/admin/patients', icon: '👥' },
    { label: 'Reports',   path: '/admin/reports',  icon: '📊' },
    { label: 'Settings',  path: '/admin/settings', icon: '⚙️' },
  ],
  nurse: [
    { label: 'Dashboard',       path: '/nurse',          icon: '🏠' },
  ],
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  if (!user) return null
  const items = navConfig[user.role] || []
  const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1)
  const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User'
  const userInitial = userName.charAt(0).toUpperCase() || 'U'

  return (
    <aside className={`${collapsed ? 'w-[68px]' : 'w-60'} shrink-0 min-h-screen bg-gradient-to-b from-teal-700 to-teal-900 flex flex-col transition-all duration-300 sticky top-0 z-50 overflow-hidden`}>

      {/* Logo */}
      <div className={`border-b border-white/10 flex items-center ${collapsed ? 'justify-center px-2 py-5' : 'gap-2.5 px-5 py-5'}`}>
        <div className="w-9 h-9 bg-teal-400 rounded-xl flex items-center justify-center text-lg shrink-0">🩺</div>
        {!collapsed && (
          <div>
            <p className="text-white font-extrabold text-base tracking-tight leading-none">ShasthoBondhu</p>
            <p className="text-white/50 text-[11px] mt-0.5">Telemedicine</p>
          </div>
        )}
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-teal-400 flex items-center justify-center text-teal-900 font-bold text-base shrink-0">
            {userInitial}
          </div>
          <div className="overflow-hidden">
            <p className="text-white font-semibold text-sm truncate">{userName}</p>
            <span className="inline-block bg-teal-400/20 text-teal-300 text-[11px] px-2 py-0.5 rounded-full font-medium mt-0.5">{roleLabel}</span>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5">
        {items.map(item => {
          const active = location.pathname === item.path
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`flex items-center rounded-xl text-sm w-full transition-all duration-150 border
                ${collapsed ? 'justify-center px-2 py-3 gap-0' : 'gap-2.5 px-3 py-2.5'}
                ${active
                  ? 'bg-teal-400/20 border-teal-400/30 text-teal-300 font-semibold'
                  : 'border-transparent text-white/70 hover:bg-white/10 hover:text-white font-normal'}`}>
              <span className="text-base">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-white/10 flex flex-col gap-2">
        <button onClick={() => setCollapsed(c => !c)}
          className="w-full py-1.5 rounded-xl bg-white/10 text-white/60 text-xs hover:bg-white/15 transition-colors flex items-center justify-center gap-1">
          {collapsed ? '→' : '← Collapse'}
        </button>
        <button onClick={() => { logout(); navigate('/') }}
          className="w-full py-1.5 rounded-xl bg-red-500/15 text-red-300 text-xs border border-red-500/20 hover:bg-red-500/25 transition-colors flex items-center justify-center gap-1">
          {collapsed ? '🚪' : '🚪 Logout'}
        </button>
      </div>
    </aside>
  )
}

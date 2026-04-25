import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const notifications = [
  { id: 1, text: 'Appointment confirmed with Dr. Ayesha', time: '5 min ago',   read: false },
  { id: 2, text: 'Test report for CBC is ready',          time: '1 hour ago',  read: false },
  { id: 3, text: 'Prescription updated by Dr. Tanvir',    time: '2 hours ago', read: true  },
]

export default function Topbar({ title }) {
  const { user } = useAuth()
  const [showNotif, setShowNotif] = useState(false)
  const unread = notifications.filter(n => !n.read).length

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h1 className="text-base font-bold text-gray-900 leading-none">{title || 'Dashboard'}</h1>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {new Date().toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
          <input placeholder="Search doctors, services…"
            className="pl-8 pr-4 py-2 border border-gray-200 rounded-full text-sm w-52 bg-gray-50 outline-none focus:border-teal-400 focus:bg-white transition-colors" />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotif(s => !s)}
            className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-base hover:bg-gray-100 transition-colors">
            🔔
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                {unread}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-11 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
              <p className="px-4 py-2.5 font-bold text-sm border-b border-gray-100">Notifications</p>
              {notifications.map(n => (
                <div key={n.id} className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${!n.read ? 'bg-teal-50' : ''}`}>
                  <p className="text-xs text-gray-800">{n.text}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-700 to-teal-400 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <span className="text-sm font-semibold text-gray-800 hidden md:inline">{user?.name?.split(' ')[0]}</span>
        </div>
      </div>
    </header>
  )
}

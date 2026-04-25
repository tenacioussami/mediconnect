import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { appointments } from '../../data/mockData'

export default function VideoCall() {
  const [inCall, setInCall]     = useState(false)
  const [muted, setMuted]       = useState(false)
  const [videoOff, setVideoOff] = useState(false)
  const [chat, setChat]         = useState([
    { from: 'doctor', msg: 'Hello! Can you hear me clearly?', time: '10:02 AM' },
    { from: 'patient', msg: 'Yes, loud and clear!',           time: '10:02 AM' },
  ])
  const [msg, setMsg]       = useState('')
  const [timer, setTimer]   = useState(0)
  const [timerRef, setTimerRef] = useState(null)
  const online = appointments.filter(a => a.type === 'Online' && a.status !== 'Completed')

  const startCall = () => { setInCall(true); const r = setInterval(() => setTimer(t => t + 1), 1000); setTimerRef(r) }
  const endCall   = () => { setInCall(false); clearInterval(timerRef); setTimer(0) }
  const sendMsg   = () => { if (!msg.trim()) return; setChat(c => [...c, { from: 'patient', msg: msg.trim(), time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) }]); setMsg('') }
  const fmt = s   => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Video Consultation" />
        <div className="p-6 animate-fade-in">
          {!inCall ? (
            <div>
              <div className="bg-gradient-to-r from-teal-900 to-teal-700 rounded-2xl p-6 mb-5 flex items-center gap-4">
                <span className="text-5xl">📹</span>
                <div><h2 className="text-white font-extrabold text-lg">Video Consultations</h2>
                  <p className="text-white/75 text-sm mt-1">Connect with your doctor via HD video call from home.</p></div>
              </div>
              <div className="card p-5">
                <h3 className="font-bold mb-4 text-sm">Upcoming Online Appointments</h3>
                {online.map(a => (
                  <div key={a.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl mb-3 bg-gray-50 flex-wrap gap-3">
                    <div className="flex gap-3 items-center">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-700 to-teal-400 flex items-center justify-center text-white font-bold text-lg">{a.doctorName.split(' ')[1]?.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-sm">{a.doctorName}</p>
                        <p className="text-xs text-gray-400">{a.specialty} · {a.date} at {a.time}</p>
                        <span className={`badge mt-1 ${a.status === 'Confirmed' ? 'badge-success' : 'badge-warning'}`}>{a.status}</span>
                      </div>
                    </div>
                    <button onClick={startCall} className="btn-primary py-2 px-4 text-sm">📹 Join Call</button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4" style={{ height: 'calc(100vh - 200px)' }}>
              {/* Video */}
              <div className="bg-gray-900 rounded-2xl overflow-hidden flex flex-col relative">
                <div className="flex-1 flex items-center justify-center bg-gradient-radial from-teal-900 to-gray-900">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-700 to-teal-400 flex items-center justify-center text-4xl mx-auto mb-3">👨‍⚕️</div>
                    <p className="text-white font-bold">Dr. Ayesha Rahman</p>
                    <p className="text-white/50 text-sm">Cardiologist</p>
                  </div>
                </div>
                {/* Self view */}
                <div className="absolute top-4 right-4 w-32 h-20 rounded-xl bg-gray-700 border-2 border-white/20 flex items-center justify-center">
                  <div className="text-center text-white/60 text-xs"><p className="text-2xl">🧑</p><p>You</p></div>
                </div>
                {/* Timer */}
                <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">🔴 {fmt(timer)}</div>
                {/* Controls */}
                <div className="bg-black/60 backdrop-blur-sm px-4 py-3 flex justify-center gap-3">
                  {[
                    { icon: muted ? '🔇' : '🎤',   active: muted,    action: () => setMuted(m => !m) },
                    { icon: videoOff ? '📷' : '📹', active: videoOff, action: () => setVideoOff(v => !v) },
                    { icon: '💬', active: false, action: () => {} },
                  ].map((c, i) => (
                    <button key={i} onClick={c.action}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl text-white transition-colors ${c.active ? 'bg-red-500' : 'bg-white/15 hover:bg-white/25'}`}>
                      {c.icon}
                    </button>
                  ))}
                  <button onClick={endCall} className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-2xl text-white shadow-lg hover:bg-red-600 transition-colors">📵</button>
                </div>
              </div>

              {/* Chat */}
              <div className="card flex flex-col overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 font-bold text-sm">💬 Chat</div>
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                  {chat.map((c, i) => (
                    <div key={i} className={`flex flex-col ${c.from === 'patient' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm ${c.from === 'patient' ? 'bg-teal-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>{c.msg}</div>
                      <p className="text-[11px] text-gray-400 mt-0.5">{c.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100 flex gap-2">
                  <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} placeholder="Type a message…"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-400 bg-gray-50" />
                  <button onClick={sendMsg} className="btn-primary px-4 py-2 text-sm">Send</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

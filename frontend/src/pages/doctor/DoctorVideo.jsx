import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'

const queue = [
  { id:'P001', name:'Farhan Hossain', age:25, time:'10:00 AM', complaint:'Chest pain',        status:'Waiting'   },
  { id:'P003', name:'Kamal Hossain',  age:55, time:'2:00 PM',  complaint:'Irregular heartbeat',status:'Scheduled' },
]

export default function DoctorVideo() {
  const [inCall, setInCall]     = useState(false)
  const [muted, setMuted]       = useState(false)
  const [videoOff, setVideoOff] = useState(false)
  const [active, setActive]     = useState(null)
  const [chat, setChat]         = useState([{ from:'patient', msg:'Hello Doctor, I have chest pain since yesterday.', time:'10:01 AM' }])
  const [msg, setMsg]           = useState('')
  const [timer, setTimer]       = useState(0)
  const [ref, setRef]           = useState(null)

  const startCall = p => { setActive(p); setInCall(true); const r = setInterval(() => setTimer(t => t+1), 1000); setRef(r) }
  const endCall   = () => { setInCall(false); clearInterval(ref); setTimer(0); setActive(null) }
  const sendMsg   = () => { if (!msg.trim()) return; setChat(c => [...c, { from:'doctor', msg: msg.trim(), time: new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'}) }]); setMsg('') }
  const fmt = s   => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Video Consultation" />
        <div className="p-6 animate-fade-in">
          {!inCall ? (
            <div>
              <div className="bg-gradient-to-r from-teal-900 to-teal-700 rounded-2xl p-6 mb-5 flex gap-4 items-center">
                <span className="text-5xl">📹</span>
                <div><h2 className="text-white font-extrabold text-lg">Video Consultation Queue</h2>
                  <p className="text-white/75 text-sm mt-1">Patients waiting for online consultation.</p></div>
              </div>
              {queue.map(p => (
                <div key={p.id} className="card p-4 mb-3 flex justify-between items-center flex-wrap gap-3">
                  <div className="flex gap-3 items-center">
                    <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center font-bold text-teal-700 text-lg">{p.name.charAt(0)}</div>
                    <div>
                      <p className="font-bold text-sm">{p.name}</p>
                      <p className="text-xs text-gray-400">Age {p.age} · {p.time} · {p.complaint}</p>
                      <span className={`badge mt-1 ${p.status === 'Waiting' ? 'badge-danger' : 'badge-info'}`}>{p.status}</span>
                    </div>
                  </div>
                  <button onClick={() => startCall(p)} className="btn-primary py-2 px-5 text-sm">📹 Start Call</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4" style={{ height:'calc(100vh - 200px)' }}>
              <div className="bg-gray-900 rounded-2xl overflow-hidden flex flex-col relative">
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-teal-50 border-4 border-teal-400 flex items-center justify-center text-4xl mx-auto mb-3">🧑</div>
                    <p className="text-white font-bold">{active?.name}</p>
                    <p className="text-white/50 text-sm">Age {active?.age}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-32 h-20 rounded-xl bg-gray-700 border-2 border-white/20 flex items-center justify-center">
                  <div className="text-center text-white/60 text-xs"><p className="text-xl">👨‍⚕️</p><p>You</p></div>
                </div>
                <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full">🔴 {fmt(timer)}</div>
                <div className="bg-black/60 px-4 py-3 flex justify-center gap-3">
                  {[{ icon: muted?'🔇':'🎤', active:muted, fn:()=>setMuted(m=>!m) }, { icon:videoOff?'📷':'📹', active:videoOff, fn:()=>setVideoOff(v=>!v) }].map((c,i)=>(
                    <button key={i} onClick={c.fn} className={`w-12 h-12 rounded-full text-xl text-white transition-colors ${c.active?'bg-red-500':'bg-white/15 hover:bg-white/25'}`}>{c.icon}</button>
                  ))}
                  <button onClick={endCall} className="w-14 h-14 rounded-full bg-red-500 text-2xl text-white hover:bg-red-600 transition-colors">📵</button>
                </div>
              </div>
              <div className="card flex flex-col overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 font-bold text-sm">💬 Chat</div>
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                  {chat.map((c,i)=>(
                    <div key={i} className={`flex flex-col ${c.from==='doctor'?'items-end':'items-start'}`}>
                      <div className={`px-3 py-2 rounded-2xl max-w-[88%] text-sm ${c.from==='doctor'?'bg-blue-600 text-white rounded-br-sm':'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>{c.msg}</div>
                      <p className="text-[11px] text-gray-400 mt-0.5">{c.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100 flex gap-2">
                  <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()} placeholder="Message…" className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 bg-gray-50" />
                  <button onClick={sendMsg} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">Send</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

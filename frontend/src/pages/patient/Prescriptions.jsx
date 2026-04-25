import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { prescriptionsAPI } from '../../services/api'

export default function Prescriptions() {
  const [prescriptions, setRx] = useState([])
  const [loading, setLoading]  = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    prescriptionsAPI.list().then(d => setRx(d?.results ?? d ?? [])).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="My Prescriptions" />
        <div className="p-6 animate-fade-in">
          {loading ? (
            <div className="text-center py-12 text-gray-400"><p className="text-3xl mb-3">⏳</p><p>Loading from Django…</p></div>
          ) : !prescriptions.length ? (
            <div className="card p-12 text-center text-gray-400"><p className="text-3xl mb-2">💊</p><p>No prescriptions yet</p></div>
          ) : (
            <div className={`grid gap-5 ${selected ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
              <div className="flex flex-col gap-4">
                {prescriptions.map(p => (
                  <div key={p.id} className={`card p-5 cursor-pointer transition-all hover:-translate-y-0.5 ${selected?.id === p.id ? 'ring-2 ring-teal-500' : ''}`} onClick={() => setSelected(p)}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold">{p.diagnosis}</p>
                        <p className="text-xs text-gray-400 mt-0.5">by {p.doctor_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{p.created_at?.split('T')[0]}</p>
                        <span className="badge badge-success mt-1">Active</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {p.medicines?.map((m, i) => (
                        <span key={i} className="bg-teal-50 text-teal-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">💊 {m.name}</span>
                      ))}
                    </div>
                    <button className="text-xs text-teal-700 bg-teal-50 px-3 py-1 rounded-full font-semibold hover:bg-teal-100 transition-colors">📥 Download PDF</button>
                  </div>
                ))}
              </div>

              {selected && (
                <div className="card p-6 self-start sticky top-20">
                  <div className="border-b-2 border-teal-600 pb-4 mb-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-extrabold text-teal-700 text-base">🩺 MediConnect</p>
                        <p className="text-xs text-gray-400">Digital Prescription</p>
                      </div>
                      <div className="text-right text-xs text-gray-400">
                        <p>Prescription ID</p><p className="font-bold text-gray-800">PRX-{selected.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-5 mt-3 flex-wrap">
                      {[['Doctor', selected.doctor_name], ['Date', selected.created_at?.split('T')[0]], ['Follow-up', selected.follow_up || 'N/A']].map(([l,v]) => (
                        <div key={l}><p className="text-[11px] text-gray-400">{l}</p><p className="font-semibold text-sm">{v}</p></div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="font-bold text-sm mb-2">Diagnosis</p>
                    <div className="bg-gray-50 rounded-lg px-4 py-2.5 text-sm font-semibold text-teal-700">{selected.diagnosis}</div>
                  </div>

                  <div className="mb-4">
                    <p className="font-bold text-sm mb-3 flex items-center gap-2">
                      <span className="font-serif italic text-teal-600 text-xl">℞</span> Medicines
                    </p>
                    {selected.medicines?.map((m, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-sm shrink-0">💊</div>
                        <div>
                          <p className="font-bold text-sm">{m.name}</p>
                          <p className="text-xs text-gray-400">Dose: {m.dose} · Duration: {m.duration}</p>
                          {m.instruction && <p className="text-xs text-gray-400 italic">{m.instruction}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {selected.note && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-xs text-amber-800">
                      <strong>📝 Doctor's Note:</strong> {selected.note}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button className="btn-outline flex-1 py-2.5 text-xs" onClick={() => setSelected(null)}>Close</button>
                    <button className="btn-primary flex-[2] py-2.5 text-sm">📥 Download PDF</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

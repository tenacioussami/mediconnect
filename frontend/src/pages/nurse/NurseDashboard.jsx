import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { testReports } from '../../data/mockData'

const patients = [
  { id:'P001', name:'Farhan Hossain', age:25, ward:'Ward 3 – Bed 5', bp:'130/85', pulse:78,  temp:'98.4°F', status:'Stable'     },
  { id:'P002', name:'Rina Begum',     age:42, ward:'Ward 1 – Bed 2', bp:'145/92', pulse:88,  temp:'99.1°F', status:'Monitoring' },
  { id:'P003', name:'Kamal Hossain',  age:55, ward:'Ward 2 – Bed 8', bp:'120/80', pulse:72,  temp:'98.6°F', status:'Stable'     },
]

export default function NurseDashboard() {
  const [sel, setSel]             = useState(null)
  const [modal, setModal]         = useState(false)
  const [file, setFile]           = useState(null)
  const [uploaded, setUploaded]   = useState(false)

  const handleUpload = () => {
    if (!file) { alert('Select a file first'); return }
    setUploaded(true)
    setTimeout(() => { setModal(false); setUploaded(false); setFile(null) }, 1400)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Nurse Dashboard" />
        <div className="p-6 animate-fade-in">
          <div className="bg-gradient-to-r from-amber-700 to-amber-500 rounded-2xl p-6 mb-6">
            <h2 className="text-white font-extrabold text-xl">Nursing Station 👩‍⚕️</h2>
            <p className="text-white/80 text-sm mt-1">{patients.length} patients under monitoring today</p>
          </div>

          <div className={`grid gap-5 ${sel ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Patient Monitoring</p>
              {patients.map(p => (
                <div key={p.id} className={`card p-5 mb-3 cursor-pointer transition-all hover:-translate-y-0.5 ${sel?.id === p.id ? 'ring-2 ring-amber-400' : ''}`} onClick={() => setSel(p)}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold">{p.name}</p>
                      <p className="text-xs text-gray-400">Age {p.age} · {p.ward}</p>
                    </div>
                    <span className={`badge ${p.status === 'Stable' ? 'badge-success' : 'badge-warning'}`}>{p.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[['❤️ BP', p.bp], ['💓 Pulse', p.pulse+' bpm'], ['🌡️ Temp', p.temp]].map(([l,v]) => (
                      <div key={l} className="bg-gray-50 rounded-xl p-2.5 text-center">
                        <p className="text-[11px] text-gray-400">{l}</p>
                        <p className="font-bold text-sm mt-0.5">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {sel && (
              <div className="flex flex-col gap-4">
                <div className="card p-5">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-bold text-sm">Patient Actions</h3>
                    <button onClick={() => setSel(null)} className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">✕ Close</button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm leading-8">
                    <p className="font-bold mb-1">{sel.name}</p>
                    <p className="text-gray-400 text-xs">🏥 {sel.ward}</p>
                    <p className="text-gray-400 text-xs">❤️ BP: {sel.bp} · 💓 {sel.pulse} bpm · 🌡️ {sel.temp}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => setModal(true)} className="btn-primary py-2.5 text-sm">📄 Upload Test Report</button>
                    <button className="py-2.5 text-sm font-semibold bg-teal-50 text-teal-700 border border-teal-200 rounded-xl hover:bg-teal-100 transition-colors">📝 Update Vitals</button>
                    <button className="py-2.5 text-sm font-semibold bg-red-50 text-red-500 border border-red-200 rounded-xl hover:bg-red-100 transition-colors">🚨 Emergency Alert</button>
                  </div>
                </div>

                <div className="card p-5">
                  <h3 className="font-bold text-sm mb-3">Pending Test Uploads</h3>
                  {testReports.filter(t => t.status !== 'Completed').map(t => (
                    <div key={t.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl mb-2 bg-gray-50">
                      <div>
                        <p className="font-semibold text-sm">{t.testName}</p>
                        <p className="text-xs text-gray-400">By {t.requestedBy}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className={`badge ${t.status === 'In Progress' ? 'badge-info' : 'badge-warning'}`}>{t.status}</span>
                        <button onClick={() => setModal(true)} className="text-xs font-semibold text-white bg-teal-600 px-3 py-1 rounded-full hover:bg-teal-700 transition-colors">Upload</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="card p-7 w-full max-w-sm">
              {uploaded ? (
                <div className="text-center py-4">
                  <p className="text-4xl mb-3">✅</p>
                  <p className="font-bold text-lg">Report Uploaded!</p>
                </div>
              ) : (
                <>
                  <h3 className="font-bold mb-5">Upload Test Report</h3>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center mb-5 cursor-pointer hover:border-teal-400 transition-colors bg-gray-50"
                    onClick={() => document.getElementById('repFile').click()}>
                    <p className="text-3xl mb-2">📄</p>
                    <p className="font-semibold text-sm">{file ? file.name : 'Click to select file'}</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG or PNG (max 10MB)</p>
                    <input id="repFile" type="file" accept=".pdf,image/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
                  </div>
                  <div className="flex gap-3">
                    <button className="btn-outline flex-1 py-2.5 text-sm" onClick={() => setModal(false)}>Cancel</button>
                    <button className="btn-primary flex-[2] py-2.5 text-sm" onClick={handleUpload}>Upload Report</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

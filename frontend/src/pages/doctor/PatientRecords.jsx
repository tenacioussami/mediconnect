import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { testReports, prescriptions } from '../../data/mockData'

const patientList = [
  { id:'P001', name:'Farhan Hossain', age:25, blood:'B+', phone:'01712345678', lastVisit:'2026-04-18', diagnosis:'Hypertension' },
  { id:'P002', name:'Rina Begum',     age:42, blood:'A+', phone:'01612345678', lastVisit:'2026-04-15', diagnosis:'Type 2 Diabetes' },
  { id:'P003', name:'Kamal Hossain',  age:55, blood:'O+', phone:'01912345678', lastVisit:'2026-04-16', diagnosis:'Arrhythmia' },
  { id:'P004', name:'Sumaiya Islam',  age:30, blood:'AB+',phone:'01512345678', lastVisit:'2026-04-12', diagnosis:'Migraine' },
]

export default function PatientRecords() {
  const [sel, setSel]       = useState(null)
  const [search, setSearch] = useState('')
  const filtered = patientList.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Patient Records" />
        <div className="p-6 animate-fade-in">
          <div className={`grid gap-5 ${sel ? 'grid-cols-1 lg:grid-cols-[280px_1fr]' : 'grid-cols-1'}`}>
            <div>
              <div className="relative mb-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients…"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-400 bg-white" />
              </div>
              {filtered.map(p => (
                <div key={p.id} className={`card p-4 mb-2.5 cursor-pointer transition-all hover:-translate-y-0.5 ${sel?.id === p.id ? 'ring-2 ring-teal-500' : ''}`} onClick={() => setSel(p)}>
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-700 to-teal-400 flex items-center justify-center text-white font-bold shrink-0">{p.name.charAt(0)}</div>
                    <div>
                      <p className={`font-bold text-sm ${sel?.id === p.id ? 'text-teal-700' : ''}`}>{p.name}</p>
                      <p className="text-xs text-gray-400">Age {p.age} · {p.diagnosis}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sel && (
              <div className="flex flex-col gap-4">
                <div className="card p-5">
                  <div className="flex gap-4 items-center mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-700 to-teal-400 flex items-center justify-center text-white font-extrabold text-2xl shrink-0">{sel.name.charAt(0)}</div>
                    <div className="flex-1">
                      <p className="font-extrabold text-lg">{sel.name}</p>
                      <p className="text-gray-400 text-sm">ID: {sel.id} · Age {sel.age} · Blood {sel.blood}</p>
                      <p className="text-gray-400 text-sm">📞 {sel.phone}</p>
                    </div>
                    <button onClick={() => setSel(null)} className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">✕ Close</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[['Last Visit', sel.lastVisit], ['Diagnosis', sel.diagnosis], ['Blood Group', sel.blood], ['Age', sel.age + ' years']].map(([l,v]) => (
                      <div key={l} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">{l}</p>
                        <p className="font-semibold text-sm mt-0.5">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card p-5">
                  <h3 className="font-bold text-sm mb-3">Prescriptions</h3>
                  {prescriptions.map(p => (
                    <div key={p.id} className="p-3 border border-gray-100 rounded-xl mb-2 bg-gray-50">
                      <div className="flex justify-between"><p className="font-semibold text-sm">{p.diagnosis}</p><p className="text-xs text-gray-400">{p.date}</p></div>
                      <p className="text-xs text-gray-400 mt-1">{p.medicines.map(m => m.name).join(', ')}</p>
                    </div>
                  ))}
                </div>
                <div className="card p-5">
                  <h3 className="font-bold text-sm mb-3">Test Reports</h3>
                  {testReports.map(t => (
                    <div key={t.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl mb-2 bg-gray-50">
                      <div><p className="font-semibold text-sm">{t.testName}</p><p className="text-xs text-gray-400">{t.requestDate}</p></div>
                      <span className={`badge ${t.status === 'Completed' ? 'badge-success' : t.status === 'In Progress' ? 'badge-info' : 'badge-warning'}`}>{t.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

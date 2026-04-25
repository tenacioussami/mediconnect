import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'

const patients = [
  { id:'P001', name:'Farhan Hossain', age:25 },
  { id:'P002', name:'Rina Begum',     age:42 },
  { id:'P003', name:'Kamal Hossain',  age:55 },
]
const testCats = {
  'Blood Tests': ['Complete Blood Count (CBC)','Blood Glucose (Fasting)','HbA1c','Lipid Profile','Thyroid Function (TSH)','Liver Function (LFT)','Kidney Function (KFT)'],
  'Imaging':     ['X-Ray Chest','X-Ray Spine','Ultrasound Abdomen','Echocardiogram','MRI Brain','MRI Spine','CT Scan Head'],
  'Cardiac':     ['ECG','Stress Test (TMT)','Holter Monitor','Cardiac Enzymes'],
  'Urine & Stool': ['Urine R/E','Urine Culture','Stool R/E','Stool Culture'],
}
const existing = [
  { id:'TR001', patient:'Farhan Hossain', test:'CBC',       date:'2026-04-15', status:'Completed',   urgent:false },
  { id:'TR002', patient:'Farhan Hossain', test:'X-Ray',     date:'2026-04-16', status:'In Progress', urgent:true  },
  { id:'TR003', patient:'Rina Begum',     test:'Glucose',   date:'2026-04-16', status:'Pending',     urgent:false },
]

export default function RequestTest() {
  const [sel, setSel]   = useState(null)
  const [tests, setTests] = useState([])
  const [note, setNote] = useState('')
  const [urgent, setUrgent] = useState(false)
  const [done, setDone] = useState(false)

  const toggle = t => setTests(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])

  if (done) return (
    <div className="app-layout"><Sidebar />
      <div className="main-content"><Topbar title="Request Test" />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="card p-10 text-center max-w-sm w-full">
            <p className="text-5xl mb-4">🧪</p>
            <h2 className="text-xl font-extrabold mb-2">Test Request Sent!</h2>
            <p className="text-gray-400 text-sm mb-5">{tests.length} test(s) requested for <strong>{sel?.name}</strong>.</p>
            <button className="btn-primary w-full py-3" onClick={() => { setDone(false); setSel(null); setTests([]); setUrgent(false) }}>Request Another</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Request Medical Test" />
        <div className="p-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5">

            <div>
              <div className="card p-4 mb-4">
                <h3 className="font-bold text-sm mb-3">Select Patient</h3>
                {patients.map(p => (
                  <div key={p.id} onClick={() => setSel(p)}
                    className={`p-3 rounded-xl border cursor-pointer mb-2 transition-all ${sel?.id === p.id ? 'bg-teal-50 border-teal-400' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                    <p className={`font-semibold text-sm ${sel?.id === p.id ? 'text-teal-700' : 'text-gray-800'}`}>{p.name}</p>
                    <p className="text-xs text-gray-400">Age {p.age}</p>
                  </div>
                ))}
              </div>
              {tests.length > 0 && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-teal-700 mb-2">Selected ({tests.length})</p>
                  {tests.map(t => (
                    <div key={t} className="flex justify-between items-center text-xs mb-1.5">
                      <span>🧪 {t}</span>
                      <button onClick={() => toggle(t)} className="text-red-400 hover:text-red-600 border-0 bg-transparent cursor-pointer">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-5">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <h3 className="font-bold text-sm">Select Tests</h3>
                <label className={`flex items-center gap-2 text-sm font-semibold cursor-pointer ${urgent ? 'text-red-500' : 'text-gray-400'}`}>
                  <input type="checkbox" checked={urgent} onChange={e => setUrgent(e.target.checked)} /> ⚡ Mark as Urgent
                </label>
              </div>
              {Object.entries(testCats).map(([cat, items]) => (
                <div key={cat} className="mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{cat}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map(t => (
                      <button key={t} onClick={() => toggle(t)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${tests.includes(t) ? 'bg-teal-600 text-white border-teal-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-teal-300'}`}>
                        {tests.includes(t) ? '✓ ' : ''}{t}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="form-group mt-2">
                <label>Notes for Lab</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Clinical notes or special instructions…" className="resize-y" />
              </div>
              <button className="btn-primary py-3 px-6 text-sm" onClick={() => { if (!sel || !tests.length) { alert('Select patient and at least one test.'); return } setDone(true) }}>
                🧪 Send Test Request {tests.length > 0 ? `(${tests.length})` : ''}
              </button>
            </div>
          </div>

          <div className="card p-5 mt-5">
            <h3 className="font-bold text-sm mb-4">Recent Test Requests</h3>
            {existing.map(r => (
              <div key={r.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl mb-2 bg-gray-50">
                <div>
                  <p className="font-semibold text-sm">{r.test} {r.urgent && <span className="ml-2 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">⚡ Urgent</span>}</p>
                  <p className="text-xs text-gray-400">Patient: {r.patient} · {r.date}</p>
                </div>
                <span className={`badge ${r.status === 'Completed' ? 'badge-success' : r.status === 'In Progress' ? 'badge-info' : 'badge-warning'}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

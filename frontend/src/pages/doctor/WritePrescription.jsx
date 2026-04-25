import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'

const patients = [
  { id:'P001', name:'Farhan Hossain', age:25, blood:'B+' },
  { id:'P002', name:'Rina Begum',     age:42, blood:'A+' },
  { id:'P003', name:'Kamal Hossain',  age:55, blood:'O+' },
]
const commonMeds = ['Amlodipine 5mg','Losartan 50mg','Metformin 500mg','Atorvastatin 20mg','Omeprazole 20mg','Paracetamol 500mg','Amoxicillin 500mg','Cetirizine 10mg']

export default function WritePrescription() {
  const [patient, setPatient]   = useState(null)
  const [diagnosis, setDx]      = useState('')
  const [meds, setMeds]         = useState([{ name:'', dose:'', duration:'', instruction:'' }])
  const [note, setNote]         = useState('')
  const [followUp, setFollowUp] = useState('')
  const [saved, setSaved]       = useState(false)
  const [upload, setUpload]     = useState(false)

  const addMed    = () => setMeds(m => [...m, { name:'', dose:'', duration:'', instruction:'' }])
  const removeMed = i => setMeds(m => m.filter((_,idx) => idx !== i))
  const updateMed = (i, k, v) => setMeds(m => m.map((med, idx) => idx === i ? { ...med, [k]: v } : med))

  if (saved) return (
    <div className="app-layout"><Sidebar />
      <div className="main-content"><Topbar title="Write Prescription" />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="card p-10 text-center max-w-sm w-full">
            <p className="text-5xl mb-4">✅</p>
            <h2 className="text-xl font-extrabold mb-2">Prescription Saved!</h2>
            <p className="text-gray-400 text-sm mb-5">Available in <strong>{patient?.name}</strong>'s profile now.</p>
            <div className="flex gap-3">
              <button className="btn-outline flex-1 py-2.5 text-sm" onClick={() => { setSaved(false); setPatient(null); setDx(''); setMeds([{ name:'',dose:'',duration:'',instruction:'' }]); setNote(''); setFollowUp('') }}>New Rx</button>
              <button className="btn-primary flex-1 py-2.5 text-sm">📥 PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Write Prescription" />
        <div className="p-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">

            {/* Patient selector */}
            <div className="card p-5 self-start">
              <h3 className="font-bold text-sm mb-4">Select Patient</h3>
              {patients.map(p => (
                <div key={p.id} onClick={() => setPatient(p)}
                  className={`p-3 rounded-xl border cursor-pointer mb-2 transition-all ${patient?.id === p.id ? 'bg-teal-50 border-teal-400' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex gap-2.5 items-center">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-700 to-teal-400 flex items-center justify-center text-white font-bold shrink-0">{p.name.charAt(0)}</div>
                    <div>
                      <p className={`font-semibold text-sm ${patient?.id === p.id ? 'text-teal-700' : 'text-gray-800'}`}>{p.name}</p>
                      <p className="text-xs text-gray-400">Age {p.age} · Blood {p.blood}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Prescription Type</p>
                <div className="flex gap-2">
                  {['Digital','Upload'].map(m => (
                    <button key={m} onClick={() => setUpload(m === 'Upload')}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${(upload ? 'Upload' : 'Digital') === m ? 'bg-teal-50 border-teal-400 text-teal-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                      {m === 'Digital' ? '⌨️' : '📷'} {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Prescription form */}
            <div className="card p-6">
              <div className="flex justify-between items-start mb-5 pb-4 border-b-2 border-teal-600">
                <div>
                  <p className="font-extrabold text-teal-700 text-base">🩺 MediConnect — Digital Prescription</p>
                  {patient && <p className="text-xs text-gray-400 mt-1">Patient: <strong>{patient.name}</strong> · Age {patient.age}</p>}
                </div>
                <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-BD')}</p>
              </div>

              {upload ? (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
                  <p className="text-4xl mb-3">📷</p>
                  <p className="font-semibold mb-1">Upload Handwritten Prescription</p>
                  <p className="text-gray-400 text-sm mb-4">JPG, PNG or PDF (max 5MB)</p>
                  <input type="file" accept="image/*,.pdf" className="hidden" id="rxUpload" />
                  <label htmlFor="rxUpload" className="btn-primary py-2.5 px-6 cursor-pointer">Choose File</label>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Diagnosis / Chief Complaint *</label>
                    <input value={diagnosis} onChange={e => setDx(e.target.value)} placeholder="e.g. Hypertension Stage 1, Migraine" />
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                      <span className="font-serif italic text-teal-600 text-lg">℞</span> Medicines
                    </p>
                    <button onClick={addMed} className="text-xs text-teal-700 bg-teal-50 px-3 py-1 rounded-full font-semibold hover:bg-teal-100 transition-colors">+ Add Medicine</button>
                  </div>

                  {meds.map((m, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-100">
                      <div className="flex gap-2 mb-2">
                        <div className="flex-[2]">
                          <p className="text-xs text-gray-400 mb-1">Medicine Name</p>
                          <input list={`meds-${i}`} value={m.name} onChange={e => updateMed(i,'name',e.target.value)} placeholder="Medicine name"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-teal-400 bg-white font-sans" />
                          <datalist id={`meds-${i}`}>{commonMeds.map(med => <option key={med} value={med} />)}</datalist>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 mb-1">Dose</p>
                          <input value={m.dose} onChange={e => updateMed(i,'dose',e.target.value)} placeholder="1 tab daily"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-teal-400 bg-white font-sans" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 mb-1">Duration</p>
                          <input value={m.duration} onChange={e => updateMed(i,'duration',e.target.value)} placeholder="30 days"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-teal-400 bg-white font-sans" />
                        </div>
                        {meds.length > 1 && (
                          <button onClick={() => removeMed(i)} className="self-end w-8 h-8 rounded-lg bg-red-50 text-red-400 border-0 hover:bg-red-100 transition-colors text-sm shrink-0">✕</button>
                        )}
                      </div>
                      <input value={m.instruction} onChange={e => updateMed(i,'instruction',e.target.value)} placeholder="Special instructions (e.g. Take after meal)"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-teal-400 bg-white font-sans" />
                    </div>
                  ))}

                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3 mb-5">
                    <div className="form-group mb-0">
                      <label>Doctor's Note / Advice</label>
                      <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="e.g. Avoid salty food, rest well…" className="resize-y" />
                    </div>
                    <div className="form-group mb-0">
                      <label>Follow-up Date</label>
                      <input type="date" value={followUp} onChange={e => setFollowUp(e.target.value)} />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <button className="btn-outline flex-1 py-3 text-sm">👁 Preview</button>
                <button className="btn-primary flex-[2] py-3 text-sm" onClick={() => { if (!patient || !diagnosis) { alert('Select a patient and enter diagnosis.'); return } setSaved(true) }}>✅ Save Prescription</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

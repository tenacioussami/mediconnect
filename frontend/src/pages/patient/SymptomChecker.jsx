import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { symptomsAPI } from '../../services/api'
import { useNavigate } from 'react-router-dom';


const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_URL     = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-8b-instant'

const SYMPTOMS = [
  'Fever','Headache','Cough','Chest Pain','Shortness of Breath',
  'Fatigue','Nausea','Vomiting','Diarrhea','Abdominal Pain',
  'Back Pain','Joint Pain','Skin Rash','Dizziness','Sore Throat',
  'Runny Nose','Loss of Appetite','Weight Loss','Swelling','Blurred Vision'
]

const severityMap = {
  High:     { badge: 'bg-red-100 text-red-600',    icon: '🔴', ring: 'ring-red-400'   },
  Moderate: { badge: 'bg-amber-100 text-amber-700', icon: '🟡', ring: 'ring-amber-400' },
  Mild:     { badge: 'bg-green-100 text-green-700', icon: '🟢', ring: 'ring-green-400' },
}

export default function SymptomChecker() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('groq')

  // ── Groq State ──────────────────────────────────────────────────────────────
  const [form, setForm]             = useState({ symptoms:'', gender:'', duration:'', note:'' })
  const [analyzing, setAnalyzing]   = useState(false)
  const [groqResult, setGroqResult] = useState(null)
  const [groqError, setGroqError]   = useState('')

  // ── Django AI State ─────────────────────────────────────────────────────────
  const [selected, setSelected] = useState([])
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [aiError, setAiError]   = useState('')
  const [step, setStep]         = useState(1)

  const toggle = s => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
  const setF   = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // ── Call Groq API ───────────────────────────────────────────────────────────
  const analyzeWithGroq = async (e) => {
    e.preventDefault()
    if (!form.symptoms.trim()) { setGroqError('Please describe your symptoms.'); return }
    setAnalyzing(true); setGroqError(''); setGroqResult(null)

    const prompt = `You are a professional medical AI assistant for MediConnect, a telemedicine platform in Bangladesh.

A patient has described their symptoms. Analyze and provide a structured response.

Patient Details:
- Symptoms: ${form.symptoms}
- Gender: ${form.gender || 'Not specified'}
- Duration: ${form.duration || 'Not specified'}
- Additional Note: ${form.note || 'None'}

Respond in this exact format:

**Possible Condition:** [disease/condition name]
**Severity:** [Mild / Moderate / High]
**Recommended Specialist:** [type of doctor]
**Medical Advice:** [2-3 sentences of practical advice]
**Warning Signs:** [symptoms that need immediate attention]
**Home Remedies:** [simple home care tips]
**Disclaimer:** Always consult a qualified doctor for proper diagnosis and treatment.`

    try {
      const res = await fetch(GROQ_URL, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model:       GROQ_MODEL,
          messages:    [{ role: 'user', content: prompt }],
          temperature: 0.4,
          max_tokens:  1024,
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || 'Groq API error')
      }

      const data = await res.json()
      const text = data.choices?.[0]?.message?.content
      if (!text) throw new Error('No response from Groq')
      setGroqResult(text)

    } catch (err) {
      setGroqError(err.message || 'Failed to connect to Groq. Please try again.')
    } finally { setAnalyzing(false) }
  }

  // ── Django AI ───────────────────────────────────────────────────────────────
  const analyze = async () => {
    if (!selected.length) { setAiError('Select at least one symptom.'); return }
    setLoading(true); setAiError('')
    try {
      const data = await symptomsAPI.check(selected)
      setResult(data); setStep(2)
    } catch (err) { setAiError(err.message || 'Analysis failed.') }
    finally { setLoading(false) }
  }

  const sev = result ? (severityMap[result.severity] || severityMap.Mild) : null

  // ── Format response text ────────────────────────────────────────────────────
  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-extrabold text-gray-800 mt-4 mb-1 text-sm">{line.replace(/\*\*/g, '')}</p>
      }
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <p key={i} className="text-sm text-gray-700 leading-relaxed mb-1">
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-gray-900">{p}</strong> : p)}
          </p>
        )
      }
      return <p key={i} className="text-sm text-gray-700 leading-relaxed mb-1">{line}</p>
    })
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="AI Symptom Checker" />
        <div className="p-6 animate-fade-in">

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl p-6 mb-6 flex items-center gap-4">
            <span className="text-5xl">⚡</span>
            <div>
              <h2 className="text-white font-extrabold text-lg">Smart Symptom Analyzer</h2>
              <p className="text-white/80 text-sm mt-1">Powered by Groq + Llama 3 AI · Fastest free AI · Results instantly on page</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => setActiveTab('groq')}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${activeTab === 'groq' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white border-transparent' : 'bg-white text-gray-500 border-gray-200 hover:border-orange-300'}`}>
              ⚡AI Symptom Checker
            </button>
            <button onClick={() => setActiveTab('ai')}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${activeTab === 'ai' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-500 border-gray-200 hover:border-teal-300'}`}>
              🧠 Django AI Checker
            </button>
          </div>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* GROQ TAB                                                          */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'groq' && !groqResult && (
            <form onSubmit={analyzeWithGroq} className="card p-6">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-xl">⚡</div>
                <div>
                  <h3 className="font-bold text-sm">Groq AI Symptom Checker</h3>
                  <p className="text-gray-400 text-xs">Llama 3 · 100% Free · Super Fast · Results shown on this page</p>
                </div>
              </div>

              {/* Symptoms */}
              <div className="form-group">
                <label>Describe Your Symptoms *</label>
                <textarea value={form.symptoms} onChange={e => setF('symptoms', e.target.value)}
                  placeholder="e.g. I am suffering from fever, headache and body pain since 2 days..."
                  rows={3} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 resize-none transition-colors" />
              </div>

              {/* Gender & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label>Gender</label>
                  <select value={form.gender} onChange={e => setF('gender', e.target.value)}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <select value={form.duration} onChange={e => setF('duration', e.target.value)}>
                    <option value="">How long?</option>
                    <option>1 day</option>
                    <option>2-3 days</option>
                    <option>1 week</option>
                    <option>2+ weeks</option>
                    <option>More than a month</option>
                  </select>
                </div>
              </div>

              {/* Additional Note */}
              <div className="form-group">
                <label>Additional Note</label>
                <textarea value={form.note} onChange={e => setF('note', e.target.value)}
                  placeholder="Any other details — medical history, allergies, medications, age..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 resize-none transition-colors" />
              </div>

              {/* Info box */}
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span>⚡</span>
                  <strong className="text-sm text-orange-700">Powered by Groq + Llama 3 (Meta AI)</strong>
                </div>
                <p className="text-xs text-orange-600">100% Free · No quota issues · Fastest AI inference · Results in seconds</p>
              </div>

              {groqError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm mb-4">
                  ❌ {groqError}
                </div>
              )}

              <button type="submit" disabled={analyzing}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm">
                {analyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span>⏳</span> Llama 3 is analyzing your symptoms…
                  </span>
                ) : '⚡ Analyze with Groq AI'}
              </button>
            </form>
          )}

          {/* ── Groq Result ── */}
          {activeTab === 'groq' && groqResult && (
            <div>
              <div className="card p-6 mb-5 ring-2 ring-orange-400">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-xl">⚡</div>
                  <div>
                    <h3 className="font-extrabold text-base">Groq AI Analysis Result</h3>
                    <p className="text-gray-400 text-xs">Llama 3 · {new Date().toLocaleString()}</p>
                  </div>
                </div>

                {/* Patient input summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Your Input</p>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex gap-2"><span className="text-gray-400 w-20 shrink-0">Symptoms:</span><strong>{form.symptoms}</strong></div>
                    {form.gender   && <div className="flex gap-2"><span className="text-gray-400 w-20 shrink-0">Gender:</span><strong>{form.gender}</strong></div>}
                    {form.duration && <div className="flex gap-2"><span className="text-gray-400 w-20 shrink-0">Duration:</span><strong>{form.duration}</strong></div>}
                    {form.note     && <div className="flex gap-2"><span className="text-gray-400 w-20 shrink-0">Note:</span><strong>{form.note}</strong></div>}
                  </div>
                </div>

                {/* AI Response */}
                <div className="bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 rounded-xl p-5">
                  <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span>⚡</span> Llama 3 AI Response
                  </p>
                  <div>{formatText(groqResult)}</div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4 text-xs text-amber-700">
                  ⚠️ <strong>Medical Disclaimer:</strong> This AI analysis is for informational purposes only. Always consult a qualified doctor for proper diagnosis and treatment.
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setGroqResult(null); setForm({ symptoms:'', gender:'', duration:'', note:'' }) }}
                  className="btn-outline flex-1 py-3 text-sm">← Check Again</button>
                <button onClick={() => navigate('/patient/book')} className="btn-primary flex-[2] py-3 text-sm">📅 Book Appointment</button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* DJANGO AI TAB                                                     */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'ai' && step === 1 && (
            <div>
              <div className="card p-6 mb-4">
                <h3 className="font-bold mb-1">Select Your Symptoms</h3>
                <p className="text-gray-400 text-sm mb-5">Tap all symptoms that apply to you.</p>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOMS.map(s => (
                    <button key={s} onClick={() => toggle(s)}
                      className={`px-4 py-1.5 rounded-full text-sm border transition-all ${selected.includes(s) ? 'bg-teal-600 text-white border-teal-600 font-semibold' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-teal-300'}`}>
                      {selected.includes(s) ? '✓ ' : ''}{s}
                    </button>
                  ))}
                </div>
              </div>
              {selected.length > 0 && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-teal-700 mb-2 uppercase tracking-wide">Selected ({selected.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.map(s => <span key={s} className="bg-teal-600 text-white text-xs px-3 py-0.5 rounded-full">{s}</span>)}
                  </div>
                </div>
              )}
              {aiError && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-600 text-sm mb-4">{aiError}</div>}
              <button onClick={analyze} disabled={loading || !selected.length}
                className={`btn-primary py-3 px-8 text-sm rounded-xl ${!selected.length ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {loading ? '⏳ Analyzing…' : '🔍 Analyze Symptoms'}
              </button>
            </div>
          )}

          {activeTab === 'ai' && step === 2 && result && (
            <div>
              <div className={`card p-6 mb-5 ring-2 ${(severityMap[result.severity] || severityMap.Mild).ring}`}>
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">AI Diagnosis</p>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-3">{result.disease}</h2>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${sev?.badge}`}>
                      {sev?.icon} {result.severity} Severity
                    </span>
                  </div>
                  <div className="bg-teal-50 rounded-xl px-5 py-3 text-center">
                    <p className="text-xs text-gray-400">Recommended Specialist</p>
                    <p className="font-extrabold text-teal-700 text-lg mt-0.5">{result.specialist}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 mt-5">
                  <p className="font-semibold text-sm mb-1">💡 Medical Advice</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{result.advice}</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4 text-xs text-amber-700">
                  ⚠️ <strong>Disclaimer:</strong> This is an AI prediction, not a medical diagnosis.
                </div>
              </div>
              {result.recommended_doctors?.length > 0 && (
                <div className="card p-5 mb-5">
                  <h3 className="font-bold mb-4">Recommended Doctors</h3>
                  {result.recommended_doctors.map(d => (
                    <div key={d.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl mb-3 bg-gray-50">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-700 to-teal-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {d.full_name?.charAt(0) || 'D'}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{d.full_name}</p>
                        <p className="text-xs text-gray-400">{d.specialty} · {d.experience}</p>
                        <p className="text-xs mt-0.5">⭐ {d.rating} · <strong className="text-teal-700">৳{d.consultation_fee}</strong></p>
                      </div>
                      <button onClick={() => navigate('/patient/book')} className="btn-primary py-1.5 px-3 text-xs">Book</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <button className="btn-outline flex-1 py-3" onClick={() => { setStep(1); setResult(null); setSelected([]) }}>← Check Again</button>
                <button className="btn-primary flex-[2] py-3" onClick={() => navigate('/patient/book')}>📅 Book Appointment</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

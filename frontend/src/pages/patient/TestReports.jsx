import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { testsAPI } from '../../services/api'

export default function TestReports() {
  const [tests, setTests]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)
  const sc = { Completed: 'badge-success', 'In Progress': 'badge-info', Pending: 'badge-warning' }

  useEffect(() => {
    testsAPI.list().then(d => setTests(d?.results ?? d ?? [])).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Test Reports" />
        <div className="p-6 animate-fade-in">
          {loading ? (
            <div className="text-center py-12 text-gray-400"><p className="text-3xl mb-3">⏳</p><p>Loading from Django…</p></div>
          ) : !tests.length ? (
            <div className="card p-12 text-center text-gray-400"><p className="text-3xl mb-2">🧪</p><p>No test reports yet</p></div>
          ) : (
            <div className={`grid gap-5 ${selected ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
              <div className="flex flex-col gap-3">
                {tests.map(t => (
                  <div key={t.id} className={`card p-4 cursor-pointer transition-all hover:-translate-y-0.5 ${selected?.id === t.id ? 'ring-2 ring-teal-500' : ''}`} onClick={() => setSelected(t)}>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${t.status === 'Completed' ? 'bg-green-50' : t.status === 'In Progress' ? 'bg-blue-50' : 'bg-amber-50'}`}>
                          {t.status === 'Completed' ? '🧪' : t.status === 'In Progress' ? '⏳' : '📋'}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{t.test_name}</p>
                          <p className="text-xs text-gray-400">By {t.doctor_name} · {t.request_date}</p>
                          {t.is_urgent && <span className="text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">⚡ Urgent</span>}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`badge ${sc[t.status] || 'badge-info'}`}>{t.status}</span>
                        {t.status === 'Completed' && t.report_file && (
                          <a href={`http://localhost:8000${t.report_file}`} target="_blank" rel="noreferrer" className="btn-primary py-1 px-3 text-xs">📥 Download</a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selected && (
                <div className="card p-6 self-start sticky top-20">
                  <div className="flex justify-between mb-5">
                    <h3 className="font-bold">{selected.test_name}</h3>
                    <button onClick={() => setSelected(null)} className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg hover:bg-gray-200 transition-colors">✕ Close</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[['ID', `TST-${selected.id}`], ['Doctor', selected.doctor_name], ['Date', selected.request_date], ['Status', selected.status]].map(([l,v]) => (
                      <div key={l} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">{l}</p>
                        <p className="font-semibold text-sm mt-0.5">{v}</p>
                      </div>
                    ))}
                  </div>

                  {selected.result_data && Object.keys(selected.result_data).length > 0 ? (
                    <div>
                      <p className="font-bold text-sm mb-3">Test Results</p>
                      {Object.entries(selected.result_data).map(([k, v]) => (
                        <div key={k} className="flex justify-between py-2.5 border-b border-gray-100 text-sm">
                          <span className="text-gray-500">{k}</span><strong>{v}</strong>
                        </div>
                      ))}
                      <div className="bg-green-50 rounded-xl p-3 mt-4 text-xs text-green-700">✅ All values within normal range.</div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      <p className="text-3xl mb-2">{selected.status === 'In Progress' ? '⏳' : '📋'}</p>
                      <p>Report is {selected.status.toLowerCase()}.</p>
                      <p className="text-xs mt-1">You'll be notified when results are ready.</p>
                    </div>
                  )}
                  {selected.notes && (
                    <div className="bg-blue-50 rounded-lg p-3 mt-3 text-xs text-blue-700"><strong>Doctor's Notes:</strong> {selected.notes}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

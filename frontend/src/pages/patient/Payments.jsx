import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'

const history = [
  { id:'TXN001', desc:'Consultation – Dr. Ayesha Rahman', date:'2026-04-18', amount:850,  method:'bKash', status:'Paid'    },
  { id:'TXN002', desc:'Consultation – Dr. Tanvir Ahmed',  date:'2026-04-10', amount:1050, method:'Card',  status:'Paid'    },
  { id:'TXN003', desc:'Consultation – Dr. Farida Begum', date:'2026-04-25', amount:750,  method:'Nagad', status:'Pending' },
]
const methods = [
  { id:'bkash',  label:'bKash',  icon:'📱', ring:'ring-pink-400',   bg:'bg-pink-50',   text:'text-pink-700'   },
  { id:'nagad',  label:'Nagad',  icon:'🟠', ring:'ring-orange-400', bg:'bg-orange-50', text:'text-orange-700' },
  { id:'rocket', label:'Rocket', icon:'🟣', ring:'ring-purple-400', bg:'bg-purple-50', text:'text-purple-700' },
  { id:'card',   label:'Card',   icon:'💳', ring:'ring-blue-400',   bg:'bg-blue-50',   text:'text-blue-700'   },
]

export default function Payments() {
  const [method, setMethod] = useState('bkash')
  const [paying, setPaying] = useState(false)
  const [paid, setPaid]     = useState(false)

  const paidTotal    = history.filter(t => t.status === 'Paid').reduce((s, t) => s + t.amount, 0)
  const pendingTotal = history.filter(t => t.status === 'Pending').reduce((s, t) => s + t.amount, 0)

  const handlePay = async () => {
    setPaying(true)
    await new Promise(r => setTimeout(r, 1800))
    setPaying(false); setPaid(true)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Payments" />
        <div className="p-6 animate-fade-in">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label:'Total Paid',   value:`৳${paidTotal.toLocaleString()}`,    icon:'✅', cls:'bg-green-50' },
              { label:'Pending',      value:`৳${pendingTotal.toLocaleString()}`,  icon:'⏳', cls:'bg-amber-50' },
              { label:'Transactions', value:history.length,                       icon:'🧾', cls:'bg-blue-50'  },
            ].map(c => (
              <div key={c.label} className="card p-4 flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl ${c.cls} flex items-center justify-center text-xl shrink-0`}>{c.icon}</div>
                <div>
                  <p className="text-xl font-extrabold leading-none">{c.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{c.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
            {/* History */}
            <div className="card p-5">
              <h3 className="font-bold text-sm mb-4">Transaction History</h3>
              {history.map(t => (
                <div key={t.id} className="flex justify-between items-center py-3.5 border-b border-gray-100">
                  <div className="flex gap-3 items-center">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${t.status === 'Paid' ? 'bg-green-50' : 'bg-amber-50'}`}>
                      {t.status === 'Paid' ? '✅' : '⏳'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.desc}</p>
                      <p className="text-xs text-gray-400">{t.date} · via {t.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${t.status === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>৳{t.amount}</p>
                    <span className={`badge mt-1 ${t.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>{t.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment panel */}
            <div className="card p-5 self-start">
              {paid ? (
                <div className="text-center py-8">
                  <p className="text-5xl mb-3">🎉</p>
                  <h3 className="font-extrabold text-lg mb-2">Payment Successful!</h3>
                  <p className="text-gray-400 text-sm mb-5">৳750 paid via {methods.find(m => m.id === method)?.label}</p>
                  <button className="btn-primary w-full py-3" onClick={() => setPaid(false)}>Done</button>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-sm mb-4">Pay Pending Bill</h3>
                  <div className="bg-gray-50 rounded-xl p-4 mb-5 text-sm">
                    <p className="text-gray-400 text-xs mb-2">Consultation – Dr. Farida Begum</p>
                    <div className="flex justify-between mb-1.5"><span className="text-gray-400">Consultation Fee</span><strong>৳700</strong></div>
                    <div className="flex justify-between mb-1.5"><span className="text-gray-400">Platform Fee</span><strong>৳50</strong></div>
                    <div className="flex justify-between border-t border-dashed border-gray-200 pt-2 mt-2">
                      <strong>Total Due</strong><strong className="text-teal-700 text-base">৳750</strong>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Payment Method (SSLCommerz)</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {methods.map(m => (
                      <button key={m.id} onClick={() => setMethod(m.id)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${method === m.id ? `${m.ring} ring-2 ${m.bg}` : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}>
                        <p className="text-2xl">{m.icon}</p>
                        <p className={`text-xs font-semibold mt-1 ${method === m.id ? m.text : 'text-gray-500'}`}>{m.label}</p>
                      </button>
                    ))}
                  </div>

                  {['bkash','nagad','rocket'].includes(method) && (
                    <div className="form-group mb-4">
                      <label>{methods.find(m => m.id === method)?.label} Number</label>
                      <input placeholder="017XXXXXXXX" />
                    </div>
                  )}
                  {method === 'card' && (
                    <div>
                      <div className="form-group"><label>Card Number</label><input placeholder="1234 5678 9012 3456" /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="form-group"><label>Expiry</label><input placeholder="MM/YY" /></div>
                        <div className="form-group"><label>CVV</label><input placeholder="123" /></div>
                      </div>
                    </div>
                  )}

                  <button className="btn-primary w-full py-3 text-sm" onClick={handlePay} disabled={paying}>
                    {paying ? '⏳ Processing…' : '💳 Pay ৳750 Now'}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-2">🔒 Secured by SSLCommerz · 256-bit encryption</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

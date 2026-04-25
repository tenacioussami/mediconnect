import React from 'react'
import { useNavigate } from 'react-router-dom'

const features = [
  { icon: '📹', title: 'Video Consultation',    desc: 'Consult doctors remotely from anywhere via HD video call.' },
  { icon: '🤖', title: 'AI Symptom Checker',    desc: 'Describe your symptoms and get instant disease predictions.' },
  { icon: '💊', title: 'Digital Prescriptions', desc: 'Receive and download prescriptions digitally after consultation.' },
  { icon: '🧪', title: 'Lab Test Requests',     desc: 'Doctors request tests; staff upload reports to your profile.' },
  { icon: '📅', title: 'Easy Scheduling',       desc: 'Book, reschedule or cancel appointments in one tap.' },
  { icon: '💳', title: 'SSLCommerz Payments',   desc: 'Secure online payment via bKash, Nagad, and all major cards.' },
]

const specialties = ['Cardiology','Neurology','Dermatology','Orthopedics','Pediatrics','General Medicine','ENT','Gynecology']

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-700 to-teal-400 rounded-xl flex items-center justify-center text-lg">🩺</div>
          <div>
            <p className="font-extrabold text-teal-700 text-base tracking-tight leading-none">ShasthoShongi</p>
            <p className="text-[11px] text-gray-400">Smart Telemedicine</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/login')} className="btn-outline py-2 px-4 text-sm">Login</button>
          <button onClick={() => navigate('/register')} className="btn-primary py-2 px-4 text-sm">Register</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 via-teal-600 to-teal-400 py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-3xl mx-auto text-center relative">
          <span className="inline-block bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/25 mb-5">🇧🇩 Made for Bangladesh</span>
          <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight mb-5">
            Instant healthcare <br /><em className="text-teal-200 not-italic">anytime, anywhere</em>
          </h1>
          <p className="text-white/85 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Smart Telemedicine for Bangladesh — consult certified doctors online or offline, check symptoms with AI, and manage all your health records in one place.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate('/register')}
              className="bg-white text-teal-700 font-bold px-7 py-3 rounded-xl shadow-lg hover:-translate-y-0.5 transition-transform text-sm">
              Get Started Free
            </button>
            <button onClick={() => navigate('/login')}
              className="bg-white/15 text-white font-semibold px-7 py-3 rounded-xl border-2 border-white/40 hover:bg-white/25 transition-colors text-sm">
              Sign In
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 justify-center mt-12 flex-wrap">
            {[['1,200+','Patients Served'],['42','Expert Doctors'],['98%','Satisfaction Rate'],['24/7','Available']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-extrabold text-white leading-none">{val}</p>
                <p className="text-white/70 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="bg-white border-b border-gray-200 py-10 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold mb-5 text-gray-900">Browse by Specialty</h2>
          <div className="flex gap-2.5 flex-wrap justify-center">
            {specialties.map(s => (
              <button key={s} onClick={() => navigate('/login')}
                className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium bg-gray-50 hover:bg-teal-50 hover:border-teal-400 hover:text-teal-700 transition-all">
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">Everything You Need</h2>
          <p className="text-center text-gray-500 mb-10 text-sm">Comprehensive healthcare at your convenience</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className="card p-5 flex gap-4 items-start hover:-translate-y-0.5 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-2xl shrink-0">{f.icon}</div>
                <div>
                  <p className="font-bold text-sm mb-1">{f.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-teal-900 to-teal-700 py-16 px-6 text-center">
        <h2 className="text-white text-2xl font-extrabold mb-3">Ready to Get Started?</h2>
        <p className="text-white/75 mb-8 text-sm">Join thousands of patients getting quality healthcare from home.</p>
        <button onClick={() => navigate('/register')}
          className="bg-teal-400 text-teal-900 font-extrabold px-8 py-3.5 rounded-xl text-sm hover:bg-teal-300 transition-colors">
          Create Free Account
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-5 text-center text-xs px-6">
        © 2026 MediConnect — Smart Telemedicine, Bangladesh | Developed by Farhan Hossain Sami · IUB (ID: 2310717)
      </footer>
    </div>
  )
}

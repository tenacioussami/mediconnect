// src/services/api.js
// All calls to the Django backend go through this file.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getToken   = ()        => localStorage.getItem('access_token')
export const setTokens  = (a, r)    => { localStorage.setItem('access_token', a); localStorage.setItem('refresh_token', r) }
export const clearTokens = ()       => { localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token') }
export const getRefresh  = ()       => localStorage.getItem('refresh_token')

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  // Auto-refresh expired access token
  if (res.status === 401 && getRefresh()) {
    const refreshRes = await fetch(`${BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: getRefresh() }),
    })
    if (refreshRes.ok) {
      const data = await refreshRes.json()
      setTokens(data.access, getRefresh())
      headers.Authorization = `Bearer ${data.access}`
      res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
    } else {
      clearTokens()
      window.location.href = '/login'
      return
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Network error' }))
    throw new Error(error.detail || JSON.stringify(error))
  }

  // 204 No Content
  if (res.status === 204) return null
  return res.json()
}

// ── Multipart upload (for test reports / prescription scans) ─────────────────
async function upload(path, formData) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Upload failed')
  }
  return res.json()
}

// ═══════════════════════════════════════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════════════════════════════════════
export const authAPI = {
  login: (credentials) =>
    request('/auth/login/', { method: 'POST', body: JSON.stringify(credentials) }),

  register: (data) =>
    request('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),

  me: () => request('/auth/me/'),

  refreshToken: (refresh) =>
    request('/token/refresh/', { method: 'POST', body: JSON.stringify({ refresh }) }),
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DOCTORS
// ═══════════════════════════════════════════════════════════════════════════════
export const doctorsAPI = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/doctors/${qs ? '?' + qs : ''}`)
  },
  detail: (id) => request(`/doctors/${id}/`),
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PATIENTS
// ═══════════════════════════════════════════════════════════════════════════════
export const patientsAPI = {
  list:   ()      => request('/patients/'),
  detail: (id)    => request(`/patients/${id}/`),
  update: (id, d) => request(`/patients/${id}/`, { method: 'PATCH', body: JSON.stringify(d) }),
}

// ═══════════════════════════════════════════════════════════════════════════════
//  APPOINTMENTS
// ═══════════════════════════════════════════════════════════════════════════════
export const appointmentsAPI = {
  list:   ()        => request('/appointments/'),
  detail: (id)      => request(`/appointments/${id}/`),
  create: (data)    => request('/appointments/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data)=> request(`/appointments/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  cancel: (id)      => request(`/appointments/${id}/`, { method: 'PATCH', body: JSON.stringify({ status: 'Cancelled' }) }),
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PRESCRIPTIONS
// ═══════════════════════════════════════════════════════════════════════════════
export const prescriptionsAPI = {
  list:   ()     => request('/prescriptions/'),
  detail: (id)   => request(`/prescriptions/${id}/`),
  create: (data) => request('/prescriptions/', { method: 'POST', body: JSON.stringify(data) }),
  uploadScan: (file) => {
    const fd = new FormData(); fd.append('upload_file', file); fd.append('is_uploaded', 'true')
    return upload('/prescriptions/', fd)
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MEDICAL TESTS
// ═══════════════════════════════════════════════════════════════════════════════
export const testsAPI = {
  list:         ()        => request('/tests/'),
  detail:       (id)      => request(`/tests/${id}/`),
  create:       (data)    => request('/tests/', { method: 'POST', body: JSON.stringify(data) }),
  update:       (id, data)=> request(`/tests/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  uploadReport: (id, file) => {
    const fd = new FormData(); fd.append('report_file', file)
    return upload(`/tests/${id}/upload/`, fd)
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PAYMENTS
// ═══════════════════════════════════════════════════════════════════════════════
export const paymentsAPI = {
  list:   ()     => request('/payments/'),
  create: (data) => request('/payments/', { method: 'POST', body: JSON.stringify(data) }),
}

// ═══════════════════════════════════════════════════════════════════════════════
//  NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════
export const notificationsAPI = {
  list:    ()  => request('/notifications/'),
  readAll: ()  => request('/notifications/read-all/', { method: 'POST' }),
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ADMIN STATS
// ═══════════════════════════════════════════════════════════════════════════════
export const adminAPI = {
  stats: () => request('/admin/stats/'),
}

// ═══════════════════════════════════════════════════════════════════════════════
//  AI SYMPTOM CHECKER
// ═══════════════════════════════════════════════════════════════════════════════
export const symptomsAPI = {
  check: (symptoms) => request(`/symptoms/check/?symptoms=${symptoms.join(',')}`),
}

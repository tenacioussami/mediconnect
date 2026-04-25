import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, setTokens, clearTokens, getToken } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Re-hydrate user from stored token on page refresh
  useEffect(() => {
    const restore = async () => {
      if (getToken()) {
        try {
          const me = await authAPI.me()
          setUser(me)
        } catch {
          clearTokens()
        }
      }
      setLoading(false)
    }
    restore()
  }, [])

  const login = async (identifier, password) => {
    const data = await authAPI.login({ username: identifier, email: identifier, password })
    setTokens(data.access, data.refresh)
    setUser(data.user)
    return data.user
  }

  const register = async (formData) => {
    const data = await authAPI.register(formData)
    setTokens(data.access, data.refresh)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    clearTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

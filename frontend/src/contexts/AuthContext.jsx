import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

function isTokenValid(userData) {
  if (!userData?.token) return false
  try {
    const payload = JSON.parse(atob(userData.token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('srpipa_user')
    if (!saved) return null
    try {
      const parsed = JSON.parse(saved)
      if (!isTokenValid(parsed)) {
        localStorage.removeItem('srpipa_token')
        localStorage.removeItem('srpipa_user')
        return null
      }
      return parsed
    } catch {
      localStorage.removeItem('srpipa_token')
      localStorage.removeItem('srpipa_user')
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && !isTokenValid(user)) {
      logout()
    }
  }, [user])

  const login = useCallback(async (username, password) => {
    setLoading(true)
    try {
      const res = await api.auth.login(username, password)
      const userData = { username: res.username, rol: res.rol, token: res.token }
      localStorage.setItem('srpipa_token', res.token)
      localStorage.setItem('srpipa_user', JSON.stringify(userData))
      setUser(userData)
      return userData
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('srpipa_token')
    localStorage.removeItem('srpipa_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

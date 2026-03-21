import { createContext, useContext, useState } from "react"
import { loginUser } from "../utils/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ─── Login ───────────────────────────────────────
  const login = (email, password) => {
    setLoading(true)
    setError(null)
    const result = loginUser(email, password)
    if (result.success) {
      setUser(result.user)
      setLoading(false)
      return true
    } else {
      setError(result.message)
      setLoading(false)
      return false
    }
  }

  // ─── Logout ──────────────────────────────────────
  const logout = () => {
    setUser(null)
  }

  // ─── Switch Role (for review demo only) ──────────
  // Remove this after backend is connected
  const switchRole = (role) => {
    setUser((prev) => ({ ...prev, role }))
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — teammates import this
export const useAuth = () => useContext(AuthContext)
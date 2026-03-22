import { createContext, useContext, useState, useEffect } from "react"
import { loginUser } from "../utils/api"
import { dummyUsers } from "../utils/dummyData"
const AuthContext = createContext()
const USER_KEY = "ch_user"
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const login = (email, password) => {
    setLoading(true)
    setError(null)
    const result = loginUser(email, password)
    if (result.success) {
      setUser(result.user)
      try { localStorage.setItem(USER_KEY, JSON.stringify(result.user)) } catch {
        console.log("Warning: Failed to save user to localStorage")
      }
      setLoading(false)
      return true
    } else {
      setError(result.message)
      setLoading(false)
      return false
    }
  }
  const logout = () => {
    setUser(null)
    try { localStorage.removeItem(USER_KEY) } catch {
      console.log("Warning: Failed to remove user from localStorage")
    }
  }
  const switchRole = (role) => {
    const matchingUser = dummyUsers.find((u) => u.role === role)
    if (matchingUser) {
      setUser(matchingUser)
      try { localStorage.setItem(USER_KEY, JSON.stringify(matchingUser)) } catch {
        console.log("Warning: Failed to save user to localStorage")
      }
    } else {
      setUser((prev) => {
        const updated = { ...prev, role }
        try { localStorage.setItem(USER_KEY, JSON.stringify(updated)) } catch {
          console.log("Warning: Failed to save user to localStorage")
        }
        return updated
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

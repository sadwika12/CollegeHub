import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth()

  // Not logged in → go to login page
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Logged in but wrong role → go back to dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  // All good → show the page
  return children
}

export default ProtectedRoute
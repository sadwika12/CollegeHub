import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const roleBadgeColor = (role) => {
  switch (role) {
    case 'admin':        return 'bg-purple-100 text-purple-800'
    case 'dean':         return 'bg-purple-100 text-purple-800'
    case 'hod':          return 'bg-teal-100 text-teal-800'
    case 'faculty':      return 'bg-teal-100 text-teal-800'
    case 'cell':         return 'bg-blue-100 text-blue-800'
    case 'organization': return 'bg-amber-100 text-amber-800'
    case 'student':      return 'bg-green-100 text-green-800'
    default:             return 'bg-gray-100 text-gray-800'
  }
}

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">

      {/* Left — College name */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">CH</span>
        </div>
        <span className="text-lg font-semibold text-gray-800">CollegeHub</span>
      </div>

      {/* Right — User info + logout */}
      {user && (
        <div className="flex items-center gap-4">

          {/* Notification bell */}
          <div className="relative cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Dummy notification count */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </div>

          {/* User name */}
          <span className="text-sm text-gray-700 font-medium">{user.name}</span>

          {/* Role badge */}
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleBadgeColor(user.role)}`}>
            {user.role.toUpperCase()}
          </span>

          {/* Department badge */}
          {user.department && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
              {user.department}
            </span>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition"
          >
            Logout
          </button>

        </div>
      )}
    </nav>
  )
}

export default Navbar
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import StudentFeed from "./StudentFeed"
import FacultyDashboard from './FacultyDashboard'
import HODDashboard from './HodDashboard'
import DeanDashboard from './DeanDashboard'
import OrgDashboard from './OrgDashboard'


const Dashboard = () => {
  const { user, switchRole } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  const roles = ['student', 'faculty', 'hod', 'dean', 'cell', 'organization', 'admin']

  const renderDashboard = () => {
    switch (user.role) {
      case 'student':      return <StudentFeed />
      case 'faculty':      return <FacultyDashboard />
      case 'hod':          return <HODDashboard />
      case 'dean':         return <DeanDashboard />
     // case 'cell':         return <CellDashboard />
      case 'organization': return <OrgDashboard />
      case 'admin':        return <Navigate to="/admin" replace />
      default:             return <div className="p-6">Unknown role</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar on top */}
      <Navbar />

      {/* Demo role switcher */}
      <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 flex items-center gap-3 text-sm">
        <span className="font-medium text-yellow-800">Demo — switch role:</span>
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => switchRole(role)}
            className={`px-3 py-1 rounded-full border text-xs font-medium
              ${user.role === role
                ? 'bg-yellow-500 text-white border-yellow-500'
                : 'bg-white text-yellow-700 border-yellow-400 hover:bg-yellow-50'
              }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Sidebar + main content */}
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {renderDashboard()}
        </main>
      </div>

    </div>
  )
}

export default Dashboard
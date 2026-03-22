import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import StudentFeed from "./StudentFeed"
import FacultyDashboard from './FacultyDashboard'
import HODDashboard from './HodDashboard'
import DeanDashboard from './DeanDashboard'
import OrgDashboard from './OrgDashboard'
import CellDashboard from './CellDashboard'

const Dashboard = () => {
  const { user, switchRole } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'Admin') return <Navigate to="/admin" replace />
  const roles = ['Student', 'Faculty', 'HOD', 'Dean', 'Cell', 'Organization', 'Admin']

  const renderDashboard = () => {
    switch (user.role) {
      case 'Student':      return <StudentFeed />
      case 'Faculty':      return <FacultyDashboard />
      case 'HOD':          return <HODDashboard />
      case 'Dean':         return <DeanDashboard />
      case 'Cell':         return <CellDashboard />
      case 'Organization': return <OrgDashboard />
      default:             return (
        <div className="p-6 text-center text-gray-500">
          <p className="text-lg font-medium">No dashboard for role: <strong>{user.role}</strong></p>
          <p className="text-sm mt-1">Please contact admin.</p>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#f5f3ff" }}>

      <Navbar />

    
      <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 flex items-center gap-3 text-sm flex-wrap">
        <span className="font-medium text-yellow-800">Demo — switch role:</span>
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => switchRole(role)}
            className={`px-3 py-1 rounded-full border text-xs font-medium transition capitalize
              ${user.role === role
                ? 'bg-yellow-500 text-white border-yellow-500'
                : 'bg-white text-yellow-700 border-yellow-400 hover:bg-yellow-50'
              }`}
          >
            {role}
          </button>
        ))}
      </div>

    
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


import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { getAllUsers, getPendingOrganizations, approveOrganization } from "../utils/api"
import { dummyDepartments } from "../utils/dummyData"

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

const AdminPanel = () => {
  const { user } = useAuth()

  // Block non-admins
  if (!user)                return <Navigate to="/login"     replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />

  const [activeTab, setActiveTab] = useState("users")
  const [users,     setUsers]     = useState(getAllUsers())
  const [orgs,      setOrgs]      = useState(getPendingOrganizations())

  const tabs = [
    { key: "users",       label: "All Users"       },
    { key: "orgs",        label: "Org Approvals"   },
    { key: "departments", label: "Departments"     },
  ]

  const handleApprove = (id) => {
    approveOrganization(id)
    setOrgs((prev) => prev.filter((o) => o._id !== id))
  }

  const handleReject = (id) => {
    setOrgs((prev) => prev.filter((o) => o._id !== id))
  }

  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u._id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">

          {/* Page heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage users, approve organizations and view departments
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition
                  ${activeTab === tab.key
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Tab 1: All Users ── */}
          {activeTab === "users" && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">All Users</h2>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {users.length} total
                </span>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Role</th>
                    <th className="px-6 py-3 text-left">Department</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-3 font-medium text-gray-800">{u.name}</td>
                      <td className="px-6 py-3 text-gray-500">{u.email}</td>
                      <td className="px-6 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleBadgeColor(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-500">
                        {u.department || "—"}
                      </td>
                      <td className="px-6 py-3">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Tab 2: Org Approvals ── */}
          {activeTab === "orgs" && (
            <div>
              {orgs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                  <p className="text-gray-400 text-sm">No pending organization requests</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orgs.map((org) => (
                    <div
                      key={org._id}
                      className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800">{org.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{org.description}</p>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mt-2 inline-block">
                          Pending approval
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(org._id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(org._id)}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Tab 3: Departments ── */}
          {activeTab === "departments" && (
            <div className="grid grid-cols-3 gap-4">
              {dummyDepartments.map((dept) => (
                <div
                  key={dept._id}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center mb-3">
                    <span className="text-teal-700 text-sm font-bold">{dept.code.toUpperCase().slice(0,2)}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{dept.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">Code: {dept.code}</p>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default AdminPanel
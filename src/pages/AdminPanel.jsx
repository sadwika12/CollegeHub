import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { getAllUsers, getPendingOrganizations, approveOrganization, rejectOrganization } from "../utils/api"
import { dummyDepartments } from "../utils/dummyData"
import { getAllPosts } from "../utils/postsStorage"
const roleBadgeColors = {
  Admin:        "background:#ede9fe;color:#6d28d9",
  Dean:         "background:#ede9fe;color:#6d28d9",
  HOD:          "background:#d1fae5;color:#065f46",
  Faculty:      "background:#dbeafe;color:#1d4ed8",
  Cell:         "background:#e0f2fe;color:#0369a1",
  Organization: "background:#fef3c7;color:#d97706",
  Student:      "background:#dcfce7;color:#16a34a",
}

const categoryColors = {
  exam:       { bg: "#fef3c7", text: "#d97706", dot: "#f59e0b" },
  event:      { bg: "#ede9fe", text: "#7c3aed", dot: "#8b5cf6" },
  academic:   { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
  assignment: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  general:    { bg: "#f3f4f6", text: "#374151", dot: "#6b7280" },
}

const AdminPanel = () => {
  const { user, switchRole } = useAuth()
  const navigate = useNavigate()

  if (!user)                 return <Navigate to="/login"     replace />
  if (user.role !== "Admin") return <Navigate to="/dashboard" replace />

  const [activeTab,   setActiveTab]   = useState("users")
  const [users,       setUsers]       = useState(getAllUsers())
  const [orgs,        setOrgs]        = useState(getPendingOrganizations())
  const [allPosts]                    = useState(getAllPosts())
  const [userSearch,  setUserSearch]  = useState("")
  const [postSearch,  setPostSearch]  = useState("")
  const [postFilter,  setPostFilter]  = useState("all")

  const roles = ["Student", "Faculty", "HOD", "Dean", "Cell", "Organization", "Admin"]

  const handleApprove    = (id) => { approveOrganization(id);  setOrgs((prev) => prev.filter((o) => o._id !== id)) }
  const handleReject     = (id) => { rejectOrganization(id);   setOrgs((prev) => prev.filter((o) => o._id !== id)) }
  const handleDeleteUser = (id) => { setUsers((prev) => prev.filter((u) => u._id !== id)) }

  const filteredUsers = users.filter((u) =>
    !userSearch.trim() ||
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  )

  const filteredPosts = allPosts
    .filter((p) => postFilter === "all" || p.category === postFilter)
    .filter((p) =>
      !postSearch.trim() ||
      p.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.postedBy?.name?.toLowerCase().includes(postSearch.toLowerCase())
    )

  const tabs = [
    { key: "users",  label: "👥 All Users",     badge: users.length     },
    { key: "orgs",   label: "🏢 Org Approvals", badge: orgs.length      },
    { key: "posts",  label: "📢 All Posts",      badge: allPosts.length  },
    { key: "depts",  label: "🏛️ Departments",    badge: null             },
  ]

  const inputStyle = {
    padding: "8px 14px", borderRadius: 9, border: "1.5px solid #ede9fe",
    fontSize: 13, color: "#3b0764", outline: "none", background: "#fff",
    fontFamily: "inherit", transition: "border-color .2s",
  }

  return (
    <div className="min-h-screen" style={{ background: "#f5f3ff" }}>
      <Navbar />
      <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 flex items-center gap-3 text-sm flex-wrap">
        <span className="font-medium text-yellow-800">Demo — switch role:</span>
        {roles.map((role) => (
          <button key={role}
            onClick={() => { switchRole(role); if (role !== "Admin") navigate("/dashboard") }}
            className={`px-3 py-1 rounded-full border text-xs font-medium transition
              ${user.role === role
                ? "bg-yellow-500 text-white border-yellow-500"
                : "bg-white text-yellow-700 border-yellow-400 hover:bg-yellow-50"}`}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#3b0764", margin: "0 0 4px" }}>
                🛡️ Admin Panel
              </h1>
              <p style={{ fontSize: 13, color: "#7c3aed", margin: 0 }}>
                Manage users, organisations, posts and departments
              </p>
            </div>
            <button onClick={() => navigate("/dashboard")} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 18px", borderRadius: 10,
              background: "#6d28d9", color: "#fff", border: "none",
              cursor: "pointer", fontWeight: 700, fontSize: 13,
              boxShadow: "0 2px 12px rgba(109,40,217,0.25)",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#5b21b6")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#6d28d9")}
            >
              🏠 Home
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Total Users",       value: users.length,           color: "#6d28d9", bg: "#ede9fe" },
              { label: "Pending Approvals", value: orgs.length,            color: "#d97706", bg: "#fef3c7" },
              { label: "Total Posts",       value: allPosts.length,        color: "#059669", bg: "#d1fae5" },
              { label: "Departments",       value: dummyDepartments.length,color: "#1d4ed8", bg: "#dbeafe" },
            ].map((s) => (
              <div key={s.label} style={{
                background: "#fff", border: "1px solid #ede9fe", borderRadius: 14,
                padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
                boxShadow: "0 2px 8px rgba(109,40,217,0.06)",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: s.bg, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, fontWeight: 900, color: s.color,
                }}>
                  {s.value}
                </div>
                <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, margin: 0 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <div style={{
            display: "flex", gap: 0, marginBottom: 24,
            background: "#fff", borderRadius: 12, border: "1px solid #ede9fe",
            padding: 4, width: "fit-content",
            boxShadow: "0 2px 8px rgba(109,40,217,0.06)",
          }}>
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                padding: "8px 16px", borderRadius: 9, fontSize: 13, fontWeight: 700,
                border: "none", cursor: "pointer", transition: "all .2s",
                background:  activeTab === tab.key ? "#6d28d9" : "transparent",
                color:       activeTab === tab.key ? "#fff"    : "#6b7280",
                display: "flex", alignItems: "center", gap: 7,
              }}>
                {tab.label}
                {tab.badge !== null && (
                  <span style={{
                    fontSize: 10, fontWeight: 900, padding: "2px 7px", borderRadius: 20,
                    background: activeTab === tab.key ? "rgba(255,255,255,0.25)" : "#ede9fe",
                    color:      activeTab === tab.key ? "#fff" : "#6d28d9",
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
          {activeTab === "users" && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <input
                  value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by name, email or role..."
                  style={{ ...inputStyle, width: 280 }}
                  onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                  onBlur={(e)  => (e.target.style.borderColor = "#ede9fe")}
                />
              </div>

              <div style={{
                background: "#fff", borderRadius: 16, border: "1px solid #ede9fe",
                overflow: "hidden", boxShadow: "0 2px 12px rgba(109,40,217,0.07)",
              }}>
                <div style={{
                  padding: "14px 24px", borderBottom: "1px solid #f3f0ff",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#3b0764", margin: 0 }}>All Users</h2>
                  <span style={{ fontSize: 11, color: "#7c3aed", background: "#ede9fe", padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>
                    {filteredUsers.length} shown
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead style={{ background: "#faf5ff" }}>
                      <tr>
                        {["Name", "Email", "Role", "Department", "Action"].map((h) => (
                          <th key={h} style={{
                            padding: "10px 20px", textAlign: "left",
                            fontSize: 11, fontWeight: 700, color: "#7c3aed",
                            textTransform: "uppercase", letterSpacing: ".06em",
                          }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u._id}
                          style={{ borderTop: "1px solid #f5f3ff", transition: "background .15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#faf5ff")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                        >
                          <td style={{ padding: "12px 20px", fontWeight: 700, color: "#3b0764" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{
                                width: 28, height: 28, borderRadius: "50%",
                                background: "#6d28d9", color: "#fff",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 11, fontWeight: 900, flexShrink: 0,
                              }}>
                                {u.name?.[0]?.toUpperCase()}
                              </div>
                              {u.name}
                            </div>
                          </td>
                          <td style={{ padding: "12px 20px", color: "#6b7280" }}>{u.email}</td>
                          <td style={{ padding: "12px 20px" }}>
                            <span style={{
                              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                              ...(roleBadgeColors[u.role]
                                ? Object.fromEntries(roleBadgeColors[u.role].split(";").filter(Boolean).map(s => s.split(":")))
                                : { background: "#f3f4f6", color: "#374151" }),
                            }}>
                              {u.role}
                            </span>
                          </td>
                          <td style={{ padding: "12px 20px", color: "#6b7280" }}>{u.department || "—"}</td>
                          <td style={{ padding: "12px 20px" }}>
                            {u.role !== "Admin" && (
                              <button onClick={() => handleDeleteUser(u._id)} style={{
                                fontSize: 12, color: "#ef4444", fontWeight: 600,
                                background: "none", border: "none", cursor: "pointer",
                                padding: "4px 10px", borderRadius: 6,
                              }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
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
              </div>
            </div>
          )}
          {activeTab === "orgs" && (
            <div>
              <p style={{ fontSize: 13, color: "#7c3aed", fontWeight: 600, marginBottom: 16 }}>
                {orgs.length > 0
                  ? `${orgs.length} organisation${orgs.length !== 1 ? "s" : ""} awaiting approval`
                  : "All organisations approved ✅"}
              </p>

              {orgs.length === 0 ? (
                <div style={{
                  background: "#fff", borderRadius: 16, border: "1px solid #ede9fe",
                  padding: "48px 24px", textAlign: "center",
                  boxShadow: "0 2px 12px rgba(109,40,217,0.07)",
                }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#6d28d9", margin: "0 0 6px" }}>
                    No pending approvals
                  </p>
                  <p style={{ fontSize: 13, color: "#a78bfa", margin: 0 }}>
                    All organisations have been reviewed.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {orgs.map((org) => (
                    <div key={org._id} style={{
                      background: "#fff", borderRadius: 16,
                      border: "1.5px solid #fde68a", padding: "20px 24px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      boxShadow: "0 4px 16px rgba(251,191,36,0.1)",
                      flexWrap: "wrap", gap: 16,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: "50%",
                          background: "#fef3c7", display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: 22, flexShrink: 0,
                        }}>
                          🏢
                        </div>
                        <div>
                          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#3b0764", margin: "0 0 4px" }}>
                            {org.name}
                          </h3>
                          <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 4px" }}>
                            {org.description}
                          </p>
                          {org.email && (
                            <p style={{ fontSize: 11, color: "#a78bfa", margin: "0 0 8px" }}>
                              📧 {org.email}
                            </p>
                          )}
                          <span style={{
                            fontSize: 11, background: "#fef3c7", color: "#d97706",
                            padding: "3px 10px", borderRadius: 20, fontWeight: 700,
                          }}>
                            ⏳ Pending approval
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => handleApprove(org._id)} style={{
                          padding: "9px 20px", background: "#6d28d9", color: "#fff",
                          border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700,
                          cursor: "pointer", boxShadow: "0 2px 8px rgba(109,40,217,0.3)",
                        }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#5b21b6")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "#6d28d9")}
                        >
                          ✅ Approve
                        </button>
                        <button onClick={() => handleReject(org._id)} style={{
                          padding: "9px 20px", background: "#fef2f2", color: "#ef4444",
                          border: "1px solid #fecaca", borderRadius: 10, fontSize: 13,
                          fontWeight: 700, cursor: "pointer",
                        }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "#fef2f2")}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "posts" && (
            <div>
              <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
                <input
                  value={postSearch} onChange={(e) => setPostSearch(e.target.value)}
                  placeholder="Search by title or poster..."
                  style={{ ...inputStyle, width: 240 }}
                  onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                  onBlur={(e)  => (e.target.style.borderColor = "#ede9fe")}
                />
                {["all","exam","event","academic","assignment","general"].map((cat) => (
                  <button key={cat} onClick={() => setPostFilter(cat)} style={{
                    padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                    border: "1.5px solid",
                    background:  postFilter === cat ? "#6d28d9" : "#fff",
                    color:       postFilter === cat ? "#fff"    : "#6b7280",
                    borderColor: postFilter === cat ? "#6d28d9" : "#e5e7eb",
                    cursor: "pointer", textTransform: "capitalize",
                  }}>
                    {cat}
                  </button>
                ))}
                <span style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600, marginLeft: "auto" }}>
                  {filteredPosts.length} posts
                </span>
              </div>

              {filteredPosts.length === 0 ? (
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ede9fe", padding: "48px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#6d28d9", margin: 0 }}>No posts found</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {filteredPosts.map((a) => {
                    const colors   = categoryColors[a.category] || categoryColors.general;
                    const roleCols = roleBadgeColors[a.postedBy?.role];
                    return (
                      <div key={a._id} style={{
                        background: "#fff", borderRadius: 14, border: "1px solid #ede9fe",
                        padding: "16px 20px", boxShadow: "0 2px 8px rgba(109,40,217,0.06)",
                        transition: "box-shadow .2s",
                      }}
                        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(109,40,217,0.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(109,40,217,0.06)")}
                      >
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8, alignItems: "center" }}>
                          <span style={{
                            fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20,
                            background: colors.bg, color: colors.text,
                            display: "inline-flex", alignItems: "center", gap: 4,
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: colors.dot }} />
                            {a.category}
                          </span>
                          {a.isImportant && (
                            <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: "#fef3c7", color: "#d97706" }}>
                              ⚠️ Important
                            </span>
                          )}
                          {a.department && (
                            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#ede9fe", color: "#7c3aed" }}>
                              {a.department}
                            </span>
                          )}
                        </div>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: "#3b0764", margin: "0 0 4px" }}>{a.title}</h3>
                        <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 10px", lineHeight: 1.5 }}>{a.content}</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #f5f3ff" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#6d28d9", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900 }}>
                              {a.postedBy?.name?.[0]}
                            </div>
                            <span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600 }}>{a.postedBy?.name}</span>
                            {roleCols && (
                              <span style={{
                                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                                ...Object.fromEntries(roleCols.split(";").filter(Boolean).map(s => s.split(":"))),
                              }}>
                                {a.postedBy?.role}
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: 11, color: "#c4b5fd" }}>{a.createdAt}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
          {activeTab === "depts" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
              {dummyDepartments.map((dept) => (
                <div key={dept._id} style={{
                  background: "#fff", borderRadius: 14, border: "1px solid #ede9fe",
                  padding: "20px", textAlign: "center",
                  boxShadow: "0 2px 8px rgba(109,40,217,0.06)",
                  transition: "box-shadow .2s, transform .2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(109,40,217,0.12)"; e.currentTarget.style.transform = "translateY(-2px)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(109,40,217,0.06)"; e.currentTarget.style.transform = "translateY(0)" }}
                >
                  <div style={{
                    width: 48, height: 48, background: "#ede9fe", borderRadius: 14,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 12px",
                  }}>
                    <span style={{ color: "#6d28d9", fontSize: 14, fontWeight: 900 }}>
                      {dept.code.toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: "#3b0764", margin: "0 0 4px" }}>
                    {dept.name}
                  </h3>
                  <p style={{ fontSize: 11, color: "#a78bfa", margin: 0 }}>
                    {dept.code}
                  </p>
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


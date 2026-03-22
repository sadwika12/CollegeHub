// import { dummyAnnouncements, dummyUsers } from "../utils/dummyData";

// const currentDean = dummyUsers.find(u => u.role === "Dean");

// export default function DeanDashboard() {
//   return (
//     <div style={{ padding: "30px", fontFamily: "Arial" }}>

//       {/* Header */}
//       <h1 style={{ color: "#1a1a2e" }}>🎓 Dean Dashboard</h1>
//       <p style={{ color: "#555" }}>
//         Welcome, <strong>{currentDean.name}</strong> — College Dean
//       </p>
//       <hr />

//       {/* Stats Row */}
//       <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
//         <div style={{
//           flex: 1, backgroundColor: "#4a90e2", color: "white",
//           borderRadius: "10px", padding: "20px", textAlign: "center"
//         }}>
//           <h2>{dummyAnnouncements.length}</h2>
//           <p>Total Announcements</p>
//         </div>
//         <div style={{
//           flex: 1, backgroundColor: "#27ae60", color: "white",
//           borderRadius: "10px", padding: "20px", textAlign: "center"
//         }}>
//           <h2>{dummyAnnouncements.filter(a => a.isImportant).length}</h2>
//           <p>Important</p>
//         </div>
//         <div style={{
//           flex: 1, backgroundColor: "#e67e22", color: "white",
//           borderRadius: "10px", padding: "20px", textAlign: "center"
//         }}>
//           <h2>{dummyAnnouncements.filter(a => a.targetAudience === "department").length}</h2>
//           <p>Department Specific</p>
//         </div>
//       </div>

//       {/* All Announcements */}
//       <h2 style={{ marginTop: "30px" }}>📢 All College Announcements</h2>

//       {dummyAnnouncements.map(a => (
//         <div key={a._id} style={{
//           border: "1px solid #ddd",
//           borderRadius: "10px",
//           padding: "15px",
//           marginBottom: "15px",
//           backgroundColor: a.isImportant ? "#fff8e1" : "#f9f9f9"
//         }}>
//           <h3 style={{ margin: "0 0 8px" }}>{a.title}</h3>
//           <p style={{ margin: "0 0 8px", color: "#444" }}>{a.content}</p>

//           <span style={{
//             backgroundColor: "#4a90e2",
//             color: "white",
//             padding: "3px 10px",
//             borderRadius: "20px",
//             fontSize: "12px"
//           }}>
//             {a.category}
//           </span>

//           {a.department && (
//             <span style={{
//               backgroundColor: "#8e44ad",
//               color: "white",
//               padding: "3px 10px",
//               borderRadius: "20px",
//               fontSize: "12px",
//               marginLeft: "8px"
//             }}>
//               {a.department}
//             </span>
//           )}

//           {a.isImportant && (
//             <span style={{
//               backgroundColor: "#e74c3c",
//               color: "white",
//               padding: "3px 10px",
//               borderRadius: "20px",
//               fontSize: "12px",
//               marginLeft: "8px"
//             }}>
//               ⚠️ Important
//             </span>
//           )}

//           <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
//             Posted by: {a.postedBy.name} | Date: {a.createdAt}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllPosts, getPostsByUser } from "../utils/postsStorage";

/**
 * PROBLEMS FIXED:
 *
 * 1. Used dummyUsers.find(u => u.role === "Dean") — hardcoded dummy user
 *    CAUSE:  Should use real logged-in user from AuthContext
 *    FIXED:  Replaced with useAuth()
 *
 * 2. Read only dummyAnnouncements — missed localStorage posts
 *    CAUSE:  Static array never includes new posts
 *    FIXED:  Uses getAllPosts() so faculty/org new posts appear in stats
 *            Uses getPostsByUser() for Dean's own posts
 *
 * 3. Dean's posts not visible to students
 *    CAUSE:  CreatePost already saves to localStorage with postedBy = user
 *            getAllPosts() in StudentFeed already merges this — so it works
 *            automatically once Dean posts via /create
 *    NOTE:   No extra wiring needed — postsStorage handles it
 *
 * 4. Plain white Arial page
 *    FIXED:  Full violet dream theme matching HOD/Faculty dashboards
 *
 * DEAN'S ROLE:
 * - See college-wide overview (all posts stats)
 * - Create and manage their own announcements (college-wide notices)
 * - View their own posts — these auto-appear in StudentFeed via postsStorage
 * - No approve/reject — Dean is top authority, doesn't need approval workflow
 */

const categoryColors = {
  exam:       { bg: "#fef3c7", text: "#d97706", dot: "#f59e0b" },
  event:      { bg: "#ede9fe", text: "#7c3aed", dot: "#8b5cf6" },
  academic:   { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
  assignment: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  general:    { bg: "#f3f4f6", text: "#374151", dot: "#6b7280" },
};

export default function DeanDashboard() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [myPosts,  setMyPosts]  = useState([]);
  const [allPosts, setAllPosts] = useState([]);

  // Load posts on mount
  useEffect(() => {
    if (!user?._id) return;
    setMyPosts(getPostsByUser(user._id));   // Dean's own posts
    setAllPosts(getAllPosts());              // All college posts for stats
  }, [user?._id]);

  // Stats from all posts
  const importantCount = allPosts.filter((a) => a.isImportant).length;
  const deptSpecific   = allPosts.filter((a) => a.targetAudience === "department").length;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f3ff", padding: "28px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ── Header card ── */}
        <div style={{
          background: "linear-gradient(135deg, #6d28d9, #7c3aed, #8b5cf6)",
          borderRadius: 20, padding: "28px",
          color: "#fff", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)", top: -60, right: -40 }} />
          <div style={{ position: "absolute", width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)", bottom: -20, right: 100 }} />
          <div style={{ position: "relative" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "0 0 4px", fontWeight: 500 }}>
              🎓 Dean Dashboard
            </p>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 4px", letterSpacing: -0.5 }}>
              Welcome, {user?.name}
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: "0 0 20px" }}>
              College Dean · Academic Affairs
            </p>
            {/* Stats */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Total Posts",   value: allPosts.length  },
                { label: "Important",     value: importantCount   },
                { label: "Dept Specific", value: deptSpecific     },
                { label: "My Posts",      value: myPosts.length   },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "rgba(255,255,255,0.15)", borderRadius: 12,
                  padding: "10px 18px", textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}>
                  <p style={{ fontSize: 18, fontWeight: 900, margin: 0, lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: 10, margin: "3px 0 0", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "➕ Create Announcement", path: "/create",    bg: "#6d28d9", color: "#fff"    },
            { label: "📋 All My Posts",        path: "/my-posts",  bg: "#fff",    color: "#6d28d9" },
            { label: "👤 Profile",             path: "/profile",   bg: "#fff",    color: "#6d28d9" },
          ].map((btn) => (
            <button key={btn.label} onClick={() => navigate(btn.path)} style={{
              padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
              background: btn.bg, color: btn.color,
              border: btn.bg === "#fff" ? "1.5px solid #ede9fe" : "none",
              cursor: "pointer", transition: "all .2s",
              boxShadow: btn.bg === "#6d28d9" ? "0 2px 12px rgba(109,40,217,0.3)" : "0 2px 8px rgba(109,40,217,0.07)",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* ── My Announcements ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 900, color: "#3b0764", margin: "0 0 4px" }}>
                📢 My Announcements
              </h2>
              <p style={{ fontSize: 12, color: "#a78bfa", margin: 0 }}>
                These are visible to all students in their feed
              </p>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "4px 12px",
              borderRadius: 20, background: "#ede9fe", color: "#6d28d9",
            }}>
              {myPosts.length} total
            </span>
          </div>

          {myPosts.length === 0 ? (
            <div style={{
              background: "#fff", borderRadius: 16, border: "1px solid #ede9fe",
              padding: "48px 24px", textAlign: "center",
              boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#6d28d9", margin: "0 0 6px" }}>
                No announcements yet
              </p>
              <p style={{ fontSize: 13, color: "#a78bfa", margin: "0 0 20px" }}>
                Create a college-wide announcement — it will appear in all students' feeds.
              </p>
              <button onClick={() => navigate("/create")} style={{
                padding: "10px 24px", background: "#6d28d9", color: "#fff",
                borderRadius: 10, fontWeight: 700, fontSize: 13,
                border: "none", cursor: "pointer",
              }}>
                Create Announcement
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {myPosts.map((a) => {
                const colors = categoryColors[a.category] || categoryColors.general;
                return (
                  <div key={a._id} style={{
                    background: "#fff", borderRadius: 16,
                    border: a.isImportant ? "1.5px solid #fbbf24" : "1px solid #ede9fe",
                    padding: "18px 20px",
                    boxShadow: a.isImportant
                      ? "0 4px 16px rgba(251,191,36,0.15)"
                      : "0 2px 12px rgba(109,40,217,0.06)",
                    transition: "box-shadow .2s, transform .2s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(109,40,217,0.13)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = a.isImportant ? "0 4px 16px rgba(251,191,36,0.15)" : "0 2px 12px rgba(109,40,217,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    {/* Badges */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10, alignItems: "center" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20,
                        background: colors.bg, color: colors.text,
                        display: "inline-flex", alignItems: "center", gap: 5,
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors.dot }} />
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
                      {a.targetAudience === "all" && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#dbeafe", color: "#1d4ed8" }}>
                          🌐 College Wide
                        </span>
                      )}
                      {a._id?.startsWith("p_") && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#d1fae5", color: "#065f46" }}>
                          ✨ New
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: "#3b0764", margin: "0 0 6px", lineHeight: 1.4 }}>
                      {a.title}
                    </h3>

                    {/* Content */}
                    <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 14px", lineHeight: 1.6 }}>
                      {a.content}
                    </p>

                    {/* Footer */}
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      paddingTop: 12, borderTop: "1px solid #f5f3ff",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: "50%",
                          background: "#6d28d9", color: "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 900,
                        }}>
                          {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600 }}>
                          {user?.name}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#ede9fe", color: "#6d28d9" }}>
                          Dean
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: "#c4b5fd" }}>
                        Posted on: {a.createdAt}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

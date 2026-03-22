// import { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { getAllPosts } from "../utils/postsStorage";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";

// /**
//  * WHAT:    /dept-posts — HOD sees all announcements for their department
//  * WHY:     HOD needs to view all faculty posts in their dept, not just their own
//  * HOW:     getAllPosts() merged list filtered by a.department === user.department
//  *          Approvals loaded from same localStorage key as HodDashboard
//  *          so approval state is consistent across both pages
//  */

// const categoryColors = {
//   exam:       { bg: "#fef3c7", text: "#d97706", dot: "#f59e0b" },
//   event:      { bg: "#ede9fe", text: "#7c3aed", dot: "#8b5cf6" },
//   academic:   { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
//   assignment: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
//   general:    { bg: "#f3f4f6", text: "#374151", dot: "#6b7280" },
// };

// const APPROVALS_KEY = (userId) => `ch_hod_approvals_${userId}`;

// export default function DeptPosts() {
//   const { user }  = useAuth();
//   const navigate  = useNavigate();
//   const [posts,       setPosts]       = useState([]);
//   const [approvedIds, setApprovedIds] = useState(new Set());
//   const [filter,      setFilter]      = useState("all"); // all | pending | approved

//   useEffect(() => {
//     if (!user?._id) return;
//     const all  = getAllPosts();
//     const dept = all.filter((a) => a.department === user.department);
//     setPosts(dept);
//     try {
//       const stored = localStorage.getItem(APPROVALS_KEY(user._id));
//       if (stored) setApprovedIds(new Set(JSON.parse(stored)));
//     } catch {}
//   }, [user?._id, user?.department]);

//   const handleApprove = (id) => {
//     setApprovedIds((prev) => {
//       const next = new Set(prev);
//       next.add(id);
//       try { localStorage.setItem(APPROVALS_KEY(user._id), JSON.stringify([...next])); } catch {}
//       return next;
//     });
//   };

//   const handleRevoke = (id) => {
//     setApprovedIds((prev) => {
//       const next = new Set(prev);
//       next.delete(id);
//       try { localStorage.setItem(APPROVALS_KEY(user._id), JSON.stringify([...next])); } catch {}
//       return next;
//     });
//   };

//   const displayed = posts.filter((a) => {
//     if (filter === "approved") return approvedIds.has(a._id);
//     if (filter === "pending")  return !approvedIds.has(a._id);
//     return true;
//   });

//   return (
//     <div style={{ minHeight: "100vh", background: "#f5f3ff" }}>
//       <Navbar />
//       <div style={{ display: "flex" }}>
//         <Sidebar />
//         <main style={{ flex: 1, padding: 28 }}>
//           <div style={{ maxWidth: 720 }}>

//             {/* Header */}
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
//               <div>
//                 <h1 style={{ fontSize: 22, fontWeight: 900, color: "#3b0764", margin: "0 0 4px" }}>
//                   📋 {user?.department} Department Posts
//                 </h1>
//                 <p style={{ fontSize: 13, color: "#7c3aed", margin: 0 }}>
//                   {posts.length} post{posts.length !== 1 ? "s" : ""} in your department
//                 </p>
//               </div>
//               <button onClick={() => navigate("/create")} style={{
//                 padding: "10px 20px", background: "#6d28d9", color: "#fff",
//                 borderRadius: 10, fontWeight: 700, fontSize: 13,
//                 border: "none", cursor: "pointer",
//                 boxShadow: "0 2px 12px rgba(109,40,217,0.3)",
//               }}>
//                 ➕ New Post
//               </button>
//             </div>

//             {/* Filter tabs */}
//             <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
//               {[
//                 { key: "all",      label: `All (${posts.length})`                              },
//                 { key: "pending",  label: `⏳ Pending (${posts.filter(a => !approvedIds.has(a._id)).length})`  },
//                 { key: "approved", label: `✅ Approved (${posts.filter(a => approvedIds.has(a._id)).length})` },
//               ].map((tab) => (
//                 <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
//                   padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700,
//                   border: "1.5px solid",
//                   background:  filter === tab.key ? "#6d28d9" : "#fff",
//                   color:       filter === tab.key ? "#fff"    : "#6b7280",
//                   borderColor: filter === tab.key ? "#6d28d9" : "#e5e7eb",
//                   cursor: "pointer", transition: "all .15s",
//                 }}>
//                   {tab.label}
//                 </button>
//               ))}
//             </div>

//             {/* Posts */}
//             {displayed.length === 0 ? (
//               <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ede9fe", padding: "48px 24px", textAlign: "center" }}>
//                 <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
//                 <p style={{ fontSize: 15, fontWeight: 700, color: "#6d28d9", margin: "0 0 6px" }}>No posts found</p>
//                 <p style={{ fontSize: 13, color: "#a78bfa", margin: 0 }}>No {filter === "all" ? "" : filter} posts for {user?.department}.</p>
//               </div>
//             ) : (
//               <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//                 {displayed.map((a) => {
//                   const colors     = categoryColors[a.category] || categoryColors.general;
//                   const isApproved = approvedIds.has(a._id);
//                   return (
//                     <div key={a._id} style={{
//                       background: isApproved ? "#f0fdf4" : "#fff", borderRadius: 16,
//                       border: isApproved ? "1.5px solid #86efac" : "1px solid #ede9fe",
//                       padding: "18px 20px",
//                       boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
//                       transition: "box-shadow .2s, transform .2s",
//                     }}
//                       onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(109,40,217,0.13)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
//                       onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(109,40,217,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
//                     >
//                       <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10, alignItems: "center" }}>
//                         <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: colors.bg, color: colors.text, display: "inline-flex", alignItems: "center", gap: 5 }}>
//                           <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors.dot }} />{a.category}
//                         </span>
//                         <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: isApproved ? "#d1fae5" : "#fef3c7", color: isApproved ? "#065f46" : "#d97706" }}>
//                           {isApproved ? "✅ Approved" : "⏳ Pending"}
//                         </span>
//                         {a.isImportant && <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: "#fef3c7", color: "#d97706" }}>⚠️ Important</span>}
//                       </div>
//                       <h3 style={{ fontSize: 15, fontWeight: 800, color: "#3b0764", margin: "0 0 6px" }}>{a.title}</h3>
//                       <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 14px", lineHeight: 1.6 }}>{a.content}</p>
//                       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f5f3ff", flexWrap: "wrap", gap: 10 }}>
//                         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                           <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#6d28d9", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>
//                             {a.postedBy?.name?.[0] ?? "?"}
//                           </div>
//                           <span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600 }}>{a.postedBy?.name}</span>
//                           <span style={{ fontSize: 11, color: "#c4b5fd" }}>· {a.createdAt}</span>
//                         </div>
//                         {isApproved ? (
//                           <button onClick={() => handleRevoke(a._id)} style={{ padding: "7px 16px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Revoke</button>
//                         ) : (
//                           <button onClick={() => handleApprove(a._id)} style={{ padding: "7px 16px", background: "#6d28d9", color: "#fff", border: "none", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(109,40,217,0.3)" }}>✅ Approve</button>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "../utils/postsStorage";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

/**
 * WHAT THIS PAGE DOES:
 * Shows two tabs:
 *   1. "Your Posts"  — only announcements posted by the logged-in HOD
 *   2. "All Posts"   — everything in the department (all roles, all categories)
 *
 * WHY NO APPROVE/REJECT HERE:
 * - This page is purely informational — shows what's happening in the dept
 * - Approve/reject belongs only in the Requests inbox (HodDashboard + /requests)
 * - Exams, assignments etc. are faculty's own responsibility — HOD just sees them
 *
 * HOW:
 * - getAllPosts() merges localStorage + dummyAnnouncements
 * - "Your Posts" filters by postedBy._id === user._id
 * - "All Posts"  filters by department === user.department (all roles)
 */

const categoryColors = {
  exam:       { bg: "#fef3c7", text: "#d97706", dot: "#f59e0b" },
  event:      { bg: "#ede9fe", text: "#7c3aed", dot: "#8b5cf6" },
  academic:   { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
  assignment: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  general:    { bg: "#f3f4f6", text: "#374151", dot: "#6b7280" },
};

const roleColors = {
  Faculty:      { bg: "#ede9fe", text: "#6d28d9" },
  HOD:          { bg: "#dbeafe", text: "#1d4ed8" },
  Student:      { bg: "#d1fae5", text: "#065f46" },
  Organization: { bg: "#fef3c7", text: "#d97706" },
  Dean:         { bg: "#f3f4f6", text: "#374151" },
};

const PostCard = ({ a, user }) => {
  const colors   = categoryColors[a.category] || categoryColors.general;
  const roleCols = roleColors[a.postedBy?.role] || roleColors.Dean;
  const isOwn    = a.postedBy?._id === user?._id;

  return (
    <div
      style={{
        background: "#fff", borderRadius: 16,
        border: isOwn ? "1.5px solid #c4b5fd" : "1px solid #ede9fe",
        padding: "18px 20px",
        boxShadow: isOwn
          ? "0 4px 16px rgba(109,40,217,0.1)"
          : "0 2px 12px rgba(109,40,217,0.06)",
        transition: "box-shadow .2s, transform .2s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(109,40,217,0.13)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = isOwn ? "0 4px 16px rgba(109,40,217,0.1)" : "0 2px 12px rgba(109,40,217,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
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
        {isOwn && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#6d28d9", color: "#fff" }}>
            ✏️ Your Post
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

      {/* Footer — poster info only, no action buttons */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: 12, borderTop: "1px solid #f5f3ff", flexWrap: "wrap", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "#6d28d9", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 900, flexShrink: 0,
          }}>
            {a.postedBy?.name?.[0] ?? "?"}
          </div>
          <span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600 }}>
            {a.postedBy?.name}
          </span>
          {/* Role badge next to name */}
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
            background: roleCols.bg, color: roleCols.text,
          }}>
            {a.postedBy?.role}
          </span>
        </div>
        <span style={{ fontSize: 11, color: "#c4b5fd", fontWeight: 500 }}>
          {a.createdAt}
        </span>
      </div>
    </div>
  );
};

export default function DeptPosts() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [tab,      setTab]   = useState("your");
  const [allPosts, setAllPosts] = useState([]);

  // Load merged posts on mount
  useEffect(() => {
    if (!user?._id) return;
    setAllPosts(getAllPosts());
  }, [user?._id]);

  // Your posts — only HOD's own
  const yourPosts = allPosts.filter((a) => a.postedBy?._id === user?._id);

  // All dept posts — everything where department matches OR posted by HOD themselves
  const deptPosts = allPosts.filter(
    (a) => a.department === user?.department || a.postedBy?._id === user?._id
  );

  const displayed = tab === "your" ? yourPosts : deptPosts;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f3ff" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 28 }}>
          <div style={{ maxWidth: 760 }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: "#3b0764", margin: "0 0 4px" }}>
                  📋 {user?.department} Posts
                </h1>
                <p style={{ fontSize: 13, color: "#7c3aed", margin: 0 }}>
                  Department activity — informational view
                </p>
              </div>
              <button onClick={() => navigate("/create")} style={{
                padding: "10px 20px", background: "#6d28d9", color: "#fff",
                borderRadius: 10, fontWeight: 700, fontSize: 13,
                border: "none", cursor: "pointer",
                boxShadow: "0 2px 12px rgba(109,40,217,0.3)",
              }}>
                ➕ New Announcement
              </button>
            </div>

            {/* Tab switcher */}
            <div style={{
              display: "flex", gap: 0, marginBottom: 24,
              background: "#fff", borderRadius: 12, border: "1px solid #ede9fe",
              padding: 4, width: "fit-content",
              boxShadow: "0 2px 8px rgba(109,40,217,0.06)",
            }}>
              {[
                { key: "your", label: `✏️ Your Posts`,          count: yourPosts.length },
                { key: "all",  label: `🏫 All Dept Posts`,       count: deptPosts.length },
              ].map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)} style={{
                  padding: "8px 20px", borderRadius: 9, fontSize: 13, fontWeight: 700,
                  border: "none", cursor: "pointer", transition: "all .2s",
                  background: tab === t.key ? "#6d28d9" : "transparent",
                  color:      tab === t.key ? "#fff"    : "#6b7280",
                  boxShadow:  tab === t.key ? "0 2px 8px rgba(109,40,217,0.25)" : "none",
                }}>
                  {t.label}
                  <span style={{
                    marginLeft: 7, fontSize: 10, fontWeight: 900,
                    padding: "2px 7px", borderRadius: 20,
                    background: tab === t.key ? "rgba(255,255,255,0.25)" : "#ede9fe",
                    color:      tab === t.key ? "#fff" : "#6d28d9",
                  }}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Info banner for All tab */}
            {tab === "all" && (
              <div style={{
                background: "#ede9fe", border: "1px solid #c4b5fd",
                borderRadius: 12, padding: "12px 16px", marginBottom: 20,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 16 }}>ℹ️</span>
                <p style={{ fontSize: 12, color: "#6d28d9", fontWeight: 600, margin: 0 }}>
                  This is an informational view of all {user?.department} department activity.
                  To approve/reject requests from faculty and students, go to the{" "}
                  <span
                    onClick={() => navigate("/dashboard")}
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    Requests Inbox
                  </span>.
                </p>
              </div>
            )}

            {/* Posts list */}
            {displayed.length === 0 ? (
              <div style={{
                background: "#fff", borderRadius: 16, border: "1px solid #ede9fe",
                padding: "48px 24px", textAlign: "center",
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#6d28d9", margin: "0 0 6px" }}>
                  {tab === "your" ? "You haven't posted anything yet" : "No department posts yet"}
                </p>
                <p style={{ fontSize: 13, color: "#a78bfa", margin: "0 0 20px" }}>
                  {tab === "your"
                    ? "Create an announcement for your department."
                    : `No announcements found for ${user?.department} department.`}
                </p>
                {tab === "your" && (
                  <button onClick={() => navigate("/create")} style={{
                    padding: "10px 24px", background: "#6d28d9", color: "#fff",
                    borderRadius: 10, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                  }}>
                    Create Announcement
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {displayed.map((a) => (
                  <PostCard key={a._id} a={a} user={user} />
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}


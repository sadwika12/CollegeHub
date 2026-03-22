import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllPosts } from "../utils/postsStorage";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
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
  Dean:         { bg: "#fef3c7", text: "#d97706" },
  Student:      { bg: "#d1fae5", text: "#065f46" },
  Organization: { bg: "#fce7f3", text: "#9d174d" },
  Cell:         { bg: "#f3f4f6", text: "#374151" },
};

export default function AllPosts() {
  const { user }   = useAuth();
  const [posts,    setPosts]    = useState([]);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    setPosts(getAllPosts());
  }, []);

  const filtered = posts
    .filter((a) => category === "all" || a.category === category)
    .filter((a) =>
      !search.trim() ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div style={{ minHeight: "100vh", background: "#f5f3ff" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 28 }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#3b0764", margin: "0 0 4px" }}>
                📢 All College Posts
              </h1>
              <p style={{ fontSize: 13, color: "#7c3aed", margin: 0 }}>
                {posts.length} total announcements · college-wide overview
              </p>
            </div>
            <div style={{
              background: "#fff", borderRadius: 12, border: "1px solid #ede9fe",
              padding: "4px 4px", display: "flex", alignItems: "center",
              boxShadow: "0 2px 8px rgba(109,40,217,0.06)", marginBottom: 16,
            }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "8px 14px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search all announcements..."
                  style={{ border: "none", outline: "none", fontSize: 13, color: "#3b0764", width: "100%", background: "transparent" }}
                />
                {search && (
                  <button onClick={() => setSearch("")} style={{ background: "#ede9fe", border: "none", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", color: "#7c3aed", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {[
                { key: "all",        label: "All"         },
                { key: "exam",       label: "Exams"       },
                { key: "event",      label: "Events"      },
                { key: "academic",   label: "Academic"    },
                { key: "assignment", label: "Assignments" },
                { key: "general",    label: "General"     },
              ].map((cat) => (
                <button key={cat.key} onClick={() => setCategory(cat.key)} style={{
                  padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  border: "1.5px solid",
                  background:  category === cat.key ? "#6d28d9" : "#fff",
                  color:       category === cat.key ? "#fff"    : "#6b7280",
                  borderColor: category === cat.key ? "#6d28d9" : "#e5e7eb",
                  cursor: "pointer", transition: "all .15s",
                }}>
                  {cat.label}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600, marginBottom: 16 }}>
              {filtered.length} announcement{filtered.length !== 1 ? "s" : ""} found
            </p>
            {filtered.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ede9fe", padding: "48px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#6d28d9", margin: 0 }}>No posts found</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {filtered.map((a) => {
                  const colors   = categoryColors[a.category] || categoryColors.general;
                  const roleCols = roleColors[a.postedBy?.role] || roleColors.Cell;
                  const isOwn    = a.postedBy?._id === user?._id;

                  return (
                    <div key={a._id} style={{
                      background: "#fff", borderRadius: 16,
                      border: isOwn ? "1.5px solid #c4b5fd" : a.isImportant ? "1.5px solid #fbbf24" : "1px solid #ede9fe",
                      padding: "18px 20px",
                      boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
                      transition: "box-shadow .2s, transform .2s",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(109,40,217,0.13)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(109,40,217,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10, alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: colors.bg, color: colors.text, display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors.dot }} />
                          {a.category}
                        </span>
                        {a.isImportant && (
                          <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: "#fef3c7", color: "#d97706" }}>⚠️ Important</span>
                        )}
                        {a.department && (
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#ede9fe", color: "#7c3aed" }}>{a.department}</span>
                        )}
                        {isOwn && (
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#6d28d9", color: "#fff" }}>✏️ Your Post</span>
                        )}
                      </div>

                      <h3 style={{ fontSize: 15, fontWeight: 800, color: "#3b0764", margin: "0 0 6px" }}>{a.title}</h3>
                      <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 14px", lineHeight: 1.6 }}>{a.content}</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f5f3ff", flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#6d28d9", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>
                            {a.postedBy?.name?.[0] ?? "?"}
                          </div>
                          <span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600 }}>{a.postedBy?.name}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: roleCols.bg, color: roleCols.text }}>
                            {a.postedBy?.role}
                          </span>
                        </div>
                        <span style={{ fontSize: 11, color: "#c4b5fd" }}>{a.createdAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

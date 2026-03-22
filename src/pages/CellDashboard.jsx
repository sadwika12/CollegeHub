import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllPosts, getPostsByUser } from "../utils/postsStorage";
import { dummyUsers } from "../utils/dummyData";
const CELL_INFO = {
  "Exam Cell":    { icon: "📝", color: "#d97706", bg: "#fef3c7", label: "Exam Cell"    },
  "CDP Cell":     { icon: "💼", color: "#065f46", bg: "#d1fae5", label: "CDP Cell"     },
  "Library Cell": { icon: "📚", color: "#1d4ed8", bg: "#dbeafe", label: "Library Cell" },
};


const DEFAULT_CELL = { icon: "🏛️", color: "#6d28d9", bg: "#ede9fe", label: "Cell" };

const categoryColors = {
  exam:       { bg: "#fef3c7", text: "#d97706", dot: "#f59e0b" },
  event:      { bg: "#ede9fe", text: "#7c3aed", dot: "#8b5cf6" },
  academic:   { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
  assignment: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  general:    { bg: "#f3f4f6", text: "#374151", dot: "#6b7280" },
};
const allCellUsers = Array.from(
  new Map(
    dummyUsers
      .filter((u) => u.role === "Cell" || u.role === "cell")
      .map((u) => [u._id, u])
  ).values()
);

export default function CellDashboard() {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [myPosts,   setMyPosts]   = useState([]);
  const [allPosts,  setAllPosts]  = useState([]);
  const cellInfo = CELL_INFO[user?.name] || DEFAULT_CELL;

  useEffect(() => {
    if (!user?._id) return;
    setMyPosts(getPostsByUser(user._id));
    setAllPosts(getAllPosts());
  }, [user?._id]);

  const importantCount = myPosts.filter((a) => a.isImportant).length;
  const getCellPostCount = (cellUserId) =>
    allPosts.filter((a) => a.postedBy?._id === cellUserId).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f3ff", padding: "28px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{
          background: "linear-gradient(135deg, #6d28d9, #7c3aed, #8b5cf6)",
          borderRadius: 20, padding: "28px",
          color: "#fff", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)", top: -60, right: -40 }} />
          <div style={{ position: "absolute", width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)", bottom: -20, right: 100 }} />
          <div style={{ position: "relative" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "0 0 4px", fontWeight: 500 }}>
              {cellInfo.icon} Cell Dashboard
            </p>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 4px", letterSpacing: -0.5 }}>
              Welcome, {user?.name}
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: "0 0 20px" }}>
              {cellInfo.label} · College Wide
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "My Posts",     value: myPosts.length       },
                { label: "Important",    value: importantCount        },
                { label: "Other Cells",  value: allCellUsers.length - 1 },
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
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 900, color: "#3b0764", margin: "0 0 14px" }}>
            🏛️ All Cells Overview
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {allCellUsers.map((c) => {
              const info    = CELL_INFO[c.name] || DEFAULT_CELL;
              const isMe    = c._id === user?._id;
              const count   = getCellPostCount(c._id);
              return (
                <div key={c._id} style={{
                  background: "#fff", borderRadius: 14, padding: "18px 14px",
                  border: isMe ? "1.5px solid #c4b5fd" : "1px solid #ede9fe",
                  textAlign: "center",
                  boxShadow: isMe
                    ? "0 4px 16px rgba(109,40,217,0.15)"
                    : "0 2px 8px rgba(109,40,217,0.06)",
                  transition: "transform .2s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: info.bg, margin: "0 auto 10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                  }}>
                    {info.icon}
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 800, color: "#3b0764", margin: "0 0 4px" }}>
                    {c.name}
                  </p>
                  <p style={{ fontSize: 11, color: "#a78bfa", margin: "0 0 8px" }}>
                    {count} post{count !== 1 ? "s" : ""}
                  </p>
                  {isMe && (
                    <span style={{
                      fontSize: 9, fontWeight: 900, padding: "3px 10px",
                      borderRadius: 20, background: "#6d28d9", color: "#fff",
                    }}>
                      ← You
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "➕ Create Post", path: "/create",   bg: "#6d28d9", color: "#fff"    },
            { label: "📋 My Posts",    path: "/my-posts", bg: "#fff",    color: "#6d28d9" },
            { label: "👤 Profile",     path: "/profile",  bg: "#fff",    color: "#6d28d9" },
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
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 900, color: "#3b0764", margin: "0 0 4px" }}>
                📢 My Announcements
              </h2>
              <p style={{ fontSize: 12, color: "#a78bfa", margin: 0 }}>
                Visible to all students in their feed
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
              <div style={{ fontSize: 40, marginBottom: 12 }}>{cellInfo.icon}</div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#6d28d9", margin: "0 0 6px" }}>
                No announcements yet
              </p>
              <p style={{ fontSize: 13, color: "#a78bfa", margin: "0 0 20px" }}>
                Create your first announcement — it will appear in all students' feeds.
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
                  >                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10, alignItems: "center" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20,
                        background: cellInfo.bg, color: cellInfo.color,
                        display: "inline-flex", alignItems: "center", gap: 5,
                      }}>
                        {cellInfo.icon} {cellInfo.label}
                      </span>
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
                      {a._id?.startsWith("p_") && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#d1fae5", color: "#065f46" }}>
                          ✨ New
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: "#3b0764", margin: "0 0 6px", lineHeight: 1.4 }}>
                      {a.title}
                    </h3>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 14px", lineHeight: 1.6 }}>
                      {a.content}
                    </p>
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
                          {user?.name?.[0]}
                        </div>
                        <span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600 }}>
                          {user?.name}
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

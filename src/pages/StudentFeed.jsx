
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllPosts } from "../utils/postsStorage";



const categoryColors = {
  exam:       { bg: "#fef3c7", text: "#d97706", dot: "#f59e0b" },
  event:      { bg: "#ede9fe", text: "#7c3aed", dot: "#8b5cf6" },
  academic:   { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
  assignment: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  general:    { bg: "#f3f4f6", text: "#374151", dot: "#6b7280" },
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const getBookmarkKey = (userId) => `ch_bookmarks_${userId}`;

export default function StudentFeed() {
  const { user } = useAuth();

  const [search,     setSearch]     = useState("");
  const [bookmarked, setBookmarked] = useState(new Set());
  const [filters,    setFilters]    = useState({
    category:   "all",
    department: "All",
    sort:       "newest",
  });

  
  useEffect(() => {
    if (!user?._id) return;
    try {
      const stored = localStorage.getItem(getBookmarkKey(user._id));
      if (stored) setBookmarked(new Set(JSON.parse(stored)));
    } catch {
      setBookmarked(new Set());
    }
  }, [user?._id]);

 
  const toggleBookmark = (id) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try {
        localStorage.setItem(getBookmarkKey(user._id), JSON.stringify([...next]));
      } catch {
        console.error("Failed to save bookmarks");
      }
      return next;
    });
  };

  
  const filtered = useMemo(() => {
    let result = getAllPosts(); 

    if (search.trim()) {
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.content.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filters.category !== "all") {
      result = result.filter((a) => a.category === filters.category);
    }
    if (filters.department !== "All") {
      result = result.filter(
        (a) => a.department === null || a.department === filters.department
      );
    }
    result.sort((a, b) =>
      filters.sort === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
    return result;
  }, [search, filters]);

  
  const allPosts       = getAllPosts();
  const importantCount = allPosts.filter((a) => a.isImportant).length;
  const todayCount     = allPosts.filter((a) => {
    return new Date(a.createdAt).toDateString() === new Date().toDateString();
  }).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f3ff" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px", display: "flex", flexDirection: "column", gap: 24 }}>

        
        <div style={{
          background: "linear-gradient(135deg, #6d28d9, #7c3aed, #8b5cf6)",
          borderRadius: 20, padding: "28px 28px 24px",
          color: "#fff", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)", top: -60, right: -40 }} />
          <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)", bottom: -30, right: 80 }} />
          <div style={{ position: "relative" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 4, fontWeight: 500 }}>
              {getGreeting()} 👋
            </p>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 4px", letterSpacing: -0.5 }}>
              {user?.name}
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0 }}>
              {user?.department ? `${user.department} · Student` : "College Wide · Student"}
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
              {[
                { label: "Total",     value: allPosts.length  },
                { label: "Important", value: importantCount   },
                { label: "Today",     value: todayCount       },
                { label: "Saved",     value: bookmarked.size  },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "rgba(255,255,255,0.15)", borderRadius: 12,
                  padding: "10px 16px", textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.2)", minWidth: 64,
                }}>
                  <p style={{ fontSize: 20, fontWeight: 900, margin: 0, lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: 10, margin: "3px 0 0", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

       
        <div style={{
          background: "#fff", borderRadius: 14, border: "1px solid #ede9fe",
          padding: "4px 4px", display: "flex", alignItems: "center",
          boxShadow: "0 2px 12px rgba(109,40,217,0.07)",
        }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements, events, exams..."
              style={{ border: "none", outline: "none", fontSize: 14, color: "#3b0764", width: "100%", background: "transparent" }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{
                background: "#ede9fe", border: "none", borderRadius: "50%",
                width: 20, height: 20, cursor: "pointer", color: "#7c3aed",
                fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>✕</button>
            )}
          </div>
          <button style={{
            background: "#6d28d9", color: "#fff", border: "none",
            borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>
            Search
          </button>
        </div>

        
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {[
            { key: "all",        label: "All"         },
            { key: "exam",       label: "Exams"       },
            { key: "event",      label: "Events"      },
            { key: "academic",   label: "Academic"    },
            { key: "assignment", label: "Assignments" },
            { key: "general",    label: "General"     },
          ].map((cat) => {
            const active = filters.category === cat.key;
            return (
              <button key={cat.key}
                onClick={() => setFilters((f) => ({ ...f, category: cat.key }))}
                style={{
                  padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                  border: "1.5px solid",
                  background:  active ? "#6d28d9" : "#fff",
                  color:       active ? "#fff"    : "#6b7280",
                  borderColor: active ? "#6d28d9" : "#e5e7eb",
                  cursor: "pointer", transition: "all .15s",
                  boxShadow: active ? "0 2px 10px rgba(109,40,217,0.25)" : "none",
                }}
              >
                {cat.label}
              </button>
            );
          })}
          <button
            onClick={() => setFilters((f) => ({ ...f, sort: f.sort === "newest" ? "oldest" : "newest" }))}
            style={{
              padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700,
              border: "1.5px solid #e5e7eb", background: "#fff", color: "#6b7280",
              cursor: "pointer", marginLeft: "auto", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 6h18M7 12h10M11 18h2"/>
            </svg>
            {filters.sort === "newest" ? "Newest first" : "Oldest first"}
          </button>
        </div>

    
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600, margin: 0 }}>
            {filtered.length} announcement{filtered.length !== 1 ? "s" : ""} found
          </p>
          {bookmarked.size > 0 && (
            <p style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600, margin: 0 }}>
              🔖 {bookmarked.size} saved
            </p>
          )}
        </div>

        
        {filtered.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((a) => {
              const colors  = categoryColors[a.category] || categoryColors.general;
              const isSaved = bookmarked.has(a._id);
              return (
                <div key={a._id}
                  style={{
                    background: "#fff", borderRadius: 16,
                    border: a.isImportant ? "1.5px solid #fbbf24" : "1px solid #ede9fe",
                    padding: "18px 20px",
                    boxShadow: a.isImportant ? "0 4px 16px rgba(251,191,36,0.15)" : "0 2px 12px rgba(109,40,217,0.06)",
                    transition: "box-shadow .2s, transform .2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(109,40,217,0.13)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = a.isImportant ? "0 4px 16px rgba(251,191,36,0.15)" : "0 2px 12px rgba(109,40,217,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
               
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
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
                      
                      {a._id?.startsWith("p_") && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#d1fae5", color: "#065f46" }}>
                          ✨ New
                        </span>
                      )}
                    </div>

                  
                    <button
                      onClick={() => toggleBookmark(a._id)}
                      title={isSaved ? "Remove bookmark" : "Save for later"}
                      style={{
                        background:  isSaved ? "#ede9fe" : "#f9fafb",
                        border: "1px solid",
                        borderColor: isSaved ? "#c4b5fd" : "#e5e7eb",
                        borderRadius: 8, width: 32, height: 32,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", fontSize: 14, flexShrink: 0, transition: "all .15s",
                      }}
                    >
                      {isSaved ? "🔖" : "🏷️"}
                    </button>
                  </div>

                
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#3b0764", margin: "0 0 6px", lineHeight: 1.4 }}>
                    {a.title}
                  </h3>

                  <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 14px", lineHeight: 1.6 }}>
                    {a.content}
                  </p>

                  
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f5f3ff" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%",
                        background: "#6d28d9", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 900, flexShrink: 0,
                      }}>
                        {a.postedBy?.name?.[0] ?? "?"}
                      </div>
                      <span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600 }}>{a.postedBy?.name}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "#c4b5fd", fontWeight: 500 }}>{a.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "64px 24px", background: "#fff", borderRadius: 20, border: "1px solid #ede9fe" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#6d28d9", margin: "0 0 6px" }}>No announcements found</p>
            <p style={{ fontSize: 13, color: "#a78bfa", margin: 0 }}>Try changing your filters or search term</p>
          </div>
        )}

      </div>
    </div>
  );
}


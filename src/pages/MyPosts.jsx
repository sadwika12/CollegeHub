import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getPostsByUser, deletePost } from "../utils/Postsstorage";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";



const categoryColors = {
  exam:       { bg: "#fef3c7", text: "#d97706", dot: "#f59e0b" },
  event:      { bg: "#ede9fe", text: "#7c3aed", dot: "#8b5cf6" },
  academic:   { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
  assignment: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  general:    { bg: "#f3f4f6", text: "#374151", dot: "#6b7280" },
};

export default function MyPosts() {
  const { user }   = useAuth();
  const navigate   = useNavigate();

 
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user?._id) {
      setPosts(getPostsByUser(user._id));
    }
  }, [user?._id]);

  const handleDelete = (postId) => {
   
    deletePost(postId);
 
    setPosts(getPostsByUser(user._id));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f3ff" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 28 }}>

          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#3b0764", margin: "0 0 4px" }}>
                📋 My Posts
              </h1>
              <p style={{ fontSize: 13, color: "#7c3aed", margin: 0 }}>
                {posts.length} announcement{posts.length !== 1 ? "s" : ""} posted by you
              </p>
            </div>
            <button
              onClick={() => navigate("/create")}
              style={{
                padding: "10px 20px", background: "#6d28d9", color: "#fff",
                borderRadius: 10, fontWeight: 700, fontSize: 13,
                border: "none", cursor: "pointer",
                boxShadow: "0 2px 12px rgba(109,40,217,0.3)",
              }}
            >
              ➕ New Post
            </button>
          </div>

         
          {posts.length === 0 ? (
            <div style={{
              background: "#fff", borderRadius: 16, border: "1px solid #ede9fe",
              padding: "48px 24px", textAlign: "center",
              boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#6d28d9", margin: "0 0 6px" }}>
                No posts yet
              </p>
              <p style={{ fontSize: 13, color: "#a78bfa", margin: "0 0 20px" }}>
                Start by creating your first announcement.
              </p>
              <button onClick={() => navigate("/create")} style={{
                padding: "10px 24px", background: "#6d28d9", color: "#fff",
                borderRadius: 10, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
              }}>
                Create Post
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 720 }}>
              {posts.map((a) => {
                const colors   = categoryColors[a.category] || categoryColors.general;
                
                const isDeletable = a._id?.startsWith("p_");

                return (
                  <div
                    key={a._id}
                    style={{
                      background: "#fff", borderRadius: 16,
                      border: a.isImportant ? "1.5px solid #fbbf24" : "1px solid #ede9fe",
                      padding: "18px 20px",
                      boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
                      transition: "box-shadow .2s, transform .2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(109,40,217,0.13)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(109,40,217,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
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
                        {isDeletable && (
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#d1fae5", color: "#065f46" }}>
                            ✨ New
                          </span>
                        )}
                      </div>

                      
                      {isDeletable && (
                        <button
                          onClick={() => handleDelete(a._id)}
                          title="Delete post"
                          style={{
                            background: "#fef2f2", border: "1px solid #fecaca",
                            borderRadius: 8, width: 32, height: 32,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", fontSize: 13, flexShrink: 0,
                            transition: "background .15s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "#fef2f2")}
                        >
                          🗑️
                        </button>
                      )}
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
                          fontSize: 11, fontWeight: 900,
                        }}>
                          {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600 }}>{user?.name}</span>
                      </div>
                      <span style={{ fontSize: 11, color: "#c4b5fd" }}>Posted on: {a.createdAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}



import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getPostsByUser } from "../utils/postsStorage";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const PROFILE_KEY = (userId) => `ch_profile_${userId}`;

const loadProfile = (userId) => {
  try {
    const stored = localStorage.getItem(PROFILE_KEY(userId));
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
};

const saveProfile = (userId, data) => {
  try { localStorage.setItem(PROFILE_KEY(userId), JSON.stringify(data)); } catch {
    console.error("Failed to save profile");
  }
};

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: "1.5px solid #ede9fe", fontSize: 13, color: "#3b0764",
  outline: "none", fontFamily: "inherit", background: "#fff",
  transition: "border-color .2s", boxSizing: "border-box",
};

export default function Profile() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [myPosts,   setMyPosts]   = useState([]);
  const [editMode,  setEditMode]  = useState(false);
  const [saved,     setSaved]     = useState(false);

 
  const [form, setForm] = useState(() => {
    const stored = loadProfile(user?._id);
    return {
      name:  stored?.name  || user?.name  || "",
      email: stored?.email || user?.email || "",
      bio:   stored?.bio   || "",
      phone: stored?.phone || "",
    };
  });

  const [tempForm, setTempForm] = useState({ ...form });

  useEffect(() => {
    if (user?._id) setMyPosts(getPostsByUser(user._id));
  }, [user?._id]);

  const handleEdit = () => {
    setTempForm({ ...form });
    setEditMode(true);
  };

  const handleCancel = () => {
    setTempForm({ ...form });
    setEditMode(false);
  };

  const handleSave = () => {
    setForm({ ...tempForm });
    saveProfile(user._id, tempForm);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (e) => {
    setTempForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const importantCount = myPosts.filter((a) => a.isImportant).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f3ff" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 28 }}>
          <div style={{ maxWidth: 620 }}>

           
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: "#3b0764", margin: "0 0 4px" }}>
                  👤 My Profile
                </h1>
                <p style={{ fontSize: 13, color: "#7c3aed", margin: 0 }}>
                  View and edit your profile details
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {saved && (
                  <span style={{ fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 20, background: "#d1fae5", color: "#065f46" }}>
                    ✅ Saved
                  </span>
                )}
                {!editMode ? (
                  <button onClick={handleEdit} style={{
                    padding: "9px 20px", background: "#6d28d9", color: "#fff",
                    border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13,
                    cursor: "pointer", boxShadow: "0 2px 12px rgba(109,40,217,0.3)",
                  }}>
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleSave} style={{
                      padding: "9px 20px", background: "#6d28d9", color: "#fff",
                      border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer",
                    }}>
                      💾 Save
                    </button>
                    <button onClick={handleCancel} style={{
                      padding: "9px 20px", background: "#fff", color: "#6d28d9",
                      border: "1.5px solid #ede9fe", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer",
                    }}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

         
            <div style={{
              background: "#fff", borderRadius: 20, border: "1px solid #ede9fe",
              padding: 28, marginBottom: 16,
              boxShadow: "0 2px 12px rgba(109,40,217,0.07)",
            }}>

            
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "linear-gradient(135deg, #6d28d9, #8b5cf6)",
                  color: "#fff", fontSize: 28, fontWeight: 900,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(109,40,217,0.3)", flexShrink: 0,
                }}>
                  {(editMode ? tempForm.name : form.name)?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: "#3b0764", margin: "0 0 4px" }}>
                    {editMode ? tempForm.name || "—" : form.name}
                  </h2>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#ede9fe", color: "#6d28d9", textTransform: "capitalize" }}>
                      {user?.role}
                    </span>
                    {user?.department && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#dbeafe", color: "#1d4ed8" }}>
                        {user.department}
                      </span>
                    )}
                  </div>
                </div>
              </div>

             
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

             
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Full Name
                  </label>
                  {editMode ? (
                    <input
                      name="name" value={tempForm.name} onChange={handleChange}
                      placeholder="Your full name"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                      onBlur={(e)  => (e.target.style.borderColor = "#ede9fe")}
                    />
                  ) : (
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#3b0764", margin: 0, padding: "10px 0" }}>
                      {form.name || "—"}
                    </p>
                  )}
                </div>

               
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Email Address
                  </label>
                  {editMode ? (
                    <input
                      name="email" type="email" value={tempForm.email} onChange={handleChange}
                      placeholder="your@email.com"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                      onBlur={(e)  => (e.target.style.borderColor = "#ede9fe")}
                    />
                  ) : (
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#3b0764", margin: 0, padding: "10px 0" }}>
                      {form.email || "—"}
                    </p>
                  )}
                </div>

               
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Phone Number
                  </label>
                  {editMode ? (
                    <input
                      name="phone" value={tempForm.phone} onChange={handleChange}
                      placeholder="+91 98765 43210"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                      onBlur={(e)  => (e.target.style.borderColor = "#ede9fe")}
                    />
                  ) : (
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#3b0764", margin: 0, padding: "10px 0" }}>
                      {form.phone || <span style={{ color: "#c4b5fd", fontStyle: "italic", fontWeight: 400 }}>Not added</span>}
                    </p>
                  )}
                </div>

           
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Bio
                  </label>
                  {editMode ? (
                    <textarea
                      name="bio" value={tempForm.bio} onChange={handleChange}
                      placeholder="Tell something about yourself..."
                      rows={3}
                      style={{ ...inputStyle, resize: "vertical" }}
                      onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                      onBlur={(e)  => (e.target.style.borderColor = "#ede9fe")}
                    />
                  ) : (
                    <p style={{ fontSize: 14, color: "#3b0764", margin: 0, padding: "10px 0", lineHeight: 1.6 }}>
                      {form.bio || <span style={{ color: "#c4b5fd", fontStyle: "italic", fontWeight: 400 }}>No bio added</span>}
                    </p>
                  )}
                </div>

              
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Role
                    </label>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#3b0764", margin: 0, padding: "10px 0", textTransform: "capitalize" }}>
                      {user?.role}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Department
                    </label>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#3b0764", margin: 0, padding: "10px 0" }}>
                      {user?.department || "College Wide"}
                    </p>
                  </div>
                </div>

                {editMode && (
                  <p style={{ fontSize: 11, color: "#c4b5fd", margin: "4px 0 0" }}>
                    Role and Department cannot be changed. Contact admin if needed.
                  </p>
                )}

              </div>
            </div>

           
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Total Posts",  value: myPosts.length,   icon: "📢" },
                { label: "Important",    value: importantCount,    icon: "⚠️" },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "#fff", borderRadius: 14, border: "1px solid #ede9fe",
                  padding: "18px 20px", display: "flex", alignItems: "center", gap: 14,
                  boxShadow: "0 2px 8px rgba(109,40,217,0.06)",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: "#ede9fe",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, flexShrink: 0,
                  }}>
                    {s.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 22, fontWeight: 900, color: "#6d28d9", margin: 0, lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: 12, color: "#a78bfa", margin: "3px 0 0", fontWeight: 600 }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

           
            {myPosts.length > 0 && (
              <div style={{
                background: "#fff", borderRadius: 20, border: "1px solid #ede9fe",
                padding: 24, boxShadow: "0 2px 12px rgba(109,40,217,0.07)",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 900, color: "#3b0764", margin: 0 }}>
                    📢 Recent Posts
                  </h2>
                  <button onClick={() => navigate("/my-posts")} style={{
                    fontSize: 12, fontWeight: 700, color: "#6d28d9",
                    background: "none", border: "none", cursor: "pointer",
                    textDecoration: "underline",
                  }}>
                    View all
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {myPosts.slice(0, 3).map((a) => (
                    <div key={a._id} style={{
                      padding: "12px 16px", borderRadius: 12,
                      background: "#f5f3ff", border: "1px solid #ede9fe",
                    }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#3b0764", margin: "0 0 4px" }}>{a.title}</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#ede9fe", color: "#6d28d9", textTransform: "capitalize" }}>
                          {a.category}
                        </span>
                        <span style={{ fontSize: 11, color: "#c4b5fd" }}>{a.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { dummyDepartments } from "../utils/dummyData";
import { savePost, saveDraft, loadDraft, clearDraft } from "../utils/postsStorage";
import { isOrgApproved } from "../utils/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";



const emptyForm = {
  title: "", content: "", category: "general",
  targetAudience: "all", department: "", isImportant: false,
};

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: "1.5px solid #ede9fe", fontSize: 13, color: "#3b0764",
  outline: "none", fontFamily: "inherit", background: "#fff",
  transition: "border-color .2s", boxSizing: "border-box",
};

export default function CreatePost() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

 
  const isOrgBlocked = user?.role === "Organization" && !isOrgApproved(user?.name);


  const [form, setForm] = useState(() => {
    const draft = loadDraft(user?._id);
    return draft || emptyForm;
  });

  
  useEffect(() => {
    if (user?._id) saveDraft(user._id, form);
  }, [form, user?._id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "targetAudience" && value !== "department" ? { department: "" } : {}),
    }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim())   { setError("Title is required");   return; }
    if (!form.content.trim()) { setError("Content is required"); return; }

    
    const newPost = {
      _id:            `p_${Date.now()}`,          
      title:          form.title.trim(),
      content:        form.content.trim(),
      category:       form.category,
      targetAudience: form.targetAudience,
      department:     form.targetAudience === "department" ? form.department : null,
      isImportant:    form.isImportant,
      createdAt:      new Date().toISOString().split("T")[0], 
      postedBy: {
        _id:  user._id,
        name: user.name,
        role: user.role,
      },
    };

   
    const saved = savePost(newPost);
    if (!saved) { setError("Failed to save post. Please try again."); return; }

   
    clearDraft(user._id);
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm(emptyForm);
    clearDraft(user?._id);
    setSubmitted(false);
    setError("");
  };

  if (isOrgBlocked) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f3ff" }}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <Sidebar />
          <main style={{ flex: 1, padding: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              background: "#fff", borderRadius: 20, border: "1px solid #fde68a",
              padding: "48px 32px", textAlign: "center", maxWidth: 420,
              boxShadow: "0 4px 20px rgba(251,191,36,0.15)",
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#92400e", margin: "0 0 8px" }}>
                Approval Pending
              </h2>
              <p style={{ fontSize: 13, color: "#b45309", margin: "0 0 8px" }}>
                <strong>{user?.name}</strong> is awaiting admin approval.
              </p>
              <p style={{ fontSize: 13, color: "#b45309", margin: "0 0 24px" }}>
                You can create posts once the admin approves your organisation. Please check back later.
              </p>
              <button onClick={() => navigate("/dashboard")} style={{
                padding: "10px 24px", background: "#6d28d9", color: "#fff",
                borderRadius: 10, fontWeight: 700, fontSize: 13,
                border: "none", cursor: "pointer",
              }}>
                Back to Dashboard
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f3ff" }}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <Sidebar />
          <main style={{ flex: 1, padding: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              background: "#fff", borderRadius: 20, border: "1px solid #ede9fe",
              padding: "48px 32px", textAlign: "center", maxWidth: 400,
              boxShadow: "0 4px 20px rgba(109,40,217,0.1)",
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#3b0764", margin: "0 0 8px" }}>
                Post Published!
              </h2>
              <p style={{ fontSize: 13, color: "#7c3aed", margin: "0 0 24px" }}>
                Your announcement is now visible to all relevant users.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={handleReset} style={{
                  padding: "10px 20px", background: "#6d28d9", color: "#fff",
                  borderRadius: 10, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                }}>
                  Post Another
                </button>
                <button onClick={() => navigate("/my-posts")} style={{
                  padding: "10px 20px", background: "#fff", color: "#6d28d9",
                  borderRadius: 10, fontWeight: 700, fontSize: 13,
                  border: "1.5px solid #ede9fe", cursor: "pointer",
                }}>
                  View My Posts
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

 
  return (
    <div style={{ minHeight: "100vh", background: "#f5f3ff" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 28 }}>
          <div style={{ maxWidth: 600 }}>

            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#3b0764", margin: "0 0 4px" }}>
                📝 Create Announcement
              </h1>
              <p style={{ fontSize: 13, color: "#7c3aed", margin: 0 }}>
                {form.title || form.content
                  ? "✏️ Draft auto-saved"
                  : "Fill in the details to post a new announcement"}
              </p>
            </div>

            <div style={{
              background: "#fff", borderRadius: 20, border: "1px solid #ede9fe",
              padding: 28, boxShadow: "0 2px 12px rgba(109,40,217,0.07)",
            }}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

             
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#6d28d9", display: "block", marginBottom: 6 }}>
                    Title *
                  </label>
                  <input
                    type="text" name="title" value={form.title} onChange={handleChange}
                    placeholder="Enter announcement title"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                    onBlur={(e)  => (e.target.style.borderColor = "#ede9fe")}
                  />
                </div>

           
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#6d28d9", display: "block", marginBottom: 6 }}>
                    Content *
                  </label>
                  <textarea
                    name="content" value={form.content} onChange={handleChange}
                    placeholder="Enter announcement details..."
                    rows={5}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                    onBlur={(e)  => (e.target.style.borderColor = "#ede9fe")}
                  />
                </div>

             
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#6d28d9", display: "block", marginBottom: 6 }}>
                    Category
                  </label>
                  <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                    <option value="general">General</option>
                    <option value="exam">Exam</option>
                    <option value="event">Event</option>
                    <option value="academic">Academic</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>

            
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#6d28d9", display: "block", marginBottom: 6 }}>
                    Target Audience
                  </label>
                  <select name="targetAudience" value={form.targetAudience} onChange={handleChange} style={inputStyle}>
                    <option value="all">All</option>
                    <option value="department">Department Only</option>
                  </select>
                </div>

               
                {form.targetAudience === "department" && (
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#6d28d9", display: "block", marginBottom: 6 }}>
                      Select Department
                    </label>
                    <select name="department" value={form.department} onChange={handleChange} style={inputStyle}>
                      <option value="">-- Select --</option>
                      {dummyDepartments.map((d) => (
                        <option key={d._id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                )}

          
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox" name="isImportant" checked={form.isImportant} onChange={handleChange}
                    style={{ width: 16, height: 16, accentColor: "#6d28d9" }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#3b0764" }}>
                    ⚠️ Mark as Important
                  </span>
                </label>
                {error && (
                  <div style={{
                    background: "#fef2f2", border: "1px solid #fecaca",
                    borderRadius: 10, padding: "10px 14px",
                    fontSize: 13, color: "#ef4444", fontWeight: 600,
                  }}>
                    {error}
                  </div>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1, padding: "12px", background: "#6d28d9", color: "#fff",
                      borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
                      boxShadow: "0 2px 12px rgba(109,40,217,0.3)", transition: "background .2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#5b21b6")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#6d28d9")}
                  >
                    📢 Publish Announcement
                  </button>
                  <button
                    type="button" onClick={handleReset}
                    style={{
                      padding: "12px 20px", background: "#fff", color: "#6d28d9",
                      borderRadius: 10, fontWeight: 700, fontSize: 13,
                      border: "1.5px solid #ede9fe", cursor: "pointer",
                    }}
                  >
                    Clear
                  </button>
                </div>

              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

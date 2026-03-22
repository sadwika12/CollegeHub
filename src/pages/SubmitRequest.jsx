import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { submitRequest, getRequestsByUser } from "../utils/requestsStorage";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";



const REQUEST_TYPES = [
  { value: "event",         label: "Event / Seminar"               },
  { value: "guest_lecture", label: "Guest Lecture"                 },
  { value: "dept_notice",   label: "Department Notice"             },
  { value: "field_trip",    label: "Field Trip / Industrial Visit" },
];

const STATUS_INFO = {
  pending:  { bg: "#fef3c7", text: "#d97706", label: "⏳ Pending"  },
  approved: { bg: "#d1fae5", text: "#065f46", label: "✅ Approved" },
  rejected: { bg: "#fee2e2", text: "#dc2626", label: "❌ Rejected" },
};

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: "1.5px solid #ede9fe", fontSize: 13, color: "#3b0764",
  outline: "none", fontFamily: "inherit", background: "#fff",
  transition: "border-color .2s", boxSizing: "border-box",
};

export default function SubmitRequest() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [submitted,   setSubmitted]   = useState(false);
  const [myRequests,  setMyRequests]  = useState([]);
  const [showForm,    setShowForm]    = useState(true);
  const [error,       setError]       = useState("");

  const emptyForm = { title: "", description: "", type: "event" };
  const [form, setForm] = useState(emptyForm);

  const loadMyRequests = () => {
    if (user?._id) setMyRequests(getRequestsByUser(user._id));
  };

  useEffect(() => { loadMyRequests(); }, [user?._id]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim())       { setError("Title is required");       return; }
    if (!form.description.trim()) { setError("Description is required"); return; }
    if (!user?.department)        { setError("Your account has no department assigned."); return; }

    submitRequest({
      title:       form.title.trim(),
      description: form.description.trim(),
      type:        form.type,
      department:  user.department,
      requestedBy: { _id: user._id, name: user.name, role: user.role },
    });

    setSubmitted(true);
    setForm(emptyForm);
    loadMyRequests();
  };

  const handleAnother = () => { setSubmitted(false); setShowForm(true); };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f3ff" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 28 }}>
          <div style={{ maxWidth: 680, display: "flex", flexDirection: "column", gap: 24 }}>

           
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#3b0764", margin: "0 0 4px" }}>
                📤 Submit a Request
              </h1>
              <p style={{ fontSize: 13, color: "#7c3aed", margin: 0 }}>
                Submit requests for events, guest lectures, field trips or notices to your HOD for approval.
              </p>
            </div>

            <div style={{
              background: "#fff", borderRadius: 20, border: "1px solid #ede9fe",
              padding: 28, boxShadow: "0 2px 12px rgba(109,40,217,0.07)",
            }}>
              {submitted ? (
                
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: "#3b0764", margin: "0 0 8px" }}>
                    Request Submitted!
                  </h2>
                  <p style={{ fontSize: 13, color: "#7c3aed", margin: "0 0 24px" }}>
                    Your HOD will review it and you'll be notified once a decision is made.
                  </p>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button onClick={handleAnother} style={{
                      padding: "10px 20px", background: "#6d28d9", color: "#fff",
                      borderRadius: 10, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
                    }}>Submit Another</button>
                    <button onClick={() => navigate("/dashboard")} style={{
                      padding: "10px 20px", background: "#fff", color: "#6d28d9",
                      borderRadius: 10, fontWeight: 700, fontSize: 13,
                      border: "1.5px solid #ede9fe", cursor: "pointer",
                    }}>Dashboard</button>
                  </div>
                </div>
              ) : (
                
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                 
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#6d28d9", display: "block", marginBottom: 8 }}>
                      Request Type
                    </label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {REQUEST_TYPES.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, type: t.value }))}
                          style={{
                            padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                            border: "1.5px solid",
                            background:  form.type === t.value ? "#6d28d9" : "#fff",
                            color:       form.type === t.value ? "#fff"    : "#6b7280",
                            borderColor: form.type === t.value ? "#6d28d9" : "#e5e7eb",
                            cursor: "pointer", transition: "all .15s",
                          }}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                 
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#6d28d9", display: "block", marginBottom: 6 }}>
                      Title *
                    </label>
                    <input
                      type="text" name="title" value={form.title} onChange={handleChange}
                      placeholder="e.g. Annual Tech Fest 2025"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                      onBlur={(e)  => (e.target.style.borderColor = "#ede9fe")}
                    />
                  </div>

                  
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#6d28d9", display: "block", marginBottom: 6 }}>
                      Description *
                    </label>
                    <textarea
                      name="description" value={form.description} onChange={handleChange}
                      placeholder="Describe the request in detail — date, venue, expected attendance, purpose..."
                      rows={4}
                      style={{ ...inputStyle, resize: "vertical" }}
                      onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
                      onBlur={(e)  => (e.target.style.borderColor = "#ede9fe")}
                    />
                  </div>

                  
                  <div style={{
                    background: "#f5f3ff", borderRadius: 10, padding: "10px 14px",
                    border: "1px solid #ede9fe", display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <span style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600 }}>Department:</span>
                    <span style={{ fontSize: 13, color: "#3b0764", fontWeight: 800 }}>
                      {user?.department || "Not assigned"}
                    </span>
                    <span style={{ fontSize: 11, color: "#c4b5fd", marginLeft: "auto" }}>
                      Request goes to your HOD
                    </span>
                  </div>

                 
                  {error && (
                    <div style={{
                      background: "#fef2f2", border: "1px solid #fecaca",
                      borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#ef4444", fontWeight: 600,
                    }}>
                      {error}
                    </div>
                  )}

            
                  <button type="submit" style={{
                    padding: "12px", background: "#6d28d9", color: "#fff",
                    borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
                    boxShadow: "0 2px 12px rgba(109,40,217,0.3)", transition: "background .2s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#5b21b6")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#6d28d9")}
                  >
                    📤 Submit Request
                  </button>
                </form>
              )}
            </div>

         
            {myRequests.length > 0 && (
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 900, color: "#3b0764", margin: "0 0 16px" }}>
                  📋 My Requests
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {myRequests.map((req) => {
                    const statusInfo = STATUS_INFO[req.status] || STATUS_INFO.pending;
                    return (
                      <div key={req._id} style={{
                        background: "#fff", borderRadius: 14, border: "1px solid #ede9fe",
                        padding: "16px 20px", boxShadow: "0 2px 8px rgba(109,40,217,0.06)",
                      }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                          <h3 style={{ fontSize: 14, fontWeight: 800, color: "#3b0764", margin: 0 }}>
                            {req.title}
                          </h3>
                          <span style={{
                            fontSize: 11, fontWeight: 800, padding: "3px 12px", borderRadius: 20,
                            background: statusInfo.bg, color: statusInfo.text, flexShrink: 0,
                          }}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 8px", lineHeight: 1.5 }}>
                          {req.description}
                        </p>
                        {req.status === "rejected" && req.reason && (
                          <div style={{
                            background: "#fef2f2", border: "1px solid #fecaca",
                            borderRadius: 8, padding: "6px 12px", marginBottom: 8,
                          }}>
                            <p style={{ fontSize: 11, color: "#dc2626", margin: 0, fontWeight: 600 }}>
                              Reason: {req.reason}
                            </p>
                          </div>
                        )}
                        <p style={{ fontSize: 11, color: "#c4b5fd", margin: 0 }}>
                          Submitted: {req.createdAt}
                          {req.resolvedAt && ` · Resolved: ${req.resolvedAt}`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getRequestsByDept,
  approveRequest,
  rejectRequest,
} from "../utils/requestsStorage";
const TYPE_INFO = {
  event:         { label: "Event / Seminar",               bg: "#ede9fe", text: "#7c3aed", dot: "#8b5cf6" },
  guest_lecture: { label: "Guest Lecture",                 bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
  dept_notice:   { label: "Department Notice",             bg: "#fef3c7", text: "#d97706", dot: "#f59e0b" },
  field_trip:    { label: "Field Trip / Industrial Visit", bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
};

const STATUS_INFO = {
  pending:  { bg: "#fef3c7", text: "#d97706", label: "⏳ Pending"  },
  approved: { bg: "#d1fae5", text: "#065f46", label: "✅ Approved" },
  rejected: { bg: "#fee2e2", text: "#dc2626", label: "❌ Rejected" },
};

export default function HodDashboard() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [requests,     setRequests]     = useState([]);
  const [filter,       setFilter]       = useState("pending");
  const [rejectModal,  setRejectModal]  = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = () => {
    if (user?.department) setRequests(getRequestsByDept(user.department));
  };

  useEffect(() => { load(); }, [user?.department]);

  const pendingCount  = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  const displayed = filter === "all"
    ? requests
    : requests.filter((r) => r.status === filter);

  const handleApprove = (id) => { approveRequest(id, user.name); load(); };
  const handleRejectConfirm = () => {
    if (!rejectModal) return;
    rejectRequest(rejectModal, user.name, rejectReason.trim());
    setRejectModal(null);
    setRejectReason("");
    load();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f3ff", padding: "28px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{
          background: "linear-gradient(135deg, #6d28d9, #7c3aed, #8b5cf6)",
          borderRadius: 20, padding: "28px", color: "#fff", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)", top: -60, right: -40 }} />
          <div style={{ position: "absolute", width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)", bottom: -20, right: 100 }} />
          <div style={{ position: "relative" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "0 0 4px", fontWeight: 500 }}>🏫 HOD Dashboard</p>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 4px", letterSpacing: -0.5 }}>Welcome, {user?.name}</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: "0 0 20px" }}>
              {user?.department} Department · Head of Department
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Total",    value: requests.length  },
                { label: "Pending",  value: pendingCount     },
                { label: "Approved", value: approvedCount    },
                { label: "Rejected", value: rejectedCount    },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "rgba(255,255,255,0.15)", borderRadius: 12,
                  padding: "10px 18px", textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}>
                  <p style={{ fontSize: 18, fontWeight: 900, margin: 0, lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: 10, margin: "3px 0 0", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "📥 All Requests",        path: "/requests",   bg: "#6d28d9", color: "#fff",    badge: pendingCount },
            { label: "➕ Create Announcement", path: "/create",     bg: "#fff",    color: "#6d28d9" },
            { label: "📋 My Posts",            path: "/dept-posts", bg: "#fff",    color: "#6d28d9" },
            { label: "👥 Faculty List",        path: "/faculty",    bg: "#fff",    color: "#6d28d9" },
          ].map((btn) => (
            <button key={btn.label} onClick={() => navigate(btn.path)} style={{
              padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
              background: btn.bg, color: btn.color,
              border: btn.bg === "#fff" ? "1.5px solid #ede9fe" : "none",
              cursor: "pointer", transition: "all .2s", position: "relative",
              boxShadow: btn.bg === "#6d28d9" ? "0 2px 12px rgba(109,40,217,0.3)" : "0 2px 8px rgba(109,40,217,0.07)",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {btn.label}
              {btn.badge > 0 && (
                <span style={{
                  marginLeft: 8, background: "#ef4444", color: "#fff",
                  fontSize: 10, fontWeight: 900, padding: "2px 7px",
                  borderRadius: 20, verticalAlign: "middle",
                }}>
                  {btn.badge}
                </span>
              )}
            </button>
          ))}
        </div>

       
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <h2 style={{ fontSize: 17, fontWeight: 900, color: "#3b0764", margin: 0 }}>
              📥 Department Requests
              <span style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600, marginLeft: 10 }}>
                from Faculty &amp; Students
              </span>
            </h2>
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { key: "pending",  label: `⏳ Pending (${pendingCount})`   },
                { key: "approved", label: `✅ Approved (${approvedCount})` },
                { key: "rejected", label: `❌ Rejected (${rejectedCount})` },
                { key: "all",      label: `All (${requests.length})`       },
              ].map((tab) => (
                <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
                  padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  border: "1.5px solid",
                  background:  filter === tab.key ? "#6d28d9" : "#fff",
                  color:       filter === tab.key ? "#fff"    : "#6b7280",
                  borderColor: filter === tab.key ? "#6d28d9" : "#e5e7eb",
                  cursor: "pointer", transition: "all .15s",
                }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {displayed.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ede9fe", padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#6d28d9", margin: "0 0 6px" }}>
                No {filter === "all" ? "" : filter} requests
              </p>
              <p style={{ fontSize: 13, color: "#a78bfa", margin: 0 }}>
                {filter === "pending" ? "All caught up! No pending requests." : `No ${filter} requests yet.`}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {displayed.map((req) => {
                const typeInfo   = TYPE_INFO[req.type]     || TYPE_INFO.event;
                const statusInfo = STATUS_INFO[req.status] || STATUS_INFO.pending;
                const isPending  = req.status === "pending";
                const isStudent  = req.requestedBy?.role === "Student";

                return (
                  <div key={req._id} style={{
                    background: "#fff", borderRadius: 16,
                    border: isPending ? "1.5px solid #c4b5fd" : "1px solid #ede9fe",
                    padding: "20px",
                    boxShadow: isPending ? "0 4px 16px rgba(109,40,217,0.1)" : "0 2px 12px rgba(109,40,217,0.06)",
                    transition: "box-shadow .2s, transform .2s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(109,40,217,0.13)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = isPending ? "0 4px 16px rgba(109,40,217,0.1)" : "0 2px 12px rgba(109,40,217,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 20, background: typeInfo.bg, color: typeInfo.text, display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: typeInfo.dot }} />
                          {typeInfo.label}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 20, background: statusInfo.bg, color: statusInfo.text }}>
                          {statusInfo.label}
                        </span>
                      </div>
                     
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: "50%",
                          background: isStudent ? "#dbeafe" : "#ede9fe",
                          color:      isStudent ? "#1d4ed8" : "#6d28d9",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 900, flexShrink: 0,
                        }}>
                          {req.requestedBy?.name?.[0]}
                        </div>
                        <span style={{ fontSize: 12, color: "#3b0764", fontWeight: 700 }}>{req.requestedBy?.name}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: isStudent ? "#dbeafe" : "#ede9fe", color: isStudent ? "#1d4ed8" : "#6d28d9" }}>
                          {req.requestedBy?.role}
                        </span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: 15, fontWeight: 800, color: "#3b0764", margin: "0 0 6px" }}>{req.title}</h3>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 14px", lineHeight: 1.6 }}>{req.description}</p>

                    {req.status === "rejected" && req.reason && (
                      <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", marginBottom: 14 }}>
                        <p style={{ fontSize: 12, color: "#dc2626", margin: 0, fontWeight: 600 }}>Reason: {req.reason}</p>
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f5f3ff", flexWrap: "wrap", gap: 10 }}>
                      <span style={{ fontSize: 11, color: "#c4b5fd" }}>
                        Submitted: {req.createdAt}{req.resolvedAt && ` · Resolved: ${req.resolvedAt}`}
                      </span>
                      {isPending && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => handleApprove(req._id)} style={{
                            padding: "8px 18px", background: "#6d28d9", color: "#fff", border: "none",
                            borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(109,40,217,0.3)",
                          }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#5b21b6")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#6d28d9")}
                          >✅ Approve</button>
                          <button onClick={() => { setRejectModal(req._id); setRejectReason(""); }} style={{
                            padding: "8px 18px", background: "#fef2f2", color: "#ef4444",
                            border: "1px solid #fecaca", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer",
                          }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#fef2f2")}
                          >❌ Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {rejectModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 28, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(109,40,217,0.2)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: "#3b0764", margin: "0 0 8px" }}>❌ Reject Request</h3>
            <p style={{ fontSize: 13, color: "#7c3aed", margin: "0 0 16px" }}>Provide a reason so the requester is notified.</p>
            <textarea
              value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Clashes with exam schedule..."
              rows={3}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #ede9fe", fontSize: 13, color: "#3b0764", outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", marginBottom: 16 }}
              onFocus={(e) => (e.target.style.borderColor = "#6d28d9")}
              onBlur={(e)  => (e.target.style.borderColor = "#ede9fe")}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleRejectConfirm} style={{ flex: 1, padding: "10px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Confirm Reject
              </button>
              <button onClick={() => setRejectModal(null)} style={{ flex: 1, padding: "10px", background: "#fff", color: "#6d28d9", border: "1.5px solid #ede9fe", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


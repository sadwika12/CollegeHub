import { useState } from "react";
import { dummyAnnouncements, dummyUsers } from "../utils/dummyData";

const currentHOD = dummyUsers.find(u => u.role === "hod");

export default function HodDashboard() {
  const [announcements, setAnnouncements] = useState(dummyAnnouncements);

  const deptAnnouncements = announcements.filter(
    a => a.department === currentHOD.department
  );

  const handleApprove = (id) => {
    setAnnouncements(prev =>
      prev.map(a => a._id === id ? { ...a, approved: true } : a)
    );
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>

      {/* Header */}
      <h1 style={{ color: "#1a1a2e" }}>🏫 HOD Dashboard</h1>
      <p style={{ color: "#555" }}>
        Welcome, <strong>{currentHOD.name}</strong> — {currentHOD.department} Department
      </p>
      <hr />

      {/* Department Announcements */}
      <h2 style={{ marginTop: "20px" }}>
        📋 {currentHOD.department} Department Announcements
      </h2>

      {deptAnnouncements.length === 0 ? (
        <p style={{ color: "#888" }}>No announcements for your department.</p>
      ) : (
        deptAnnouncements.map(a => (
          <div key={a._id} style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "15px",
            backgroundColor: a.approved ? "#e8f5e9" : "#f9f9f9"
          }}>
            <h3 style={{ margin: "0 0 8px" }}>{a.title}</h3>
            <p style={{ margin: "0 0 8px", color: "#444" }}>{a.content}</p>

            <span style={{
              backgroundColor: "#4a90e2",
              color: "white",
              padding: "3px 10px",
              borderRadius: "20px",
              fontSize: "12px"
            }}>
              {a.category}
            </span>

            <span style={{
              backgroundColor: a.approved ? "#27ae60" : "#e67e22",
              color: "white",
              padding: "3px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              marginLeft: "8px"
            }}>
              {a.approved ? "✅ Approved" : "⏳ Pending"}
            </span>

            <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
              Posted by: {a.postedBy.name} | Date: {a.createdAt}
            </p>

            {!a.approved && (
              <button
                onClick={() => handleApprove(a._id)}
                style={{
                  marginTop: "10px",
                  backgroundColor: "#27ae60",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                ✅ Approve
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
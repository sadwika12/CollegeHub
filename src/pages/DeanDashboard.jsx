import { dummyAnnouncements, dummyUsers } from "../utils/dummyData";

const currentDean = dummyUsers.find(u => u.role === "dean");

export default function DeanDashboard() {
  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>

      {/* Header */}
      <h1 style={{ color: "#1a1a2e" }}>🎓 Dean Dashboard</h1>
      <p style={{ color: "#555" }}>
        Welcome, <strong>{currentDean.name}</strong> — College Dean
      </p>
      <hr />

      {/* Stats Row */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={{
          flex: 1, backgroundColor: "#4a90e2", color: "white",
          borderRadius: "10px", padding: "20px", textAlign: "center"
        }}>
          <h2>{dummyAnnouncements.length}</h2>
          <p>Total Announcements</p>
        </div>
        <div style={{
          flex: 1, backgroundColor: "#27ae60", color: "white",
          borderRadius: "10px", padding: "20px", textAlign: "center"
        }}>
          <h2>{dummyAnnouncements.filter(a => a.isImportant).length}</h2>
          <p>Important</p>
        </div>
        <div style={{
          flex: 1, backgroundColor: "#e67e22", color: "white",
          borderRadius: "10px", padding: "20px", textAlign: "center"
        }}>
          <h2>{dummyAnnouncements.filter(a => a.targetAudience === "department").length}</h2>
          <p>Department Specific</p>
        </div>
      </div>

      {/* All Announcements */}
      <h2 style={{ marginTop: "30px" }}>📢 All College Announcements</h2>

      {dummyAnnouncements.map(a => (
        <div key={a._id} style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "15px",
          marginBottom: "15px",
          backgroundColor: a.isImportant ? "#fff8e1" : "#f9f9f9"
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

          {a.department && (
            <span style={{
              backgroundColor: "#8e44ad",
              color: "white",
              padding: "3px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              marginLeft: "8px"
            }}>
              {a.department}
            </span>
          )}

          {a.isImportant && (
            <span style={{
              backgroundColor: "#e74c3c",
              color: "white",
              padding: "3px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              marginLeft: "8px"
            }}>
              ⚠️ Important
            </span>
          )}

          <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
            Posted by: {a.postedBy.name} | Date: {a.createdAt}
          </p>
        </div>
      ))}
    </div>
  );
}
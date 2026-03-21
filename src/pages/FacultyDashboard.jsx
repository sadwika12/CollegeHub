import { dummyAnnouncements, dummyUsers } from "../utils/dummyData";

const currentFaculty = dummyUsers.find(u => u.role === "faculty");

export default function FacultyDashboard() {
  const myAnnouncements = dummyAnnouncements.filter(
    a => a.postedBy._id === currentFaculty._id
  );

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>

      {/* Header */}
      <h1 style={{ color: "#1a1a2e" }}>👨‍🏫 Faculty Dashboard</h1>
      <p style={{ color: "#555" }}>
        Welcome, <strong>{currentFaculty.name}</strong> — {currentFaculty.department} Department
      </p>
      <hr />

      {/* My Announcements */}
      <h2 style={{ marginTop: "20px" }}>📢 My Announcements</h2>

      {myAnnouncements.length === 0 ? (
        <p style={{ color: "#888" }}>You haven't posted any announcements yet.</p>
      ) : (
        myAnnouncements.map(a => (
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
            <p style={{ marginTop: "8px", fontSize: "12px", color: "#999" }}>
              Posted on: {a.createdAt}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
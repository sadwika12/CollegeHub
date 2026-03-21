import { dummyUsers, dummyAnnouncements } from "../utils/dummyData";

const currentUser = dummyUsers.find(u => u.role === "faculty");

export default function ProfilePage() {
  const myAnnouncements = dummyAnnouncements.filter(
    a => a.postedBy._id === currentUser._id
  );

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", maxWidth: "600px" }}>

      {/* Header */}
      <h1 style={{ color: "#1a1a2e" }}>👤 My Profile</h1>
      <hr />

      {/* Profile Card */}
      <div style={{
        marginTop: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "24px",
        backgroundColor: "#f0f7ff",
        display: "flex",
        alignItems: "center",
        gap: "20px"
      }}>
        {/* Avatar */}
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "#4a90e2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "36px",
          color: "white",
          flexShrink: 0
        }}>
          {currentUser.name.charAt(0)}
        </div>

        {/* Info */}
        <div>
          <h2 style={{ margin: "0 0 6px" }}>{currentUser.name}</h2>
          <p style={{ margin: "0 0 4px", color: "#555" }}>📧 {currentUser.email}</p>
          <p style={{ margin: "0 0 4px", color: "#555" }}>
            🎓 Role: <strong style={{ textTransform: "capitalize" }}>{currentUser.role}</strong>
          </p>
          {currentUser.department && (
            <p style={{ margin: "0", color: "#555" }}>
              🏫 Department: <strong>{currentUser.department}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
        <div style={{
          flex: 1,
          backgroundColor: "#4a90e2",
          color: "white",
          borderRadius: "10px",
          padding: "16px",
          textAlign: "center"
        }}>
          <h2 style={{ margin: "0" }}>{myAnnouncements.length}</h2>
          <p style={{ margin: "4px 0 0" }}>Announcements Posted</p>
        </div>
        <div style={{
          flex: 1,
          backgroundColor: "#27ae60",
          color: "white",
          borderRadius: "10px",
          padding: "16px",
          textAlign: "center"
        }}>
          <h2 style={{ margin: "0" }}>
            {myAnnouncements.filter(a => a.isImportant).length}
          </h2>
          <p style={{ margin: "4px 0 0" }}>Important Posts</p>
        </div>
      </div>

      {/* My Announcements */}
      <h2 style={{ marginTop: "30px" }}>📢 My Recent Announcements</h2>

      {myAnnouncements.length === 0 ? (
        <p style={{ color: "#888" }}>No announcements posted yet.</p>
      ) : (
        myAnnouncements.map(a => (
          <div key={a._id} style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "15px",
            backgroundColor: "#f9f9f9"
          }}>
            <h3 style={{ margin: "0 0 6px" }}>{a.title}</h3>
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
            <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
              Posted on: {a.createdAt}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
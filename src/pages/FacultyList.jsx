import { useAuth } from "../context/AuthContext";
import { dummyUsers } from "../utils/dummyData";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";



export default function FacultyList() {
  const { user } = useAuth();

  const facultyInDept = dummyUsers.filter(
    (u) => u.role === "Faculty" && u.department === user?.department
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f5f3ff" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 28 }}>


          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "#3b0764", margin: "0 0 4px" }}>
              👥 Faculty List
            </h1>
            <p style={{ fontSize: 13, color: "#7c3aed", margin: 0 }}>
              {facultyInDept.length} faculty member{facultyInDept.length !== 1 ? "s" : ""} in {user?.department} department
            </p>
          </div>

          {facultyInDept.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ede9fe", padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#6d28d9", margin: "0 0 6px" }}>No faculty found</p>
              <p style={{ fontSize: 13, color: "#a78bfa", margin: 0 }}>No faculty registered for {user?.department} yet.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, maxWidth: 900 }}>
              {facultyInDept.map((f) => (
                <div key={f._id} style={{
                  background: "#fff", borderRadius: 16,
                  border: "1px solid #ede9fe", padding: "20px",
                  boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
                  transition: "box-shadow .2s, transform .2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(109,40,217,0.13)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(109,40,217,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      background: "linear-gradient(135deg, #6d28d9, #8b5cf6)",
                      color: "#fff", fontWeight: 900, fontSize: 18,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(109,40,217,0.3)", flexShrink: 0,
                    }}>
                      {f.name[0].toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: "#3b0764", margin: 0 }}>{f.name}</p>
                      <p style={{ fontSize: 11, color: "#a78bfa", margin: "2px 0 0" }}>{f.email}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: "#ede9fe", color: "#6d28d9" }}>
                      {f.role}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: "#dbeafe", color: "#1d4ed8" }}>
                      {f.department}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

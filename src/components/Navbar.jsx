import { useState, useRef, useEffect } from "react";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Settings, ChevronDown, Search, X } from "lucide-react";

export default function Navbar() {
  const { user, logout }   = useAuth();
  const navigate            = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showHelp,    setShowHelp]    = useState(false);
  const [search,      setSearch]      = useState("");
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = () => {
    setShowProfile(false);
    logout();
    navigate("/login");
  };

  const handleViewProfile = () => {
    setShowProfile(false);
    navigate("/profile");
  };

  const handleSettings = () => {
    setShowProfile(false);
    navigate("/settings");
  };

  const handleHelp = () => {
    setShowProfile(false);
    setShowHelp(true);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    navigate(`/dashboard?q=${encodeURIComponent(q)}`);
    setSearch("");
  };

  return (
    <>
      <nav className="ch-navbar">
        <div
          className="ch-fade-down ch-nav-logo"
          style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 165, cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          <div className="ch-logo-gem">CH</div>
          <span className="ch-logo-text">CollegeHub</span>
        </div>
        <form
          onSubmit={handleSearch}
          className="ch-search ch-fade-down ch-nav-search"
          style={{ flex: 1, maxWidth: 300, display: "flex", alignItems: "center", gap: 6 }}
        >
          <Search size={13} color="rgba(255,255,255,0.6)" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search announcements..."
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: 13 }}
          />
          {search && (
            <button type="button" onClick={() => setSearch("")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", display: "flex", padding: 0 }}>
              <X size={12} />
            </button>
          )}
        </form>

        <div style={{ flex: 1 }} />
        <div
          className="ch-fade-down ch-nav-actions"
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <div className="ch-icon-btn" onClick={() => navigate("/submit-request")} style={{ cursor: "pointer" }}>
            <NotificationBell count={3} />
            <span className="ch-notif-dot" />
          </div>
          <button
            className="ch-icon-btn"
            onClick={handleSettings}
            title="Settings"
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Settings size={15} color="#fff" />
          </button>
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <button
              onClick={() => setShowProfile((p) => !p)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "none", border: "none", cursor: "pointer",
                padding: "4px 6px", borderRadius: 9,
                transition: "background .2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <div className="ch-avatar">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div style={{ textAlign: "left" }} className="hidden sm:block">
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.2, margin: 0 }}>
                  {user?.name}
                </p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", lineHeight: 1.2, margin: 0, textTransform: "capitalize" }}>
                  {user?.role}
                </p>
              </div>
              <ChevronDown
                size={13}
                color="rgba(255,255,255,0.6)"
                style={{ transition: "transform .2s", transform: showProfile ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>
            {showProfile && (
              <div className="ch-dropdown" style={{ minWidth: 200 }}>
                <div className="ch-dropdown-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: "linear-gradient(135deg, #6d28d9, #8b5cf6)",
                      color: "#fff", fontWeight: 900, fontSize: 14,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      {user?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#3b0764", margin: 0 }}>{user?.name}</p>
                      <p style={{ fontSize: 11, color: "#a78bfa", margin: 0, textTransform: "capitalize" }}>
                        {user?.role} · {user?.department || "College Wide"}
                      </p>
                    </div>
                  </div>
                </div>

                <button className="ch-dropdown-item" onClick={handleViewProfile}>
                  <span style={{ marginRight: 8 }}>👤</span> View Profile
                </button>
                <button className="ch-dropdown-item" onClick={handleSettings}>
                  <span style={{ marginRight: 8 }}>⚙️</span> Settings
                </button>
                <button className="ch-dropdown-item" onClick={handleHelp}>
                  <span style={{ marginRight: 8 }}>❓</span> Help &amp; Support
                </button>
                <div style={{ borderTop: "1px solid #f3f0ff" }}>
                  <button className="ch-dropdown-item danger" onClick={handleSignOut}>
                    <span style={{ marginRight: 8 }}>🚪</span> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      {showHelp && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}
          onClick={() => setShowHelp(false)}
        >
          <div
            style={{ background: "#fff", borderRadius: 20, padding: 28, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(109,40,217,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: "#3b0764", margin: 0 }}>❓ Help & Support</h2>
              <button onClick={() => setShowHelp(false)} style={{ background: "#f5f3ff", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: "📧", label: "Email Support",  value: "support@collegehub.edu" },
                { icon: "📞", label: "Phone",          value: "+91 98765 43210"         },
                { icon: "🕐", label: "Support Hours",  value: "Mon–Fri, 9 AM – 5 PM"   },
                { icon: "📖", label: "Documentation",  value: "docs.collegehub.edu"     },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, background: "#f5f3ff", border: "1px solid #ede9fe" }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: 11, color: "#a78bfa", fontWeight: 600, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</p>
                    <p style={{ fontSize: 13, color: "#3b0764", fontWeight: 700, margin: 0 }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowHelp(false)} style={{ width: "100%", marginTop: 20, padding: "11px", background: "#6d28d9", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}


import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
const SETTINGS_KEY = (userId) => `ch_settings_${userId}`;

const defaultSettings = {
  notifications: {
    announcements: true,
    events:        true,
    approvals:     true,
    reminders:     false,
  },
  privacy: {
    showDepartment: true,
    showRole:       true,
  },
  appearance: {
    compactMode: false,
  },
};

const loadSettings = (userId) => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY(userId));
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch { return defaultSettings; }
};

const saveSettings = (userId, settings) => {
  try { localStorage.setItem(SETTINGS_KEY(userId), JSON.stringify(settings)); } catch {}
};


const Toggle = ({ checked, onChange, label, description }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f5f3ff" }}>
    <div>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#3b0764", margin: "0 0 2px" }}>{label}</p>
      {description && <p style={{ fontSize: 11, color: "#a78bfa", margin: 0 }}>{description}</p>}
    </div>
    <button
      onClick={onChange}
      style={{
        width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
        background: checked ? "#6d28d9" : "#e5e7eb",
        position: "relative", transition: "background .2s", flexShrink: 0,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3,
        left: checked ? 23 : 3,
        transition: "left .2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }} />
    </button>
  </div>
);


const Section = ({ title, icon, children }) => (
  <div style={{
    background: "#fff", borderRadius: 16, border: "1px solid #ede9fe",
    padding: "20px 24px", boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
  }}>
    <h2 style={{ fontSize: 15, fontWeight: 900, color: "#3b0764", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
      <span>{icon}</span> {title}
    </h2>
    {children}
  </div>
);

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate          = useNavigate();
  const [settings, setSettings] = useState(() => loadSettings(user?._id));
  const [saved,    setSaved]    = useState(false);

  const update = (section, key) => {
    const next = {
      ...settings,
      [section]: { ...settings[section], [key]: !settings[section][key] },
    };
    setSettings(next);
    saveSettings(user._id, next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  const handleClearData = () => {
    if (window.confirm("This will clear all your posts, bookmarks and settings. Are you sure?")) {
      localStorage.clear();
      logout();
      navigate("/login");
    }
  };

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
                  ⚙️ Settings
                </h1>
                <p style={{ fontSize: 13, color: "#7c3aed", margin: 0 }}>
                  Manage your account preferences
                </p>
              </div>
              {saved && (
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: "6px 14px",
                  borderRadius: 20, background: "#d1fae5", color: "#065f46",
                }}>
                  ✅ Saved
                </span>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

             
              <Section title="Account" icon="👤">
                {[
                  { label: "Full Name",   value: user?.name                   },
                  { label: "Email",       value: user?.email || "—"           },
                  { label: "Role",        value: user?.role                   },
                  { label: "Department",  value: user?.department || "College Wide" },
                ].map((row) => (
                  <div key={row.label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 0", borderBottom: "1px solid #f5f3ff",
                  }}>
                    <span style={{ fontSize: 13, color: "#a78bfa", fontWeight: 600 }}>{row.label}</span>
                    <span style={{ fontSize: 13, color: "#3b0764", fontWeight: 700, textTransform: "capitalize" }}>
                      {row.value}
                    </span>
                  </div>
                ))}
                <p style={{ fontSize: 11, color: "#c4b5fd", margin: "12px 0 0" }}>
                  To update your account details, contact admin.
                </p>
              </Section>

            
              <Section title="Notifications" icon="🔔">
                <Toggle
                  checked={settings.notifications.announcements}
                  onChange={() => update("notifications", "announcements")}
                  label="Announcements"
                  description="Get notified when new announcements are posted"
                />
                <Toggle
                  checked={settings.notifications.events}
                  onChange={() => update("notifications", "events")}
                  label="Events"
                  description="Get notified about upcoming college events"
                />
                <Toggle
                  checked={settings.notifications.approvals}
                  onChange={() => update("notifications", "approvals")}
                  label="Approvals & Requests"
                  description="Get notified when your requests are approved or rejected"
                />
                <Toggle
                  checked={settings.notifications.reminders}
                  onChange={() => update("notifications", "reminders")}
                  label="Exam Reminders"
                  description="Get reminded about upcoming exams"
                />
              </Section>

             
              <Section title="Privacy" icon="🔒">
                <Toggle
                  checked={settings.privacy.showDepartment}
                  onChange={() => update("privacy", "showDepartment")}
                  label="Show Department"
                  description="Display your department to other users"
                />
                <Toggle
                  checked={settings.privacy.showRole}
                  onChange={() => update("privacy", "showRole")}
                  label="Show Role"
                  description="Display your role badge on your profile"
                />
              </Section>

             
              <Section title="Appearance" icon="🎨">
                <Toggle
                  checked={settings.appearance.compactMode}
                  onChange={() => update("appearance", "compactMode")}
                  label="Compact Mode"
                  description="Show more content with reduced spacing"
                />
              </Section>

              
              <div style={{
                background: "#fff", borderRadius: 16,
                border: "1.5px solid #fecaca", padding: "20px 24px",
                boxShadow: "0 2px 12px rgba(239,68,68,0.06)",
              }}>
                <h2 style={{ fontSize: 15, fontWeight: 900, color: "#dc2626", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                  ⚠️ Danger Zone
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #fef2f2" }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#3b0764", margin: "0 0 2px" }}>Sign Out</p>
                      <p style={{ fontSize: 11, color: "#a78bfa", margin: 0 }}>Sign out of your account on this device</p>
                    </div>
                    <button onClick={handleSignOut} style={{
                      padding: "8px 18px", background: "#fef2f2", color: "#ef4444",
                      border: "1px solid #fecaca", borderRadius: 9,
                      fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0,
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#fef2f2")}
                    >
                      🚪 Sign Out
                    </button>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0" }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#3b0764", margin: "0 0 2px" }}>Clear All Data</p>
                      <p style={{ fontSize: 11, color: "#a78bfa", margin: 0 }}>Permanently delete all posts, bookmarks and settings</p>
                    </div>
                    <button onClick={handleClearData} style={{
                      padding: "8px 18px", background: "#ef4444", color: "#fff",
                      border: "none", borderRadius: 9,
                      fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0,
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
                    >
                      🗑️ Clear Data
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

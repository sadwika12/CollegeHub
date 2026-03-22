import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const ICONS = {
  "My Feed":          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  "Bookmarks":        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  "Submit Request":   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  "Dashboard":        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  "My Posts":         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  "Create Post":      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  "Profile":          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  "Dept Posts":       <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  "Requests":         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/></svg>,
  "Faculty List":     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  "All Posts":        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  "My Events":        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  "Create Event":     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  "Register Org":     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  "Home":             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  "Admin Panel":      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  "All Users":        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  "Departments":      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  "Org Approvals":    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
};

const getNavSections = (role) => {
  switch (role) {
    case "Student":
      return [
        { section: "Main",    items: [{ label: "My Feed",        path: "/dashboard"      }] },
        { section: "Account", items: [
          { label: "Submit Request", path: "/submit-request" },
          { label: "Bookmarks",      path: "/bookmarks"      },
          { label: "Profile",        path: "/profile"        },
        ]},
      ];
    case "Faculty":
      return [
        { section: "Main",    items: [{ label: "Dashboard", path: "/dashboard" }] },
        { section: "Content", items: [
          { label: "My Posts",       path: "/my-posts"       },
          { label: "Create Post",    path: "/create"         },
          { label: "Submit Request", path: "/submit-request" },
        ]},
        { section: "Account", items: [{ label: "Profile", path: "/profile" }] },
      ];
    case "HOD":
      return [
        { section: "Main",       items: [{ label: "Dashboard", path: "/dashboard" }] },
        { section: "Requests",   items: [
          { label: "Requests",    path: "/requests"   },
        ]},
        { section: "Department", items: [
          { label: "Dept Posts",  path: "/dept-posts" },
          { label: "Faculty List",path: "/faculty"    },
          { label: "Create Post", path: "/create"     },
        ]},
        { section: "Account",    items: [{ label: "Profile", path: "/profile" }] },
      ];
    case "Dean":
      return [
        { section: "Main",    items: [{ label: "Dashboard",   path: "/dashboard" }] },
        { section: "Content", items: [
          { label: "Create Post", path: "/create"    },
          { label: "All Posts",   path: "/all-posts" },
        ]},
        { section: "Account", items: [{ label: "Profile", path: "/profile" }] },
      ];
    case "Cell":
      return [
        { section: "Main",    items: [{ label: "Dashboard",   path: "/dashboard" }] },
        { section: "Content", items: [
          { label: "My Posts",    path: "/my-posts" },
          { label: "Create Post", path: "/create"   },
        ]},
        { section: "Account", items: [{ label: "Profile", path: "/profile" }] },
      ];
    case "Organization":
      return [
        { section: "Main",         items: [{ label: "Dashboard",   path: "/dashboard"    }] },
        { section: "Events",       items: [
          { label: "My Events",    path: "/my-posts"     },
          { label: "Create Event", path: "/create"       },
        ]},
        { section: "Organization", items: [{ label: "Register Org", path: "/org/register" }] },
        { section: "Account",      items: [{ label: "Profile",      path: "/profile"      }] },
      ];
    case "Admin":
      return [
        { section: "Main",       items: [{ label: "Home", path: "/dashboard" }] },
        { section: "Management", items: [
          { label: "Admin Panel",   path: "/admin" },
          { label: "All Users",     path: "/admin" },
          { label: "Departments",   path: "/admin" },
          { label: "Org Approvals", path: "/admin" },
        ]},
      ];
    default:
      return [];
  }
};

const STORAGE_KEY = (role) => `ch_sidebar_collapsed_${role}`;

const Sidebar = () => {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const sections  = getNavSections(user?.role);

  const [collapsed, setCollapsed] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY(user?.role));
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });

  const toggleSection = (name) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      try { localStorage.setItem(STORAGE_KEY(user?.role), JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  return (
    <aside className="ch-sidebar">
      <div className="ch-user-card ch-slide-in ch-delay-0">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="ch-user-avatar">{user?.name?.[0]?.toUpperCase() ?? "U"}</div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 900, fontSize: 13, color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name}
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: "2px 0 0" }}>
              {user?.department || "College Wide"}
            </p>
          </div>
        </div>
        <div className="ch-role-pill">
          <span className="ch-role-pill-dot" />
          <span style={{ textTransform: "capitalize" }}>{user?.role}</span>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "10px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
        {sections.map((sec, si) => {
          const isCollapsed = collapsed.has(sec.section);
          return (
            <div key={sec.section} style={{ marginBottom: 4 }}>
              <button
                onClick={() => toggleSection(sec.section)}
                className={`ch-slide-in ch-delay-${si}`}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "6px 10px", background: "none", border: "none", cursor: "pointer",
                  color: "rgba(255,255,255,0.5)", fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: ".14em", textTransform: "uppercase" }}>
                  {sec.section}
                </span>
                <span style={{ transition: "transform .2s", transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)", display: "flex" }}>
                  <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
                </span>
              </button>
              {!isCollapsed && (
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {sec.items.map((link, li) => {
                    const isActive   = location.pathname === link.path;
                    const icon       = ICONS[link.label];
                    const delayClass = `ch-delay-${Math.min(si * 2 + li + 1, 13)}`;
                    return (
                      <button
                        key={link.label}
                        onClick={() => navigate(link.path)}
                        className={`ch-nav-item ch-slide-in ${delayClass} ${isActive ? "active" : ""}`}
                        style={{ display: "flex", alignItems: "center", gap: 10 }}
                      >
                        <span style={{
                          flexShrink: 0, display: "flex", alignItems: "center",
                          color: isActive ? "#fbbf24" : "rgba(255,255,255,0.5)",
                          filter: isActive ? "drop-shadow(0 0 4px #fbbf24)" : "none",
                          transition: "all .2s",
                        }}>
                          {icon}
                        </span>
                        <span style={{ flex: 1, textAlign: "left" }}>{link.label}</span>
                        {isActive && <span className="ch-active-bar" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="ch-footer-strip ch-slide-in ch-delay-13">
        <div className="ch-footer-inner">
          <div className="ch-footer-av">{user?.name?.[0]?.toUpperCase() ?? "U"}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 12, color: "#fff", fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name}
            </p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", margin: 0, textTransform: "capitalize" }}>
              {user?.role} · {user?.department || "CollegeHub"}
            </p>
          </div>
          <ChevronRight size={13} color="rgba(255,255,255,0.4)" style={{ flexShrink: 0 }} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


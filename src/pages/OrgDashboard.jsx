import { useState } from "react";
import { dummyAnnouncements, dummyUsers, dummyOrganizations } from "../utils/dummyData";

const currentOrg = dummyUsers.find(u => u.role === "organization");
const orgDetails = dummyOrganizations.find(o => o.name === currentOrg.name);

export default function OrgDashboard() {
  const myAnnouncements = dummyAnnouncements.filter(
    a => a.postedBy._id === currentOrg._id
  );

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>

      {/* Header */}
      <h1 style={{ color: "#1a1a2e" }}>🏢 Organisation Dashboard</h1>
      <p style={{ color: "#555" }}>
        Welcome, <strong>{currentOrg.name}</strong>
      </p>
      <hr />

      {/* Org Info Card */}
      <div style={{
        marginTop: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        backgroundColor: "#f0f7ff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <h2 style={{ margin: "0 0 6px" }}>{orgDetails.name}</h2>
          <p style={{ margin: "0", color: "#555" }}>{orgDetails.description}</p>
        </div>
        <span style={{
          backgroundColor: orgDetails.isApproved ? "#27ae60" : "#e67e22",
          color: "white",
          padding: "6px 16px",
          borderRadius: "20px",
          fontSize: "14px",
          fontWeight: "bold"
        }}>
          {orgDetails.isApproved ? "✅ Approved" : "⏳ Pending Approval"}
        </span>
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
          <p style={{ margin: "4px 0 0" }}>Total Posts</p>
        </div>
        <div style={{
          flex: 1,
          backgroundColor: "#8e44ad",
          color: "white",
          borderRadius: "10px",
          padding: "16px",
          textAlign: "center"
        }}>
          <h2 style={{ margin: "0" }}>
            {myAnnouncements.filter(a => a.category === "event").length}
          </h2>
          <p style={{ margin: "4px 0 0" }}>Events Posted</p>
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
      <h2 style={{ marginTop: "30px" }}>📢 My Announcements</h2>

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

            <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
              Posted on: {a.createdAt}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
import { useState } from "react";
import { dummyDepartments } from "../utils/dummyData";

export default function CreateAnnouncement() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "general",
    targetAudience: "all",
    department: "",
    isImportant: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Announcement submitted:", form);
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({
      title: "",
      content: "",
      category: "general",
      targetAudience: "all",
      department: "",
      isImportant: false,
    });
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div style={{ padding: "30px", fontFamily: "Arial", textAlign: "center" }}>
        <h1 style={{ color: "#27ae60" }}>✅ Announcement Posted!</h1>
        <p style={{ color: "#555" }}>Your announcement has been submitted successfully.</p>
        <button
          onClick={handleReset}
          style={{
            marginTop: "20px",
            backgroundColor: "#4a90e2",
            color: "white",
            border: "none",
            padding: "10px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          ➕ Post Another
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", maxWidth: "600px" }}>

      {/* Header */}
      <h1 style={{ color: "#1a1a2e" }}>📝 Create Announcement</h1>
      <p style={{ color: "#555" }}>Fill in the details to post a new announcement</p>
      <hr />

      {/* Form */}
      <div style={{ marginTop: "20px" }}>

        {/* Title */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter announcement title"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px"
            }}
          />
        </div>

        {/* Content */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>
            Content *
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Enter announcement details..."
            rows={5}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
              resize: "vertical"
            }}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px"
            }}
          >
            <option value="general">General</option>
            <option value="exam">Exam</option>
            <option value="event">Event</option>
            <option value="academic">Academic</option>
            <option value="assignment">Assignment</option>
          </select>
        </div>

        {/* Target Audience */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>
            Target Audience
          </label>
          <select
            name="targetAudience"
            value={form.targetAudience}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px"
            }}
          >
            <option value="all">All</option>
            <option value="department">Department Only</option>
          </select>
        </div>

        {/* Department (only if department selected) */}
        {form.targetAudience === "department" && (
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>
              Select Department
            </label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px"
              }}
            >
              <option value="">-- Select --</option>
              {dummyDepartments.map(d => (
                <option key={d._id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Important Checkbox */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input
              type="checkbox"
              name="isImportant"
              checked={form.isImportant}
              onChange={handleChange}
              style={{ width: "16px", height: "16px" }}
            />
            <span style={{ fontWeight: "bold" }}>⚠️ Mark as Important</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            backgroundColor: "#4a90e2",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          📢 Post Announcement
        </button>

      </div>
    </div>
  );
}
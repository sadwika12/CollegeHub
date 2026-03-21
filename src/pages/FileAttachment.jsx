import { useState } from "react";

export default function FileAttachment() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploaded(false);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile.name);
      setUploaded(true);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setUploaded(false);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", maxWidth: "500px" }}>

      {/* Header */}
      <h1 style={{ color: "#1a1a2e" }}>📎 File Attachment</h1>
      <p style={{ color: "#555" }}>Attach a file to your announcement</p>
      <hr />

      {/* Upload Box */}
      <div style={{
        marginTop: "20px",
        border: "2px dashed #4a90e2",
        borderRadius: "10px",
        padding: "30px",
        textAlign: "center",
        backgroundColor: "#f0f7ff"
      }}>
        <p style={{ fontSize: "40px", margin: "0" }}>📁</p>
        <p style={{ color: "#555", marginTop: "10px" }}>
          Click below to select a file
        </p>

        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          style={{
            display: "inline-block",
            marginTop: "10px",
            backgroundColor: "#4a90e2",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          📂 Choose File
        </label>
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div style={{
          marginTop: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "15px",
          backgroundColor: "#f9f9f9"
        }}>
          <p style={{ margin: "0 0 6px", fontWeight: "bold" }}>📄 Selected File:</p>
          <p style={{ margin: "0 0 4px", color: "#333" }}>{selectedFile.name}</p>
          <p style={{ margin: "0 0 12px", color: "#888", fontSize: "12px" }}>
            Size: {(selectedFile.size / 1024).toFixed(2)} KB
          </p>

          {/* Upload & Remove Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleUpload}
              disabled={uploaded}
              style={{
                flex: 1,
                backgroundColor: uploaded ? "#27ae60" : "#4a90e2",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "8px",
                cursor: uploaded ? "default" : "pointer",
                fontSize: "14px"
              }}
            >
              {uploaded ? "✅ Uploaded!" : "⬆️ Upload File"}
            </button>

            <button
              onClick={handleRemove}
              style={{
                flex: 1,
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              🗑️ Remove
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {uploaded && (
        <div style={{
          marginTop: "16px",
          backgroundColor: "#e8f5e9",
          border: "1px solid #27ae60",
          borderRadius: "10px",
          padding: "12px",
          textAlign: "center",
          color: "#27ae60",
          fontWeight: "bold"
        }}>
          ✅ File uploaded successfully!
        </div>
      )}
    </div>
  );
}
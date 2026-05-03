import React, { useState, useRef } from "react";
import { uploadDocument } from "../services/api";

function Upload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async () => {
    if (!file) {
      console.warn("Upload attempted without selecting a file");
      return alert("Select a file");
    }

    console.log("Starting upload for file:", file.name);
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await uploadDocument(formData);
      console.log("Upload succeeded", res.data);
      alert("Document uploaded and processed successfully!");
      onUploadSuccess(res.data);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export default Upload;
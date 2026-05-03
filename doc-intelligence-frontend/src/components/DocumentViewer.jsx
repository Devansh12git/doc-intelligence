import React from "react";

function DocumentViewer({ fileUrl }) {
  return (
    <div>
      <h3>📄 Document Preview</h3>

      {fileUrl ? (
        <iframe
          src={fileUrl}
          width="100%"
          height="500px"
          title="PDF Viewer"
          style={{ borderRadius: "10px" }}
        />
      ) : (
        <p>No preview available</p>
      )}
    </div>
  );
}

export default DocumentViewer;
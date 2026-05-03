import React from "react";
import { useNavigate } from "react-router-dom";

function DocumentList({ documents }) {
  const navigate = useNavigate();

  return (
    <div>
      <h2>📄 Documents</h2>
      {documents.map((doc) => (
        <div key={doc.id} onClick={() => navigate(`/document/${doc.id}`)}>
          {doc.file_name}
        </div>
      ))}
    </div>
  );
}

export default DocumentList;
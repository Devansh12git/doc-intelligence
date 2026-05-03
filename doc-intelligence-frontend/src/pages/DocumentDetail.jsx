import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDocumentById } from "../services/api";
import DocumentViewer from "../components/DocumentViewer";
import ExtractedData from "../components/ExtractedData";

function DocumentDetail() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    console.log(`DocumentDetail mounted for id=${id}`);
    fetchDoc();
  }, []);

  const fetchDoc = async () => {
    console.log("Fetching document detail", { id });
    try {
      const res = await getDocumentById(id);
      console.log("Document detail loaded", res.data);
      setDoc(res.data);
    } catch (error) {
      console.error("Failed to load document:", error);
      setDoc(null);
    }
  };

  if (!doc) return <p style={{ color: "white" }}>Loading...</p>;

  return (
    <div>
      <h2 style={{ color: "white" }}>📄 Document Details</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>{doc.file_name}</p>

      <DocumentViewer fileUrl={doc.file_url || doc.file_path} />
      <ExtractedData data={doc.extracted_data || doc} />
    </div>
  );
}

export default DocumentDetail;
import React, { useState } from "react";
import Upload from "../components/Upload";
import ExtractedData from "../components/ExtractedData";

function UploadPage() {
  const [data, setData] = useState(null);

  return (
    <div>
      <h2 style={{ color: "white", fontSize: "28px" }}>
        📤 Upload Document
      </h2>
      <Upload onUploadSuccess={setData} />
      <ExtractedData data={data} />
    </div>
  );
}

export default UploadPage;
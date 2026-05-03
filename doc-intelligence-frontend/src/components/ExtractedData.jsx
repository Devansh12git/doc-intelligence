import React from "react";

function ExtractedData({ data }) {
  if (!data) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3 style={{ color: "white" }}>📊 Extracted Data</h3>
      <div style={dataContainer}>
        {data.vendor && <p><b>Vendor:</b> {data.vendor}</p>}
        {data.invoice_number && <p><b>Invoice Number:</b> {data.invoice_number}</p>}
        {data.invoice_date && <p><b>Invoice Date:</b> {data.invoice_date}</p>}
        {data.amount && <p><b>Amount:</b> ₹{data.amount}</p>}
        {data.summary && <p><b>Summary:</b> {data.summary}</p>}
        {data.line_items && data.line_items.length > 0 && (
          <div>
            <b>Line Items:</b>
            <ul>
              {data.line_items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const dataContainer = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "10px",
  color: "white",
};

export default ExtractedData;
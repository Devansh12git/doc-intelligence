import React from "react";

function Analytics() {
  const totalDocs = 5;
  const totalAmount = 15000;

  return (
    <div>
      <h2 style={{ color: "white" }}>📊 Analytics</h2>

      <div style={card}>
        <h3>Total Documents</h3>
        <p>{totalDocs}</p>
      </div>

      <div style={card}>
        <h3>Total Amount</h3>
        <p>₹{totalAmount}</p>
      </div>
    </div>
  );
}

const card = {
  background: "#1e293b",
  padding: "20px",
  marginTop: "10px",
  borderRadius: "10px"
};

export default Analytics;
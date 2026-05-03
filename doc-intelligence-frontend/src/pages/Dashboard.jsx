import React, { useEffect, useState } from "react";
import { getDocuments } from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Dashboard mounted, fetching documents");
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    console.log("Fetching documents from API...");
    try {
      const res = await getDocuments();
      console.log(`Loaded ${res.data.length} documents`);
      setDocuments(res.data);
    } catch (error) {
      console.error("Failed to load documents:", error);
      setDocuments([]);
    }
  };

  // 🔍 Search filter
  const filteredDocs = documents.filter((doc) =>
    doc.file_name.toLowerCase().includes(search.toLowerCase()) ||
    (doc.vendor || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalDocs = documents.length;
  const totalAmount = documents.reduce((sum, doc) => {
    const amount = typeof doc.amount === "number"
      ? doc.amount
      : parseFloat(String(doc.amount || "").replace(/[^0-9.-]+/g, ""));
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  const formatAmount = (value) =>
    value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown time";
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const recentActivity = [...documents]
    .sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at))
    .slice(0, 3)
    .map((doc) => ({
      label: `✔ ${doc.file_name} processed`,
      time: formatDate(doc.uploaded_at),
    }));

  const vendorStats = documents.reduce((acc, doc) => {
    const vendor = doc.vendor || "Unknown Vendor";
    const amount = typeof doc.amount === "number"
      ? doc.amount
      : parseFloat(String(doc.amount || "").replace(/[^0-9.-]+/g, ""));
    if (!acc[vendor]) acc[vendor] = { count: 0, total: 0 };
    acc[vendor].count += 1;
    acc[vendor].total += Number.isFinite(amount) ? amount : 0;
    return acc;
  }, {});

  const topVendors = Object.entries(vendorStats)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 3)
    .map(([vendor, stats]) => ({
      label: vendor,
      count: stats.count,
      total: stats.total,
    }));

  return (
    <div>
      <h2 style={{ marginBottom: "20px", color: "white" }}>
        📊 Dashboard
      </h2>

      <div style={searchContainer}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by file name or vendor"
          style={searchInput}
        />
      </div>

      {/* 🔹 Stats Cards */}
      <div style={statsContainer}>
        <div style={card}>
          <h3>📄 Total Docs</h3>
          <p style={number}>{totalDocs}</p>
        </div>

        <div style={card}>
          <h3>💰 Total Amount</h3>
          <p style={number}>₹{formatAmount(totalAmount)}</p>
        </div>

        <div style={card}>
          <h3>⚡ Processed</h3>
          <p style={number}>{totalDocs}</p>
        </div>
      </div>

      {/* 📄 Document List */}
      <h3>📄 Documents</h3>
      {filteredDocs.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No documents found.</p>
      ) : (
        filteredDocs.map((doc) => (
          <div
            key={doc.id}
            style={docCard}
            onClick={() => navigate(`/document/${doc.id}`)}
          >
            📄 {doc.file_name}
            <span style={{ float: "right" }}>
              ₹{formatAmount(typeof doc.amount === "number" ? doc.amount : parseFloat(String(doc.amount || "").replace(/[^0-9.-]+/g, "")) || 0)} | ✅ Processed
            </span>
          </div>
        ))
      )}

      {/* 🕒 Recent Activity */}
      <h3 style={{ marginTop: "30px" }}>🕒 Recent Activity</h3>
      <div style={card}>
        {recentActivity.length > 0 ? (
          recentActivity.map((item, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <p style={{ margin: 0 }}>{item.label}</p>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>{item.time}</p>
            </div>
          ))
        ) : (
          <p>No recent activity yet.</p>
        )}
      </div>

      {/* 🏢 Top Vendors */}
      <h3 style={{ marginTop: "30px" }}>🏢 Top Vendors</h3>
      <div style={card}>
        {topVendors.length > 0 ? (
          topVendors.map((item, index) => (
            <p key={index} style={{ margin: "8px 0" }}>
              {item.label} — {item.count} doc{item.count > 1 ? "s" : ""} — ₹{formatAmount(item.total)}
            </p>
          ))
        ) : (
          <p>No vendors yet.</p>
        )}
      </div>
    </div>
  );
}

/* 🎨 Styles */

const statsContainer = {
  display: "flex",
  gap: "15px",
  marginBottom: "20px"
};

const card = {
  flex: 1,
  background: "#1e293b",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center"
};

const number = {
  fontSize: "22px",
  fontWeight: "bold"
};

const searchContainer = {
  marginBottom: "20px"
};

const searchInput = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
};

const inputStyle = {
  padding: "10px",
  width: "100%",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "none"
};

const docCard = {
  background: "#1e293b",
  padding: "15px",
  marginTop: "10px",
  borderRadius: "8px",
  cursor: "pointer"
};

export default Dashboard;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchDocuments } from "../services/api";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) {
      console.warn("Search attempted with empty query");
      return;
    }

    console.log("Searching for documents", { query });
    setLoading(true);
    try {
      const res = await searchDocuments(query);
      console.log(`Search returned ${res.data.length} results`);
      setResults(res.data);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <h2 style={{ color: "white", fontSize: "28px" }}>🔍 Search Documents</h2>

      {/* Search Box */}
      <div style={searchBox}>
        <input
          type="text"
          placeholder="Enter document name or vendor..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          style={inputStyle}
        />

        <button onClick={handleSearch} style={buttonStyle} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Results */}
      <div>
        {results.length === 0 && query && !loading && (
          <p style={{ color: "#94a3b8" }}>No documents found matching "{query}"</p>
        )}
        {results.map((doc) => (
          <div
            key={doc.id}
            style={card}
            onClick={() => navigate(`/document/${doc.id}`)}
          >
            📄 {doc.file_name}
            <div style={{ marginTop: "5px", color: "#94a3b8", fontSize: "14px" }}>
              {doc.vendor && <span>Vendor: {doc.vendor}</span>}
              {doc.vendor && doc.amount && <span> | </span>}
              {doc.amount && <span>₹{doc.amount}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Styles */
const searchBox = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px"
};

const inputStyle = {
  flex: 1,
  padding: "10px",
  borderRadius: "5px",
  border: "none"
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const card = {
  background: "#1e293b",
  padding: "15px",
  marginTop: "10px",
  borderRadius: "8px",
  cursor: "pointer"
};

export default SearchPage;
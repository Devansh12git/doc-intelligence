import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import DocumentDetail from "./pages/DocumentDetail";
import Analytics from "./pages/Analytics";
import SearchPage from "./pages/SearchPage";


function App() {
  return (
    <BrowserRouter>
      <div style={styles.container}>
        
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
          <span style={{ fontSize: "24px", marginRight: "8px" }}>📄</span>
            Enterprise Document Intelligence System
            <small>  (AI Driven)</small>
          </h1>
          <div>
            <Link to="/" style={styles.link}>📊 Dashboard</Link>
            <Link to="/upload" style={styles.link}>📤 Upload</Link>
            <Link to="/analytics" style={styles.link}>📈 Analytics</Link>
            <Link to="/search" style={styles.link}>🔍 Search</Link>
         </div>
      </div>  

        {/* Content */}
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/document/:id" element={<DocumentDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

const styles = {
  container: {
    fontFamily: "Arial",
    backgroundColor: "#0f172a",
    minHeight: "100vh",
    color: "white",
  },
  header: {
    background: "#1e293b",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #334155",
  },
  title: {
    margin: 0,
    color: "#60a5fa",
    fontSize: "26px",   
    fontWeight: "600"
  },
  link: {
    marginLeft: "15px",
    color: "#93c5fd",
    textDecoration: "none",
    fontWeight: "bold",
  },
  content: {
    padding: "30px",
  },
};

export default App;
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ListPage from "./page/ListPage";

function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <Header />

   
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
        <Routes>
   
          <Route path="/" element={<Navigate to="/list" replace />} />

       
          <Route path="/list" element={<ListPage />} />

          
        </Routes>
      </main>
    </div>
  );
}

export default App;

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ListPage from "./page/ListPage";
import MainPage from "./page/MainPage"

function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />

       
          <Route path="/list" element={<ListPage />} />

          
        </Routes>
     
    </div>
  );
}

export default App;

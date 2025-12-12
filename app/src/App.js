import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ListPage from "./page/ListPage";
import MainPage from "./page/MainPage"
import ProductDetailPage from './page/ProductDetailPage';
import OrderHistoryPage from './page/OrderHistoryPage';
import LoginPage from './page/LoginPage';
import AdminPage from './page/AdminPage';

function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <Header />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route path="/account/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

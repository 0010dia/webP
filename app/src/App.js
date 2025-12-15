import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ListPage from "./page/ListPage";
import MainPage from "./page/MainPage";
import ProductDetailPage from "./page/ProductDetailPage";
import OrderHistoryPage from "./page/OrderHistoryPage";
import LoginPage from "./page/LoginPage";
import AdminPage from "./page/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <Header />
  
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/account/login" element={<LoginPage />} />

          {/* 보호된 라우트 - 로그인 필요 */}
          <Route
            path="/order-history"
            element={
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />

          {/* 관리자 전용 라우트 */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
   
    </div>
  );
}

export default App;

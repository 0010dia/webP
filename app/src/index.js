import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; // 파일 위치에 맞게 경로 수정 (예: ./context/CartContext)
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider> 
      <CartProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

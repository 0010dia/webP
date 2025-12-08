import React, { createContext, useState, useContext, useEffect } from 'react';
import * as cartAPI from '../api/cart';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // 장바구니 데이터 가져오기
  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      if (response.success) {
        setCart(response.cart || []);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // 앱 시작 시 장바구니 데이터 로드
  useEffect(() => {
    fetchCart();
  }, []);

  // 장바구니에 상품 추가
  const addItem = async (productId, size, quantity) => {
    try {
      const response = await cartAPI.addToCart(productId, size, quantity);
      if (response.success) {
        setCart(response.cart);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || '장바구니 추가 중 오류가 발생했습니다.';
      return { success: false, message };
    }
  };

  // 장바구니에서 상품 제거
  const removeItem = async (index) => {
    try {
      const response = await cartAPI.removeFromCart(index);
      if (response.success) {
        setCart(response.cart);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || '장바구니 제거 중 오류가 발생했습니다.';
      return { success: false, message };
    }
  };

  // 장바구니 초기화 (주문 완료 후)
  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    loading,
    cartCount: cart.length,
    addItem,
    removeItem,
    clearCart,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

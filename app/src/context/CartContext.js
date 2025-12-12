import React, { createContext, useState, useContext, useEffect } from 'react';
import * as cartAPI from '../api/cart'; // API 연결

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 1. 장바구니 데이터 가져오기
  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      if (response.success) {
        setCart(response.cart || []);
      }
    } catch (error) {
      console.log('장바구니 로드 실패 (비로그인 등):', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 2. 장바구니 추가
  const addItem = async (product, size, quantity, colorName, image) => {
    try {
      // DB에 저장
      const response = await cartAPI.addToCart({
        productId: product._id,
        size,
        quantity,
        colorName,
        image
      });
      
      // 성공하면 DB에서 최신 카트 받아오기
      if (response.success) {
        setCart(response.cart);
      }
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
      alert("장바구니 추가 중 오류가 발생했습니다.");
    }
  };

  // 3. 장바구니 삭제
  const removeItem = async (index) => {
    try {
      const response = await cartAPI.removeFromCart(index);
      if (response.success) {
        setCart(response.cart);
      }
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  // 4. 수량 변경 (로컬 UI만 업데이트하거나 API 구현 필요)
  const updateQuantity = (index, change) => {
    setCart(prev => prev.map((item, i) => {
      if (i === index) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
    // 주의: 실제로는 API로 수량 변경 요청을 보내야 DB와 동기화됩니다.
  };

  // 5. 장바구니 비우기 (결제 완료 후)
  const clearCart = async () => {
    try {
      const response = await cartAPI.clearCart();
      if (response.success) {
        setCart(response.cart); // 서버로부터 받은 빈 배열로 상태 업데이트
      }
    } catch (error) {
      console.error("장바구니 비우기 실패:", error);
    }
  };

  const value = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart, // ✅ 반드시 여기에 포함되어야 함
    cartCount: cart.length,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
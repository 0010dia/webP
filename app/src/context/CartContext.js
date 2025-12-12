import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  // 로컬 스토리지에서 장바구니 데이터 불러오기 (새로고침 해도 유지됨)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('myCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('myCart', JSON.stringify(cart));
  }, [cart]);

  // 장바구니 추가 함수 (상품 전체 정보, 사이즈, 수량, 색상명, 이미지)
  const addItem = (product, size, quantity, colorName, image) => {
    setCart(prev => {
      // 동일한 상품(ID + 사이즈 + 색상)이 있는지 확인
      const existingItemIndex = prev.findIndex(item => 
        item._id === product._id && item.size === size && item.colorName === colorName
      );

      if (existingItemIndex > -1) {
        // 이미 있으면 수량만 증가
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        // 없으면 새로 추가
        const newItem = {
          _id: product._id,
          name: product.name,
          price: product.price, // 가격 정보 저장
          size,
          quantity,
          colorName, // 색상 이름 저장
          image,     // 색상별 이미지 저장
        };
        return [...prev, newItem];
      }
    });
  };

  // 장바구니 항목 삭제
  const removeItem = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // 장바구니 수량 변경 (선택 사항)
  const updateQuantity = (index, change) => {
    setCart(prev => prev.map((item, i) => {
      if (i === index) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const value = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    cartCount: cart.length,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { useCart } from '../context/CartContext';

// ... (스타일 정의 부분은 기존과 동일하므로 생략하지 않고 전체 코드 제공) ...
// 편의를 위해 전체 코드를 다시 드립니다.

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
`;

const Container = styled.div`
  width: 420px;
  max-width: 90%;
  height: 100%;
  background: white;
  padding: 30px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.3s ease-out;
  box-shadow: -4px 0 15px rgba(0,0,0,0.1);
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  left: 0;
  top: 0;
  background: none;
  border: none;
  font-size: 28px;
  font-weight: 300;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  color: #333;
  &:hover { opacity: 0.7; }
`;

const CartIconWrapper = styled.div`
  position: relative;
  margin-bottom: 15px;
  svg { width: 32px; height: 32px; stroke-width: 1.5; }
`;

const CountBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -5px;
  background: #212121;
  color: white;
  font-size: 11px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const PromoText = styled.p`
  font-size: 13px;
  color: #444;
  text-align: center;
  line-height: 1.5;
  margin: 0;
  font-weight: 500;
`;

const ItemList = styled.div`
  flex: 1;
  overflow-y: auto;
  border-top: 1px solid #212121;
  margin-top: 20px;
`;

const CartItem = styled.div`
  display: flex;
  padding: 24px 0;
  border-bottom: 1px solid #e0e0e0;
  gap: 16px;
  position: relative;
`;

const ItemImage = styled.img`
  width: 90px;
  height: 90px;
  object-fit: cover;
  background: #f4f4f4;
  border-radius: 4px;
`;

const ItemInfo = styled.div`
  flex: 1;
  padding-right: 25px;
`;

const ItemName = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #212121;
  margin-bottom: 6px;
  line-height: 1.4;
`;

const ItemSize = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
`;

const ItemPrice = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #212121;
`;

const QuantityBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #212121;
  width: fit-content;
  margin-top: 12px;
  border-radius: 2px;
  height: 32px;
`;

const QtyBtn = styled.button`
  width: 32px;
  height: 100%;
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #333;
  &:hover { background: #f9f9f9; }
`;

const QtyValue = styled.span`
  min-width: 30px;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
`;

const RemoveButton = styled.button`
  position: absolute;
  right: 0;
  bottom: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 5px;
  &:hover { color: #d32f2f; }
`;

const Footer = styled.div`
  border-top: 1px solid #212121;
  padding-top: 20px;
  margin-top: auto;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 20px;
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: #212121;
  color: white;
  padding: 18px;
  font-size: 15px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #444; }
`;

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeItem, updateQuantity } = useCart();

  // 🟢 [수정 1] 가격이 없으면 0으로 계산하여 에러 방지
  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
  }, [cart]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Header>
          <CloseButton onClick={onClose}>✕</CloseButton>
          <CartIconWrapper>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 6h15l-1.68 7.57a2.43 2.43 0 01-2 1.83H8.38a2.43 2.43 0 01-2.3-1.78L4.5 4" />
              <path d="M4.5 4l-.5-2H2" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            <CountBadge>{cart.length}</CountBadge>
          </CartIconWrapper>
          <PromoText>
            회원가입 시 1만원 할인 쿠폰 증정<br/>(마케팅 수신 동의 필수)
          </PromoText>
        </Header>

        <ItemList>
          {cart.length === 0 ? (
            <div style={{textAlign:'center', padding:'50px 0', color:'#999'}}>장바구니가 비어있습니다.</div>
          ) : (
            cart.map((item, idx) => (
              <CartItem key={`${item._id}-${idx}`}>
                <ItemImage src={item.image} alt={item.name} />
                <ItemInfo>
                  <ItemName>{item.name} - {item.colorName}</ItemName>
                  <ItemSize>{item.size}</ItemSize>
                  
                  {/* 🟢 [수정 2] 가격이 없으면 0으로 표시 */}
                  <ItemPrice>₩{((item.price || 0) * item.quantity).toLocaleString()}</ItemPrice>
                  
                  <QuantityBox>
                    <QtyBtn onClick={() => updateQuantity(idx, -1)}>-</QtyBtn>
                    <QtyValue>{item.quantity}</QtyValue>
                    <QtyBtn onClick={() => updateQuantity(idx, 1)}>+</QtyBtn>
                  </QuantityBox>
                </ItemInfo>
                
                <RemoveButton onClick={() => removeItem(idx)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </RemoveButton>
              </CartItem>
            ))
          )}
        </ItemList>

        <Footer>
          <TotalRow>
            <span>총액</span>
            {/* 🟢 [수정 3] 총액 표시 에러 방지 */}
            <span>₩{totalPrice.toLocaleString()}</span>
          </TotalRow>
          <CheckoutButton>결제</CheckoutButton>
        </Footer>
      </Container>
    </Overlay>
  );
};

export default CartDrawer;
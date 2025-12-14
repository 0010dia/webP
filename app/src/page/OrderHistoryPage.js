import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
`;

// --- 사이드바 스타일 ---
const Sidebar = styled.div`
  width: 200px;
  padding-right: 40px;
  border-right: 1px solid #eee;
`;

const SidebarItem = styled.div`
  padding: 15px 0;
  color: ${props => props.$active ? '#000' : '#666'};
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  cursor: pointer;
  border-bottom: ${props => props.$active ? '2px solid #000' : 'none'};
  
  &:hover { color: #000; }
`;

// --- 메인 컨텐츠 스타일 ---
const Content = styled.div`
  flex: 1;
  padding-left: 40px;
`;

const PageTitle = styled.h2`
  font-size: 1.5em;
  margin-bottom: 30px;
`;

const OrderCard = styled.div`
  background-color: #A0A0A0; /* 스크린샷의 회색 배경 */
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #00008B; /* 스크린샷의 파란 글씨 */
  font-weight: 500;
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoRow = styled.div`
  font-size: 1.1em;
`;

const ReviewButton = styled.button`
  background-color: #6495ED; /* 스크린샷의 연파랑 버튼 */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  
  &:hover { background-color: #4169E1; }
`;

// --- 모달 스타일 ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  margin: 10px 0;
  padding: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ModalButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.$primary ? '#333' : '#ddd'};
  color: ${props => props.$primary ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // 리뷰 쓸 상품 정보
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(5);

  // 주문 내역 불러오기
  useEffect(() => {
    fetch('http://localhost:5001/api/orders', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
        } else {
          // 로그인되지 않았거나 다른 오류가 있을 경우 사용자에게 알림
          console.error(data.message);
          // 필요하다면 로그인 페이지로 리디렉션 처리
        }
      })
      .catch(err => console.error(err));
  }, []);

  const openReviewModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    setReviewContent('');
    setRating(5);
  };

  const submitReview = async () => {
    if (!reviewContent.trim()) return alert('내용을 입력해주세요.');

    try {
      const res = await fetch('http://localhost:5001/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 세션 쿠키 전송을 위해 추가
        body: JSON.stringify({
          productId: selectedItem.productId, // ._id 제거
          rating,
          content: reviewContent
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('후기가 작성되었습니다!');
        setIsModalOpen(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('오류 발생');
    }
  };

  return (
    <PageContainer>
      {/* 사이드바 */}
      <Sidebar>
        <SidebarItem>마이페이지</SidebarItem>
        <SidebarItem>회원 정보</SidebarItem>
        <SidebarItem $active>지난 주문 내역</SidebarItem>
        <SidebarItem>주문 정보 등록</SidebarItem>
        <SidebarItem>올멤버스 혜택</SidebarItem>
        <div style={{ marginTop: '40px', fontSize: '0.8em', textDecoration: 'underline' }}>로그아웃</div>
      </Sidebar>

      {/* 메인 컨텐츠 */}
      <Content>
        <PageTitle>지난 주문 내역</PageTitle>

        {orders.map(order => (
          <div key={order._id}>
            {order.items.map((item, idx) => (
              <OrderCard key={idx}>
                <OrderInfo>
                  <InfoRow>제품명: {item.name}</InfoRow>
                  <InfoRow>결제금액: ₩{(item.price * item.quantity).toLocaleString()}</InfoRow>
                </OrderInfo>
                <OrderInfo style={{ textAlign: 'right' }}>
                  <InfoRow>수량: {item.quantity}개</InfoRow>
                  <InfoRow>결제일: {new Date(order.createdAt).toISOString().split('T')[0]}</InfoRow>
                </OrderInfo>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <ReviewButton onClick={() => openReviewModal(item)}>
                    후기작성
                  </ReviewButton>
                </div>
              </OrderCard>
            ))}
          </div>
        ))}
      </Content>

      {/* 후기 작성 모달 */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalBox>
            <h3>후기 작성 ({selectedItem?.name})</h3>
            <div style={{ margin: '10px 0' }}>
              별점: 
              {[1,2,3,4,5].map(num => (
                <span 
                  key={num} 
                  style={{ cursor: 'pointer', color: num <= rating ? '#FFD700' : '#ddd', fontSize: '1.5em' }}
                  onClick={() => setRating(num)}
                >★</span>
              ))}
            </div>
            <TextArea 
              placeholder="솔직한 후기를 남겨주세요." 
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
            />
            <ButtonGroup>
              <ModalButton onClick={() => setIsModalOpen(false)}>취소</ModalButton>
              <ModalButton $primary onClick={submitReview}>등록</ModalButton>
            </ButtonGroup>
          </ModalBox>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default OrderHistoryPage;
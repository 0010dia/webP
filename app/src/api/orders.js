import client from './client';

// 주문 생성
export const createOrder = async () => {
  const response = await client.post('/api/orders');
  return response.data;
};

// 내 주문 내역 조회
export const getMyOrders = async () => {
  const response = await client.get('/api/orders');
  return response.data;
};

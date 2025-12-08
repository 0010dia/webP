import client from './client';

// 장바구니 조회
export const getCart = async () => {
  const response = await client.get('/api/cart');
  return response.data;
};

// 장바구니에 상품 추가
export const addToCart = async (productId, size, quantity) => {
  const response = await client.post('/api/cart', { productId, size, quantity });
  return response.data;
};

// 장바구니에서 상품 제거
export const removeFromCart = async (index) => {
  const response = await client.delete(`/api/cart/${index}`);
  return response.data;
};

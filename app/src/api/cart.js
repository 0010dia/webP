import client from './client';

// 장바구니 조회
export const getCart = async () => {
  const response = await client.get('/api/cart');
  return response.data;
};

// 장바구니에 상품 추가
export const addToCart = async (item) => {
  const { productId, size, quantity, colorName, image } = item;
  const response = await client.post('/api/cart', { productId, size, quantity, colorName, image });
  return response.data;
};

// 장바구니에서 상품 제거
export const removeFromCart = async (index) => {
  const response = await client.delete(`/api/cart/${index}`);
  return response.data;
};

// 장바구니 비우기
export const clearCart = async () => {
  const response = await client.delete('/api/cart/clear');
  return response.data;
};

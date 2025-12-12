import client from './client';

// 상품 관리 리스트
export const getAdminProducts = async () => {
  const response = await client.get('/api/admin/products');
  return response.data;
};

// 상품 상세 조회 (수정용)
export const getAdminProductById = async (id) => {
  const response = await client.get(`/api/admin/products/${id}`);
  return response.data;
};

// 상품 등록
export const createProduct = async (formData) => {
  const response = await client.post('/api/admin/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 상품 수정
export const updateProduct = async (id, formData) => {
  const response = await client.put(`/api/admin/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 상품 삭제
export const deleteProduct = async (id) => {
  const response = await client.delete(`/api/admin/products/${id}`);
  return response.data;
};

// 사이즈 가용성 토글
export const toggleSizeAvailability = async (productId, size) => {
  const response = await client.patch(`/api/admin/products/${productId}/sizes`, { size });
  return response.data;
};

// 할인율 변경
export const updateDiscount = async (productId, discountRate) => {
  const response = await client.patch(`/api/admin/products/${productId}/discount`, { discountRate });
  return response.data;
};

// 판매 현황 조회
export const getSalesReport = async (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await client.get(`/api/admin/sales-report?${params.toString()}`);
  return response.data;
};

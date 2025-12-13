import client from "./client";

// 상품 리스트 조회
export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.category) params.append("category", filters.category);
  if (filters.material) params.append("material", filters.material);

  // ✅ 추가: 사이즈 필터
  if (filters.sizes) params.append("sizes", filters.sizes);

  if (filters.sale) params.append("sale", "true");
  if (filters.newProduct) params.append("newProduct", "true");

  const response = await client.get(`/api/products?${params.toString()}`);
  return response.data;
};

// 상품 상세 조회
export const getProductById = async (id) => {
  const response = await client.get(`/api/products/${id}`);
  return response.data;
};

import client from './client';

// 로그인
export const login = async (user_id, password) => {
  const response = await client.post('/api/auth/login', { user_id, password });
  return response.data;
};

// 회원가입
export const register = async (user_id, password, name, role = 'customer') => {
  const response = await client.post('/api/auth/register', { user_id, password, name, role });
  return response.data;
};

// 로그아웃
export const logout = async () => {
  const response = await client.post('/api/auth/logout');
  return response.data;
};

// 현재 사용자 정보 조회
export const getCurrentUser = async () => {
  const response = await client.get('/api/auth/me');
  return response.data;
};

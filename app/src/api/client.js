import axios from 'axios';

// API 베이스 URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// axios 인스턴스 생성
const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 세션 쿠키 전송 허용
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 에러 로깅용
client.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 서버가 응답을 반환한 경우
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      // 요청이 전송되었으나 응답이 없는 경우
      console.error('No response received:', error.request);
    } else {
      // 요청 설정 중 오류 발생
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default client;

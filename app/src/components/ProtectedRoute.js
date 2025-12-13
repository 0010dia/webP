import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 18px;
  color: #666;
`;

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  // 로딩 중일 때
  if (loading) {
    return <LoadingContainer>로딩 중...</LoadingContainer>;
  }

  // 로그인하지 않은 경우
  if (!user) {
    return <Navigate to="/account/login" replace />;
  }

  // 관리자 권한이 필요한데 관리자가 아닌 경우
  if (requireAdmin && user.role !== 'admin') {
    alert('관리자 권한이 필요합니다.');
    return <Navigate to="/" replace />;
  }

  // 모든 조건 통과 - 자식 컴포넌트 렌더링
  return children;
};

export default ProtectedRoute;

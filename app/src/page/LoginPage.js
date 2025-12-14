import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px); /* Header height assumed 64px */
  background-color: #f8f8f8;
  font-family: 'Helvetica Neue', Arial, sans-serif;
`;

const LoginForm = styled.form`
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h2`
  font-size: 1.8em;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9em;
  color: #555;
  margin-bottom: 8px;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  &:focus {
    border-color: #333;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #212121;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #444;
  }
  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 0.9em;
  text-align: center;
  margin-top: -10px;
`;

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(userId, password);

      if (result.success) {
        alert('로그인 성공!');

        // 역할 기반 리다이렉션
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/order-history');
        }
      } else {
        setError(result.message || '로그인 실패');
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>로그인</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <InputGroup>
          <Label htmlFor="userId">아이디</Label>
          <Input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            disabled={loading}
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </InputGroup>
        <Button type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </LoginForm>
    </PageContainer>
  );
};

export default LoginPage;

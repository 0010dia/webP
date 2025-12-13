import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authAPI from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 현재 로그인된 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        if (response.success) {
          setUser(response.user);
        }
      } catch (error) {
        // 로그인되지 않은 경우 에러 무시
        console.log('Not logged in');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // 로그인
  const login = async (user_id, password) => {
    try {
      const response = await authAPI.login(user_id, password);
      if (response.success) {
        setUser(response.user);
        return { success: true, user: response.user };
      }
      return { success: false, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      return { success: false, message };
    }
  };

  // 회원가입
  const register = async (user_id, password, name, role) => {
    try {
      const response = await authAPI.register(user_id, password, name, role);
      return { success: true, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      return { success: false, message };
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

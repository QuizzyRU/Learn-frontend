import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await api.user.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    const response = await api.auth.login(username, password);
    if (response.access_token) {
      api.setToken(response.access_token);
      const userData = await api.user.getCurrentUser();
      setUser(userData);
      return userData;
    }
  };

  const register = async (username, password, name) => {
    const userData = await api.auth.register(username, password, name);
    if (userData) {
      return login(username, password);
    }
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register
  };

  if (loading) {
    return null; // или компонент загрузки
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
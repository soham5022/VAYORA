import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('vayora_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data?.success) {
          setUser(res.data.data);
        }
      } catch (err) {
        console.warn('Session expired or invalid:', err.message);
        localStorage.removeItem('vayora_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, ...userData } = res.data.data;
      localStorage.setItem('vayora_token', token);
      setUser(userData);
      showToast(`Welcome back, ${userData.name}!`, 'success');
      return { success: true, user: userData };
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, confirmPassword });
      const { token, ...userData } = res.data.data;
      localStorage.setItem('vayora_token', token);
      setUser(userData);
      showToast('Registration successful! Welcome to VAYORA.', 'success');
      return { success: true, user: userData };
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('vayora_token');
    setUser(null);
    showToast('Signed out successfully', 'info');
  };

  const updateProfile = async (formData) => {
    try {
      const res = await api.put('/auth/profile', formData);
      const updatedUser = res.data.data;
      setUser(updatedUser);
      showToast('Profile updated successfully', 'success');
      return { success: true, user: updatedUser };
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
      return { success: false, error: err.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await api.put('/auth/password', { currentPassword, newPassword });
      showToast('Password changed successfully', 'success');
      return { success: true, message: res.data.message };
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error');
      return { success: false, error: err.message };
    }
  };

  const loginDemoUser = async () => {
    return login('demo@vayora.com', 'Demo@123');
  };

  const loginDemoAdmin = async () => {
    return login('admin@vayora.com', 'Admin@123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        loginDemoUser,
        loginDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

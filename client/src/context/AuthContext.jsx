import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if student is already logged in on mount
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const data = await authService.getMe();
        if (data && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        // Not logged in or expired token - perfectly normal on first visit
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authService.login({ email, password });
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout error', err);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await authService.updateProfile(profileData);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile.';
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

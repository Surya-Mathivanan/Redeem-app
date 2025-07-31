import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Token is handled by api interceptor
          
          // Verify token and get user data
          const res = await api.get('/auth/me');
          
          setUser(res.data);
        }
      } catch (error) {
        // If token is invalid, remove it
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      
      // Save token
      localStorage.setItem('token', res.data.token);
      
      setUser(res.data);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return false;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      const res = await api.post('/auth/login', userData);
      
      // Save token
      localStorage.setItem('token', res.data.token);
      
      setUser(res.data);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Logged out successfully');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const res = await api.put('/users/profile', userData);
      
      setUser({
        ...user,
        ...res.data
      });
      
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return false;
    }
  };

  // Check suspension status
  const checkSuspension = async () => {
    try {
      const res = await api.get('/users/suspension');
      
      if (res.data.isSuspended) {
        const suspensionDate = new Date(res.data.suspendedUntil);
        const formattedDate = suspensionDate.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        toast.error(`Your account is suspended until ${formattedDate}. Reason: ${res.data.reason}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking suspension:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        checkSuspension
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
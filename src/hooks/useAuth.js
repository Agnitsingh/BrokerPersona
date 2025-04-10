import { useState } from 'react';
import api from 'services/api';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Check if user is already logged in
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };
  
  // Get the current user's role
  const getUserRole = () => {
    return localStorage.getItem('userRole');
  };

  // Register a new user
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/register', userData);
      
      // Store token and user info in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userName', userData.name);
      }
      
      setIsLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login user
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Store token and user info in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        localStorage.setItem('userName', response.data.user.name);
      }
      
      setIsLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    
    // Redirect to login page
    window.location.href = '/authentication/sign-in';
  };

  return {
    isLoading,
    error,
    isAuthenticated,
    getUserRole,
    register,
    login,
    logout
  };
}; 
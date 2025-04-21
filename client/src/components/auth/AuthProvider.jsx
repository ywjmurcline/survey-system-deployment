import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Set up axios auth header helper
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('authToken', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('authToken');
    }
  };

  // Configure axios to properly log errors
  axios.interceptors.response.use(
    response => response,
    error => {
      console.error('API Error:', error?.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  // Check for token on initial load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Set the auth header
        setAuthToken(token);
        
        // Verify the token
        const res = await axios.get('http://localhost:3000/api/auth/verify');
        setCurrentUser(res.data.user);
      } catch (err) {
        console.error('Token verification failed:', err);
        // Clear invalid token
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  const API_URL = 'http://localhost:3000/api/auth';

  // Register function with better error handling
  const register = async (name, email, password) => {
    try {
      console.log('Attempting registration with:', { name, email });
      
      // Explicitly set the full URL and content type
      const res = await axios.post('http://localhost:3000/api/auth/register', 
        { name, email, password },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      
      console.log('Registration successful:', res.data);
      const { token, user } = res.data;
      setAuthToken(token);
      setCurrentUser(user);
      setError(null);
      return user;
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response) {
        console.error('Server response:', err.response.data);
      }
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  };
  
  // Login function with better error handling
  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        email, password
      });
      
      const { token, user } = res.data;
      setAuthToken(token);
      setCurrentUser(user);
      setError(null);
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      console.error('Login error:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };
  
  // Logout function
  const logout = () => {
    setAuthToken(null);
    setCurrentUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      loading, 
      error,
      register, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
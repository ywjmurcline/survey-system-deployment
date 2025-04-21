import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Configure axios defaults
  useEffect(() => {
    // Set up request interceptor to include token
    axios.interceptors.request.use(config => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, error => {
      return Promise.reject(error);
    });
  }, []);

  // Verify token on initial load
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get('http://localhost:3000/api/auth/verify');
        if (response.data && response.data.user) {
          setCurrentUser(response.data.user);
        }
      } catch (err) {
        console.error('Token verification failed:', err);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };
    
    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email, password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const logout = async () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        name, email, password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      error,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};
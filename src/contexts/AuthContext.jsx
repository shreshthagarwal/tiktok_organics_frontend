import React, { createContext, useState, useContext, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on initial load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Here you could add token validation logic if needed
      // For now, we'll just check if it exists
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      console.log('Sending login request with:', { 
        username: credentials.email, 
        password: credentials.password 
      });
      
      const response = await fetch('https://addon.sightshark.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          username: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();
      console.log('Login response:', { status: response.status, data });

      if (!response.ok) {
        // Handle 401 unauthorized (invalid credentials)
        if (response.status === 401) {
          throw new Error('Invalid email or password');
        }
        // Handle 422 validation errors
        if (response.status === 422) {
          const errorMessage = data.detail?.[0]?.msg || 'Invalid input';
          throw new Error(errorMessage);
        }
        throw new Error(`Login failed. Please try again.`);
      }

      const { access_token, token_type } = data;
      
      if (access_token) {
        localStorage.setItem('authToken', access_token);
        localStorage.setItem('tokenType', token_type);
        setIsLoggedIn(true);
        return { success: true };
      }
      
      throw new Error('No access token received');
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'An error occurred during login' 
      };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
  };

  // Don't render children until we've checked auth state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

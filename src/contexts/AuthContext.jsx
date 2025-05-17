import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const stored = localStorage.getItem('isLoggedIn');
    return stored === 'true';
  });

  const login = (credentials) => {
    const { email, password } = credentials;
    // Get credentials from .env
    const envEmail = import.meta.env.VITE_EMAIL;
    const envPassword = import.meta.env.VITE_PASSWORD;

    if (email === envEmail && password === envPassword) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

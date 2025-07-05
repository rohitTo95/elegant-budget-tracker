import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from '@/lib/axios';

interface AuthContextType {
  userName: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const response = await axios.post('/api/auth/login', { email, password });

      if (response.data.user && response.data.token) {
        // Store token and username in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.user.name);
        
        setUserName(response.data.user.name);
        setIsAuthenticated(true);
        console.log('Login successful - token and username stored in localStorage for user:', response.data.user.name);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      setUserName(null);
      // Clear token and username from localStorage on login failure
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Initiating logout...');
      // Call the logout endpoint (optional for localStorage approach)
      const response = await axios.post('/api/auth/logout');
      
      console.log('Server logout successful:', response.data);
      
      // Clear token and username from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      
      // Clear local authentication state
      setUserName(null);
      setIsAuthenticated(false);
      
      console.log('Logout completed - token and username removed from localStorage and local state cleared');
    } catch (error) {
      console.error('Error during server logout:', error);
      
      // Even if server logout fails, clear local state and token
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setUserName(null);
      setIsAuthenticated(false);
      
      console.log('Local logout completed despite server error');
    }
  };

  const checkAuth = async () => {
    try {
      // Check if token exists in localStorage
      const token = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username');
      
      if (!token) {
        console.log('No token found in localStorage');
        setIsAuthenticated(false);
        setUserName(null);
        // Also clear username if token doesn't exist
        if (storedUsername) {
          localStorage.removeItem('username');
        }
        return;
      }

      // If we have both token and username in localStorage, restore them first
      if (storedUsername) {
        setUserName(storedUsername);
        console.log('Username restored from localStorage:', storedUsername);
      }

      console.log('Checking authentication token from localStorage...');
      const response = await axios.get('/api/auth/check');

      if (response.data.success && response.data.user) {
        // Update username in state and localStorage (in case it changed on server)
        setUserName(response.data.user.name);
        localStorage.setItem('username', response.data.user.name);
        setIsAuthenticated(true);
        console.log('Token validated successfully for user:', response.data.user.name);
      } else {
        setIsAuthenticated(false);
        setUserName(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        console.log('Token validation failed - invalid token');
      }
    } catch (error: any) {
      console.error('Token validation error:', error);
      setIsAuthenticated(false);
      setUserName(null);
      
      // If it's a 401 or 403 error, the token is invalid/expired
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Token expired or invalid, clearing authentication state');
        // Clear token and username from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkAuth().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const value: AuthContextType = {
    userName,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

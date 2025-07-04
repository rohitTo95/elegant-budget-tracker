import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from '@/lib/axios';

interface AuthContextType {
  userName: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
      const response = await axios.post('/api/user/login', { email, password });

      if (response.data.user) {
        setUserName(response.data.user.name);
        setIsAuthenticated(true);
        console.log('Login successful:', response.data.user.name);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUserName(null);
    setIsAuthenticated(false);

    // Clear cookies by making a request to logout endpoint or manually clearing
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log('User logged out successfully');
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/auth/check');

      if (response.data.success && response.data.user) {
        setUserName(response.data.user.name);
        setIsAuthenticated(true);
        console.log('User authenticated successfully:', response.data.user.name);
      } else {
        setIsAuthenticated(false);
        setUserName(null);
        console.log('User not authenticated');
      }
    } catch (error: any) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      setUserName(null);
      
      // If it's a 401 error, clear any existing cookies
      if (error.response?.status === 401) {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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

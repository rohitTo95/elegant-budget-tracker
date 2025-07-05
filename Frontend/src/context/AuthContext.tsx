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
        setUserName(response.data.user.name);
        setIsAuthenticated(true);
        console.log('Login successful - token received for user:', response.data.user.name);
        console.log('Token will be automatically handled by httpOnly cookie');
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      setUserName(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Initiating logout - invalidating token...');
      // Call the logout endpoint to invalidate the httpOnly cookie on server side
      const response = await axios.post('/api/auth/logout');
      
      console.log('Server logout successful:', response.data);
      
      // Clear local authentication state
      setUserName(null);
      setIsAuthenticated(false);
      
      console.log('Logout completed - token invalidated and local state cleared');
    } catch (error) {
      console.error('Error during server logout:', error);
      
      // Even if server logout fails, clear local state and token
      setUserName(null);
      setIsAuthenticated(false);
      
      // Force clear the token cookie
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log('Local logout completed despite server error');
    }
  };

  const checkAuth = async () => {
    try {
      console.log('Checking authentication token...');
      const response = await axios.get('/api/auth/check');

      if (response.data.success && response.data.user) {
        setUserName(response.data.user.name);
        setIsAuthenticated(true);
        console.log('Token validated successfully for user:', response.data.user.name);
      } else {
        setIsAuthenticated(false);
        setUserName(null);
        console.log('Token validation failed - invalid token');
      }
    } catch (error: any) {
      console.error('Token validation error:', error);
      setIsAuthenticated(false);
      setUserName(null);
      
      // If it's a 401 or 403 error, the token is invalid/expired
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Token expired or invalid, clearing authentication state');
        // Clear any existing token cookies
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

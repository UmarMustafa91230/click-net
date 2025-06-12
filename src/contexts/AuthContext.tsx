import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, LoginCredentials, RegisterData } from '../types/auth';
import { authService } from '../services/authService';
import axios from 'axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const storedToken = localStorage.getItem('token');
        
        if (storedToken) {
          setToken(storedToken);
          try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
            setIsAdmin(userData.role === 'admin');
          } catch (err) {
            console.warn('Failed to get current user:', err);
          }
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        // Only clear token if it's an authentication error
        if (err instanceof Error && err.message.includes('authentication')) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAdmin(false);
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const { user: userData, token } = await authService.login(credentials);
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
      
      return userData;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Login failed');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during login.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const { user: userData, token } = await authService.adminLogin(credentials);
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userData);
      setIsAdmin(true);
      
      return userData; 
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Admin login failed');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during admin login.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const { user: userData, token } = await authService.register(data);
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userData);
      
      return userData;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Registration failed');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during registration.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    token,
    isAdmin,
    loading,
    error,
    login,
    adminLogin,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
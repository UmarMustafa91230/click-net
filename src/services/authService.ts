import axios from 'axios';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth';

// In a real implementation, this would be set in environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    const { _id, name, email, role, token } = response.data;
    return {
      user: { _id, name, email, role },
      token
    };
  },
  
  adminLogin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/admin/login', credentials);
    const { _id, name, email, role, token } = response.data;
    return {
      user: { _id, name, email, role },
      token
    };
  },
  
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    const { _id, name, email, role, token } = response.data;
    return {
      user: { _id, name, email, role },
      token
    };
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    // Optionally, you can call a logout endpoint if your backend supports it
  }
};
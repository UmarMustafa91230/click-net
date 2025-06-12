import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

export interface User {
  _id: string;
  name: string;
  email: string;
  balance: number;
  status: string;
  createdAt: string;
}

export interface Deposit {
  _id: string;
  user: User;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected';
  screenshot: string;
  createdAt: string;
  processedBy?: string;
  processedAt?: string;
  adminNote?: string;
}

export interface Withdrawal {
  _id: string;
  user: User;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedBy?: string;
  processedAt?: string;
  adminNote?: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalProfit: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
}

export const adminService = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Get all users with pagination and filters
  getUsers: async (params: {
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Get user details with their transactions
  getUserDetails: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Update user status
  updateUserStatus: async (userId: string, status: string) => {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  // Update user balance manually
  updateUserBalance: async (userId: string, data: { amount: number; type: 'add' | 'subtract'; note?: string }) => {
    const response = await api.post(`/admin/users/${userId}/balance`, data);
    return response.data;
  },

  // Get all deposits
  getDeposits: async (status?: string) => {
    const response = await api.get('/deposit/all', { params: { status } });
    return response.data;
  },

  // Get all withdrawals
  getWithdrawals: async (status?: string) => {
    const response = await api.get('/withdraw/all', { params: { status } });
    return response.data;
  },

  // Approve/Reject deposit
  processDeposit: async (depositId: string, data: { status: 'approved' | 'rejected'; adminNote?: string; approvedAmount?: number }) => {
    const response = await api.patch(`/deposit/${depositId}`, data);
    return response.data;
  },

  // Approve/Reject withdrawal
  processWithdrawal: async (withdrawalId: string, data: { status: 'approved' | 'rejected'; adminNote?: string }) => {
    const response = await api.patch(`/withdraw/${withdrawalId}`, data);
    return response.data;
  }
}; 
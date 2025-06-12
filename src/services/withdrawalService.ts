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

export const withdrawalService = {
  // Submit a withdrawal request
  submitWithdrawal: async (data: { amount: number; method: string; accountNumber: string; accountName: string }) => {
    const response = await api.post('/withdraw', data);
    return response.data;
  },

  // Get current user's withdrawals
  getMyWithdrawals: async () => {
    const response = await api.get('/withdraw/my-withdrawals');
    return response.data;
  },

  // Get all withdrawals (admin)
  getAllWithdrawals: async (status?: string) => {
    const url = status ? `/withdraw/all?status=${status}` : '/withdraw/all';
    const response = await api.get(url);
    return response.data;
  },
}; 
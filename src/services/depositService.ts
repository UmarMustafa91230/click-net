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

export const depositService = {
  // Submit a deposit (with screenshot upload)
  submitDeposit: async (data: { amount: number; method: string; screenshot: File }) => {
    const formData = new FormData();
    formData.append('amount', String(data.amount));
    formData.append('method', data.method);
    formData.append('screenshot', data.screenshot);
    const response = await api.post('/deposit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Get current user's deposits
  getMyDeposits: async () => {
    const response = await api.get('/deposit/my-deposits');
    return response.data;
  },

  // Get all deposits (admin)
  getAllDeposits: async (status?: string) => {
    const url = status ? `/deposit/all?status=${status}` : '/deposit/all';
    const response = await api.get(url);
    return response.data;
  },
}; 
import axios from 'axios';

export const fetchUserDashboardStats = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/dashboard-stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user dashboard stats:', error);
    console.error('Dashboard stats fetch error details:', error.message, error.response?.data);
    throw error;
  }
}; 
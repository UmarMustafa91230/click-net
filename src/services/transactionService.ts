import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const getMyTransactions = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/transaction/my-transactions`, config);
  return response.data;
};

const transactionService = {
  getMyTransactions,
};

export { transactionService }; 
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  PlusCircle,
  ArrowRightCircle,
  Loader,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { format } from 'date-fns';
import { transactionService } from '../../services/transactionService';
import { fetchUserDashboardStats } from '../../services/userService';
import { Transaction } from '../../types/auth';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [errorTransactions, setErrorTransactions] = useState<string | null>(null);
  
  // New state for dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    totalBalance: 0,
    monthlyProfit: 0,
    dailyProfit: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  // Fetch user transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      console.log('useEffect for fetching transactions is running.');
      console.log('Current token value:', token);
      if (!token) {
        setLoadingTransactions(false);
        setErrorTransactions('User not authenticated');
        console.log('No token found, skipping transaction fetch.');
        return;
      }
      try {
        setLoadingTransactions(true);
        const data = await transactionService.getMyTransactions(token);
        setTransactions(data.transactions);
        setErrorTransactions(null);
      } catch (error: any) {
        console.error('Error fetching transactions:', error);
        const errorMessage = (error as any).response?.data?.message || 'Failed to fetch transactions.';
        setErrorTransactions(errorMessage);
      } finally {
        setLoadingTransactions(false);
        console.log('Finished transaction fetch attempt.');
      }
    };

    fetchTransactions();
  }, [token]); // Refetch if token changes

  // Fetch user dashboard stats
  useEffect(() => {
    const getDashboardStats = async () => {
      console.log('useEffect for fetching dashboard stats is running.');
      setErrorStats(null); // Clear previous errors before fetching
      if (!token) {
        setLoadingStats(false);
        setErrorStats('User not authenticated');
        console.log('No token found, skipping stats fetch.');
        return;
      }
      try {
        setLoadingStats(true);
        const stats = await fetchUserDashboardStats();
        setDashboardStats(stats);
      } catch (error: any) {
        console.error('Error fetching dashboard stats:', error);
        const errorMessage = (error as any).response?.data?.message || 'Failed to fetch dashboard stats.';
        setErrorStats(errorMessage);
      } finally {
        setLoadingStats(false);
        console.log('Finished dashboard stats fetch attempt.');
      }
    };

    getDashboardStats();
  }, [token]); // Remove loadingStats from dependency array

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Welcome Header */}
          <motion.div
            className="mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user?.name}
            </h1>
            <p className="text-gray-600">
              This is your personal investment dashboard. Here's how your investments are performing.
            </p>
          </motion.div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Balance */}
            <motion.div
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Balance</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {loadingStats ? 'Loading...' : errorStats ? 'Error' : formatCurrency(dashboardStats.totalBalance)}
                  </h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-blue-800" />
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  to="/deposit" 
                  className="text-blue-800 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  Deposit Funds
                  <ArrowRightCircle className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
            
            {/* Monthly Profit */}
            <motion.div
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Monthly Profit</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {loadingStats ? 'Loading...' : errorStats ? 'Error' : formatCurrency(dashboardStats.monthlyProfit)}
                  </h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>30% of your investment</span>
              </div>
            </motion.div>
            
            {/* Daily Profit */}
            <motion.div
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Daily Profit</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {loadingStats ? 'Loading...' : errorStats ? 'Error' : formatCurrency(dashboardStats.dailyProfit)}
                  </h3>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <BarChart className="w-6 h-6 text-amber-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-amber-500">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Added to your balance daily</span>
              </div>
            </motion.div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              to="/deposit"
              className="flex-1 bg-blue-800 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center"
            >
              <PlusCircle className="mr-2 w-5 h-5" />
              Deposit Funds
            </Link>
            <Link
              to="/withdrawal"
              className="flex-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 py-3 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center"
            >
              <ArrowDownRight className="mr-2 w-5 h-5" />
              Request Withdrawal
            </Link>
          </div>
          
          {/* Recent Transactions */}
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loadingTransactions ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        <Loader className="animate-spin inline-block mr-2" size={20} /> Loading transactions...
                      </td>
                    </tr>
                  ) : errorTransactions ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-red-600">
                        Error loading transactions: {errorTransactions}
                      </td>
                    </tr>
                  ) : transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <tr key={transaction._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {transaction.type === 'deposit' && (
                              <div className="p-2 bg-blue-100 rounded-full mr-3">
                                <PlusCircle className="w-4 h-4 text-blue-800" />
                              </div>
                            )}
                            {transaction.type === 'profit' && (
                              <div className="p-2 bg-green-100 rounded-full mr-3">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                              </div>
                            )}
                            {transaction.type === 'withdraw' && (
                              <div className="p-2 bg-orange-100 rounded-full mr-3">
                                <ArrowDownRight className="w-4 h-4 text-orange-600" />
                              </div>
                            )}
                            {transaction.type === 'manual' && (
                              <div className="p-2 bg-gray-200 rounded-full mr-3">
                                <DollarSign className="w-4 h-4 text-gray-600" />
                              </div>
                            )}
                            <div className="text-sm font-medium text-gray-900 capitalize">
                              {transaction.type}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            transaction.type === 'withdraw' 
                              ? 'text-orange-600' 
                              : transaction.type === 'profit'
                                ? 'text-green-600'
                                : 'text-blue-800'
                          }`}>
                            {transaction.type === 'withdraw' ? '- ' : '+ '}
                            {formatCurrency(transaction.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : transaction.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : transaction.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(transaction.createdAt), 'MMM dd, yyyy')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No transactions yet. Start by making a deposit!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
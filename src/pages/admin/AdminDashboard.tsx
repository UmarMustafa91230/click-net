import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  AlertCircle, 
  Check, 
  Clock, 
  X, 
  Eye,
  ExternalLink,
  PlusCircle,
  MinusCircle,
  UserPlus,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { adminService, User, Deposit, Withdrawal, DashboardStats } from '../../services/adminService';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [pendingDeposits, setPendingDeposits] = useState<Deposit[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<Withdrawal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPendingDeposit, setSelectedPendingDeposit] = useState<Deposit | null>(null);
  const [selectedPendingWithdrawal, setSelectedPendingWithdrawal] = useState<Withdrawal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'deposit' | 'withdrawal' | 'balance' | 'proof' | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Stats
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalProfit: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    deposits: { totalAmount: 0, count: 0 },
    withdrawals: { totalAmount: 0, count: 0 },
    profits: { totalAmount: 0, count: 0 },
    users: { total: 0, active: 0 },
    recentTransactions: []
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, allDepositsData, allWithdrawalsData, pendingDepositsData, pendingWithdrawalsData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getUsers({}),
        adminService.getDeposits(),
        adminService.getWithdrawals(),
        adminService.getDeposits('pending'),
        adminService.getWithdrawals('pending')
      ]);

      setStats({
        ...statsData,
        pendingDeposits: statsData.pendingRequests?.deposits || 0,
        pendingWithdrawals: statsData.pendingRequests?.withdrawals || 0,
      });
      setUsers(usersData.users);
      setDeposits(allDepositsData);
      setWithdrawals(allWithdrawalsData);
      setPendingDeposits(pendingDepositsData);
      setPendingWithdrawals(pendingWithdrawalsData);

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load dashboard data';
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle approval/rejection of deposit
  const handleDepositAction = async (depositId: string, action: 'approve' | 'reject', approvedAmount?: number) => {
    try {
      // For approval, ensure approvedAmount is provided and valid
      if (action === 'approve' && (approvedAmount === undefined || approvedAmount <= 0)) {
         setErrorMessage('Please enter a valid approved amount for approval.');
         return; // Stop if invalid amount for approval
      }

      await adminService.processDeposit(depositId, {
        status: action === 'approve' ? 'approved' : 'rejected',
        adminNote: 'Processed by admin', // Example note
        approvedAmount: action === 'approve' ? approvedAmount : undefined
      });
      
      setSuccessMessage(`Deposit ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
      closeModal();
      fetchDashboardData(); // Refresh data
    } catch (error: any) {
      console.error('Error processing deposit:', error);
      const errorMessage = error.response?.data?.message || 'Failed to process deposit';
      setErrorMessage(errorMessage);
    }
  };
  
  // Handle approval/rejection of withdrawal
  const handleWithdrawalAction = async (withdrawalId: string, action: 'approve' | 'reject') => {
    try {
      await adminService.processWithdrawal(withdrawalId, {
        status: action === 'approve' ? 'approved' : 'rejected',
        adminNote: 'Processed by admin', // Example note
      });
      
      setSuccessMessage(`Withdrawal ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
      closeModal();
      fetchDashboardData(); // Refresh data
    } catch (error: any) {
      console.error('Error processing withdrawal:', error);
      const errorMessage = error.response?.data?.message || 'Failed to process withdrawal';
      setErrorMessage(errorMessage);
    }
  };
  
  // Handle manual balance update
  const handleBalanceUpdate = async (userId: string, newBalance: number) => {
    if (isNaN(newBalance) || newBalance < 0) {
      setErrorMessage('Please enter a valid balance amount.');
      return;
    }
    
    try {
      const currentUser = users.find(u => u._id === userId);
      if (!currentUser) {
        throw new Error('User not found');
      }

      const difference = newBalance - currentUser.balance;
      // Determine type based on difference, but the API expects 'add' or 'subtract'
      // Let's assume manual update is always an 'add' for simplicity or adjust API if needed.
      // For now, sticking to API contract: amount is positive, type is 'add' or 'subtract'

       // If difference is 0, no update needed
       if (difference === 0) {
           setSuccessMessage('Balance is already the same.');
           closeModal();
           return;
       }

      const type = difference > 0 ? 'add' : 'subtract';
      const amountToUpdate = Math.abs(difference);
      const note = 'Manual balance update by admin';
      
      await adminService.updateUserBalance(userId, {
        amount: amountToUpdate,
        type,
        note
      });
      
      setSuccessMessage('User balance updated successfully.');
      closeModal();
      fetchDashboardData(); // Refresh data
    } catch (error: any) {
      console.error('Error updating balance:', error);
       const errorMessage = error.response?.data?.message || 'Failed to update user balance';
      setErrorMessage(errorMessage);
    }
  };
  
  // Open modal with specific type and data (user, deposit, or withdrawal)
  // Adjusted to accept a union type for data
  const openModal = (type: 'deposit' | 'withdrawal' | 'balance' | 'proof', data: User | Deposit | Withdrawal) => {
    // Determine if data is a User, Deposit, or Withdrawal
    const isUser = (item: User | Deposit | Withdrawal): item is User => 'email' in item;
    const isDeposit = (item: User | Deposit | Withdrawal): item is Deposit => 'screenshot' in item;
    // const isWithdrawal = (item: User | Deposit | Withdrawal): item is Withdrawal => 'accountNumber' in item; // Withdrawal type doesn't have accountNumber in the fetched data interface currently

    if (isUser(data)) {
        setSelectedUser(data); // When modal is opened from Users table or for balance update
        setAmount(data.balance.toString());
        setSelectedPendingDeposit(null);
        setSelectedPendingWithdrawal(null);
    } else if (isDeposit(data)) {
         // When modal is opened from Pending Deposits/Withdrawals table
        setSelectedPendingDeposit(data);
        setSelectedUser(data.user); // Set the related user for context
        // We might want a separate state for selected deposit/withdrawal if showing full details
        // For now, we'll pass the deposit/withdrawal data via the modalType context and filter from state

        // Find the full deposit/withdrawal object from the respective state arrays
        const fullDeposit = deposits.find(d => d._id === (data as Deposit)._id);
        const fullWithdrawal = withdrawals.find(w => w._id === (data as Withdrawal)._id);

        if (fullDeposit) {
             // Set initial amount for deposit approval if needed, using the deposit amount
             setAmount(fullDeposit.amount.toString());
        } else if (fullWithdrawal) {
             // Set initial amount for withdrawal review, using the withdrawal amount
             setAmount(fullWithdrawal.amount.toString());
        }

    } else { // Assuming it's a Withdrawal if not a User or Deposit based on current types
         // When modal is opened from Pending Deposits/Withdrawals table
        setSelectedPendingWithdrawal(data as Withdrawal);
        setSelectedUser(data.user); // Set the related user for context
         const fullWithdrawal = withdrawals.find(w => w._id === (data as Withdrawal)._id);
         if (fullWithdrawal) {
             setAmount(fullWithdrawal.amount.toString());
         }
    }

    setModalType(type);
    setIsModalOpen(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setSelectedPendingDeposit(null);
    setSelectedPendingWithdrawal(null);
    setModalType(null);
    setAmount('');
    setErrorMessage(null);
    setSuccessMessage(null); // Clear messages on modal close
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Construct the base API URL for image display
  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Users */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.users?.total || 0}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Deposits */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Deposits</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.pendingDeposits || 0}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Withdrawals */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Withdrawals</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.pendingWithdrawals || 0}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total Deposits */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Deposits</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {formatCurrency(stats.deposits?.totalAmount || 0)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Requests Section */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
              <div className="bg-white shadow rounded-lg p-6">
                   <h2 className="text-lg font-medium text-gray-900 mb-4">Pending Requests</h2>

                   {/* Pending Deposits Table */}
                   <div className="mb-6">
                        <h3 className="text-md font-medium text-gray-800 mb-2">Pending Deposits ({pendingDeposits.length})</h3>
                        {pendingDeposits.length > 0 ? (
                             <div className="overflow-x-auto">
                                 <table className="min-w-full divide-y divide-gray-200">
                                      <thead className="bg-gray-50">
                                           <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                           </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-gray-200">
                                           {pendingDeposits.map(deposit => (
                                                <tr key={deposit._id}>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{deposit.user.name}</td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(deposit.amount)}</td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{deposit.method}</td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(deposit.createdAt), 'MMM d, yyyy HH:mm')}</td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                          <button
                                                               onClick={() => openModal('deposit', deposit)}
                                                               className="text-blue-600 hover:text-blue-900 mr-3"
                                                          >
                                                               Review
                                                          </button>
                                                     </td>
                                                </tr>
                                           ))}
                                      </tbody>
                                 </table>
                             </div>
                        ) : (
                             <p className="text-sm text-gray-600">No pending deposit requests.</p>
                        )}
                   </div>

                   {/* Pending Withdrawals Table */}
                    <div>
                        <h3 className="text-md font-medium text-gray-800 mb-2">Pending Withdrawals ({pendingWithdrawals.length})</h3>
                         {pendingWithdrawals.length > 0 ? (
                             <div className="overflow-x-auto">
                                 <table className="min-w-full divide-y divide-gray-200">
                                      <thead className="bg-gray-50">
                                           <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                           </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-gray-200">
                                           {pendingWithdrawals.map(withdrawal => (
                                                <tr key={withdrawal._id}>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{withdrawal.user.name}</td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(withdrawal.amount)}</td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{withdrawal.method}</td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(withdrawal.createdAt), 'MMM d, yyyy HH:mm')}</td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                          <button
                                                               onClick={() => openModal('withdrawal', withdrawal)}
                                                               className="text-blue-600 hover:text-blue-900 mr-3"
                                                          >
                                                               Review
                                                          </button>
                                                     </td>
                                                </tr>
                                           ))}
                                      </tbody>
                                 </table>
                             </div>
                         ) : (
                              <p className="text-sm text-gray-600">No pending withdrawal requests.</p>
                         )}
                    </div>
              </div>
          </div>
      </div>

      {/* Users Table */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Users</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(user.balance)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(user.createdAt), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openModal('balance', user)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Update Balance
                          </button>
                          <button
                            // For viewing details from Users table, still show overall user info
                            onClick={() => openModal('proof', user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
          {errorMessage}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (selectedUser || selectedPendingDeposit || selectedPendingWithdrawal) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {modalType === 'balance' ? 'Update Balance' : modalType === 'deposit' ? 'Review Deposit Request' : modalType === 'withdrawal' ? 'Review Withdrawal Request' : 'User Details'}
            </h3>
            
            {/* Content for Update Balance Modal */}
            {modalType === 'balance' && selectedUser && (
              <div>
                <label htmlFor="balance-input" className="block text-sm font-medium text-gray-700 mb-2">
                  New Balance
                </label>
                <input
                  id="balance-input"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new balance amount"
                />
                {errorMessage && (
                  <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
                )}
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleBalanceUpdate(selectedUser._id, parseFloat(amount))}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </div>
            )}
            
            {/* Content for User Details Modal (Proof type) */}
            {modalType === 'proof' && selectedUser && (
              <div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">User Information</h4>
                    <p className="mt-1 text-sm text-gray-900">Name: {selectedUser.name}</p>
                    <p className="mt-1 text-sm text-gray-900">Email: {selectedUser.email}</p>
                    <p className="mt-1 text-sm text-gray-900">Balance: {formatCurrency(selectedUser.balance)}</p>
                    <p className="mt-1 text-sm text-gray-900">Status: {selectedUser.status}</p>
                  </div>
                  
                   {/* Display recent deposits/withdrawals for this user */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Recent Deposits</h4>
                    {deposits
                      .filter(d => d.user._id === selectedUser._id)
                      .slice(0, 3) // Show only recent 3
                      .map(deposit => (
                        <div key={deposit._id} className="mt-2 p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-900">Amount: {formatCurrency(deposit.amount)}</p>
                          <p className="text-sm text-gray-500">Status: {deposit.status}</p>
                          <p className="text-sm text-gray-500">Date: {format(new Date(deposit.createdAt), 'MMM d, yyyy')}</p>
                           {/* Display payment proof if available and it's a deposit */}
                           {deposit.screenshot && deposit.status !== 'rejected' && (
                               <div className="mt-2">
                                   <p className="text-sm font-medium text-gray-700 mb-1">Payment Proof:</p>
                                   {/* Assuming backend serves screenshots from /uploads, adjust path as needed */}
                                   <img src={`${API_BASE_URL}/${deposit.screenshot}`} alt="Payment Proof" className="max-w-full h-auto rounded" />
                               </div>
                           )}
                        </div>
                      ))}
                         {deposits.filter(d => d.user._id === selectedUser._id).length === 0 && (
                              <p className="text-sm text-gray-600">No recent deposits.</p>
                         )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Recent Withdrawals</h4>
                    {withdrawals
                      .filter(w => w.user._id === selectedUser._id)
                       .slice(0, 3) // Show only recent 3
                      .map(withdrawal => (
                        <div key={withdrawal._id} className="mt-2 p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-900">Amount: {formatCurrency(withdrawal.amount)}</p>
                          <p className="text-sm text-gray-500">Status: {withdrawal.status}</p>
                          <p className="text-sm text-gray-500">Date: {format(new Date(withdrawal.createdAt), 'MMM d, yyyy')}</p>
                        </div>
                      ))}
                        {withdrawals.filter(w => w.user._id === selectedUser._id).length === 0 && (
                              <p className="text-sm text-gray-600">No recent withdrawals.</p>
                         )}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

             {/* Modal for Reviewing Pending Deposit */}
             {modalType === 'deposit' && selectedPendingDeposit && (
                 <div>
                     <h4 className="text-sm font-medium text-gray-700 mb-2">Deposit Details</h4>
                     
                         <div>
                             <p className="text-sm text-gray-900">User: {selectedPendingDeposit.user.name}</p>
                             <p className="text-sm text-gray-900">Amount: {formatCurrency(selectedPendingDeposit.amount || 0)}</p>
                             <p className="text-sm text-gray-900">Method: {selectedPendingDeposit.method}</p>
                             <p className="text-sm text-gray-900">Date: {format(new Date(selectedPendingDeposit.createdAt), 'MMM d, yyyy HH:mm')}</p>

                             {/* Display payment proof */}
                             {selectedPendingDeposit.screenshot && (
                                 <div className="mt-4">
                                      <p className="text-sm font-medium text-gray-700 mb-1">Payment Proof:</p>
                                      {/* Assuming backend serves screenshots from /uploads, adjust path as needed */}
                                      <img src={`${API_BASE_URL}/${selectedPendingDeposit.screenshot}`} alt="Payment Proof" className="max-w-full h-auto rounded" />
                                 </div>
                             )}
                             
                              {/* Input for Approved Amount when approving deposit */}
                              <div className="mt-4">
                                 <label htmlFor="approvedAmount" className="block text-sm font-medium text-gray-700 mb-2">Approved Amount</label>
                                 <input
                                     id="approvedAmount"
                                     type="number"
                                     value={amount} // Use the amount state for input
                                     onChange={(e) => setAmount(e.target.value)}
                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                     placeholder="Enter approved amount"
                                 />
                              </div>

                             <div className="mt-4 flex justify-end space-x-3">
                                  <button
                                       onClick={closeModal}
                                       className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                  >
                                       Cancel
                                  </button>
                                  <button
                                       // Use the selectedPendingDeposit._id for the action
                                       onClick={() => handleDepositAction(selectedPendingDeposit._id, 'approve', parseFloat(amount))}
                                       className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                  >
                                       Approve
                                  </button>
                                   <button
                                        // Use the selectedPendingDeposit._id for the action
                                       onClick={() => handleDepositAction(selectedPendingDeposit._id, 'reject')}
                                       className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                   >
                                       Reject
                                   </button>
                             </div>
                         </div>

                 </div>
             )}

             {/* Modal for Reviewing Pending Withdrawal */}
             {modalType === 'withdrawal' && selectedPendingWithdrawal && (
                  <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Withdrawal Details</h4>
                       
                           <div>
                               <p className="text-sm text-gray-900">User: {selectedPendingWithdrawal.user.name}</p>
                               <p className="text-sm text-gray-900">Amount: {formatCurrency(selectedPendingWithdrawal.amount || 0)}</p>
                               <p className="text-sm text-gray-900">Method: {selectedPendingWithdrawal.method}</p>
                                {/* Note: Account number/name might be sensitive and not included in the default withdrawal list. Fetch user details or specific withdrawal details if needed. */}
                              <p className="text-sm text-gray-900">Date: {format(new Date(selectedPendingWithdrawal.createdAt), 'MMM d, yyyy HH:mm')}</p>

                              <div className="mt-4 flex justify-end space-x-3">
                                   <button
                                        onClick={closeModal}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                   >
                                        Cancel
                                   </button>
                                   <button
                                        // Use the selectedPendingWithdrawal._id for the action
                                        onClick={() => handleWithdrawalAction(selectedPendingWithdrawal._id, 'approve')}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                   >
                                        Approve
                                   </button>
                                    <button
                                         // Use the selectedPendingWithdrawal._id for the action
                                        onClick={() => handleWithdrawalAction(selectedPendingWithdrawal._id, 'reject')}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                              </div>
                          </div>

                  </div>
             )}

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
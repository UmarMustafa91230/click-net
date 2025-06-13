import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  Check, 
  Clock, 
  DollarSign, 
  ArrowDownRight,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { format, addMonths } from 'date-fns';
import { withdrawalService } from '../../services/withdrawalService';

const Withdrawal = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState<string>('');
  const [withdrawalMethod, setWithdrawalMethod] = useState<string>('easypaisa');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [eligibilityDate, setEligibilityDate] = useState<Date | null>(null);
  
  const navigate = useNavigate();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Check eligibility for withdrawal
  useEffect(() => {
    // In a real implementation, this would be determined by the deposit date
    // For demo purposes, we'll set a mock deposit date
    const mockDepositDate = new Date(2023, 2, 15); // March 15, 2023
    const withdrawalEligibilityDate = addMonths(mockDepositDate, 1);
    setEligibilityDate(withdrawalEligibilityDate);
    
    // Check if current date is after eligibility date
    const isAfterEligibilityDate = new Date() > withdrawalEligibilityDate;
    setIsEligible(isAfterEligibilityDate);
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (parseFloat(amount) > (user?.balance || 0)) {
      setError('Withdrawal amount cannot exceed your available balance');
      return;
    }
    
    if (!withdrawalMethod) {
      setError('Please select a withdrawal method');
      return;
    }
    
    if (!accountNumber) {
      setError('Please enter your account number');
      return;
    }
    
    if (!accountName) {
      setError('Please enter your account name');
      return;
    }
    
    if (!isEligible) {
      setError('You are not yet eligible for withdrawal');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Call the withdrawal service to submit the request
      await withdrawalService.submitWithdrawal({
        amount: parseFloat(amount),
        method: withdrawalMethod,
        accountNumber,
        accountName
      });
      
      // Show success message
      setSuccess('Your withdrawal request has been submitted successfully. It will be processed by our admin team shortly.');
      
      // Reset form after delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err: any) {
       const errorMessage = err.response?.data?.message || 'Failed to submit withdrawal request. Please try again.';
       setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-6 bg-gray-800 text-white">
              <h1 className="text-2xl font-bold">Withdraw Your Profit</h1>
              <p className="mt-1 text-gray-300">Request a withdrawal from your investment account</p>
            </div>
            
            {/* Eligibility Status */}
            {!isEligible && eligibilityDate && (
              <motion.div 
                className="m-6 p-4 bg-amber-50 border-l-4 border-amber-500 flex items-start"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <Clock className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800 font-medium">Withdrawal Not Available Yet</p>
                  <p className="text-sm text-amber-700">
                    You can request a withdrawal after {format(eligibilityDate, 'MMMM d, yyyy')} (1 month after your deposit).
                  </p>
                </div>
              </motion.div>
            )}
            
            {/* Success Message */}
            {success && (
              <motion.div 
                className="m-6 p-4 bg-green-50 border-l-4 border-green-500 flex items-start"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <p className="text-sm text-green-700">{success}</p>
              </motion.div>
            )}
            
            {/* Error Message */}
            {error && (
              <motion.div 
                className="m-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-start"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="p-6">
              {/* Account Balance */}
              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">Available Balance</span>
                    <div className="text-xl font-bold text-gray-900">{formatCurrency(user?.balance || 0)}</div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-blue-800" />
                  </div>
                </div>
                
                {isEligible ? (
                  <div className="mt-2 flex items-center text-sm text-green-600">
                    <Check className="w-4 h-4 mr-1" />
                    <span>You are eligible to request a withdrawal</span>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center text-sm text-amber-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Withdrawal available after 1 month of deposit</span>
                  </div>
                )}
              </div>
              
              {/* Withdrawal Amount */}
              <div className="mb-6">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Withdrawal Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">PKR</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="100"
                    max={user?.balance || undefined}
                    placeholder="1000"
                    className="pl-12 pr-4 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-800 focus:border-blue-800"
                    disabled={!isEligible || isSubmitting || !!success}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Minimum withdrawal: PKR 100
                </p>
              </div>
              
              {/* Withdrawal Method */}
              <div className="mb-6">
                <label htmlFor="withdrawalMethod" className="block text-sm font-medium text-gray-700 mb-1">
                  Withdrawal Method
                </label>
                <select
                  id="withdrawalMethod"
                  name="withdrawalMethod"
                  value={withdrawalMethod}
                  onChange={(e) => setWithdrawalMethod(e.target.value)}
                  className="py-3 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-800 focus:border-blue-800"
                  disabled={!isEligible || isSubmitting || !!success}
                >
                  <option value="easypaisa">Easypaisa</option>
                  <option value="jazzcash">JazzCash</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
              
              {/* Account Information */}
              <div className="mb-8 space-y-4">
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    {withdrawalMethod === 'bank' ? 'Account Number' : 'Mobile Number'}
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder={withdrawalMethod === 'bank' ? 'Enter your account number' : 'e.g., 03XX-XXXXXXX'}
                    className="px-4 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-800 focus:border-blue-800"
                    disabled={!isEligible || isSubmitting || !!success}
                  />
                </div>
                <div>
                  <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    id="accountName"
                    name="accountName"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Enter your account name"
                    className="px-4 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-800 focus:border-blue-800"
                    disabled={!isEligible || isSubmitting || !!success}
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isEligible && !isSubmitting && !success
                    ? 'bg-blue-800 hover:bg-blue-700 focus:ring-blue-800'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!isEligible || isSubmitting || !!success}
              >
                {isSubmitting ? 'Processing...' : 'Request Withdrawal'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Withdrawal;
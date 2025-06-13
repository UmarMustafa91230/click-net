import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  Check, 
  AlertCircle, 
  Smartphone, 
  CreditCard, 
  Bitcoin
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { depositService } from '../../services/depositService';

type PaymentMethod = 'easypaisa' | 'jazzcash' | 'binance';

const paymentDetails = {
  easypaisa: {
    number: '0311-1234567',
    name: 'ClickNet Investments'
  },
  jazzcash: {
    number: '0300-7654321',
    name: 'ClickNet Finance'
  },
  binance: {
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    memo: 'ClickNet-Deposit'
  }
};

const Deposit = () => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  
  // Handle file drop
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: 5242880, // 5MB
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploadedFile(file);
        
        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        
        // Clear any previous errors
        setError(null);
      }
    },
    onDropRejected: fileRejections => {
      const rejection = fileRejections[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setError('File is too large. Maximum size is 5MB.');
      } else {
        setError('Please upload a valid image file (JPG, JPEG, PNG).');
      }
    }
  });
  
  // Handle method selection
  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setError(null);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!uploadedFile) {
      setError('Please upload a proof of payment');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Call the deposit service to submit the deposit
      await depositService.submitDeposit({
        amount: parseFloat(amount),
        method: selectedMethod,
        screenshot: uploadedFile,
      });
      
      // Show success message
      setSuccess('Your deposit request has been submitted successfully. It will be reviewed by our admin team shortly.');
      
      // Reset form after delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to submit deposit request. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up preview URL
  useState(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-6 bg-blue-800 text-white">
              <h1 className="text-2xl font-bold">Deposit Funds</h1>
              <p className="mt-1 text-blue-100">Choose your preferred payment method and follow the instructions</p>
            </div>
            
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
              {/* Step 1: Choose Payment Method */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">1. Choose Your Deposit Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => handleMethodSelect('easypaisa')}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-colors ${
                      selectedMethod === 'easypaisa'
                        ? 'border-blue-800 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-800 hover:bg-blue-50'
                    }`}
                  >
                    <div className={`p-3 rounded-full mb-2 ${
                      selectedMethod === 'easypaisa' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Smartphone className={`w-6 h-6 ${
                        selectedMethod === 'easypaisa' ? 'text-blue-800' : 'text-gray-500'
                      }`} />
                    </div>
                    <span className={`font-medium ${
                      selectedMethod === 'easypaisa' ? 'text-blue-800' : 'text-gray-700'
                    }`}>
                      Easypaisa
                    </span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleMethodSelect('jazzcash')}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-colors ${
                      selectedMethod === 'jazzcash'
                        ? 'border-blue-800 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-800 hover:bg-blue-50'
                    }`}
                  >
                    <div className={`p-3 rounded-full mb-2 ${
                      selectedMethod === 'jazzcash' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <CreditCard className={`w-6 h-6 ${
                        selectedMethod === 'jazzcash' ? 'text-blue-800' : 'text-gray-500'
                      }`} />
                    </div>
                    <span className={`font-medium ${
                      selectedMethod === 'jazzcash' ? 'text-blue-800' : 'text-gray-700'
                    }`}>
                      JazzCash
                    </span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleMethodSelect('binance')}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-colors ${
                      selectedMethod === 'binance'
                        ? 'border-blue-800 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-800 hover:bg-blue-50'
                    }`}
                  >
                    <div className={`p-3 rounded-full mb-2 ${
                      selectedMethod === 'binance' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Bitcoin className={`w-6 h-6 ${
                        selectedMethod === 'binance' ? 'text-blue-800' : 'text-gray-500'
                      }`} />
                    </div>
                    <span className={`font-medium ${
                      selectedMethod === 'binance' ? 'text-blue-800' : 'text-gray-700'
                    }`}>
                      Binance
                    </span>
                  </button>
                </div>
              </div>
              
              {/* Step 2: Enter Amount */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">2. Enter Deposit Amount</h2>
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
                    placeholder="5000"
                    className="pl-12 pr-4 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-800 focus:border-blue-800"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Minimum deposit amount: PKR 100
                </p>
              </div>
              
              {/* Step 3: Payment Instructions */}
              {selectedMethod && (
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-semibold mb-4">3. Send Payment</h2>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {selectedMethod === 'easypaisa' && (
                      <div>
                        <p className="mb-2">Send payment to the following Easypaisa account:</p>
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between p-2 bg-white rounded border border-gray-200">
                            <span className="text-gray-600">Account Number:</span>
                            <span className="font-medium">{paymentDetails.easypaisa.number}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-white rounded border border-gray-200">
                            <span className="text-gray-600">Account Name:</span>
                            <span className="font-medium">{paymentDetails.easypaisa.name}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedMethod === 'jazzcash' && (
                      <div>
                        <p className="mb-2">Send payment to the following JazzCash account:</p>
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between p-2 bg-white rounded border border-gray-200">
                            <span className="text-gray-600">Account Number:</span>
                            <span className="font-medium">{paymentDetails.jazzcash.number}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-white rounded border border-gray-200">
                            <span className="text-gray-600">Account Name:</span>
                            <span className="font-medium">{paymentDetails.jazzcash.name}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedMethod === 'binance' && (
                      <div>
                        <p className="mb-2">Send payment to the following Binance wallet:</p>
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between p-2 bg-white rounded border border-gray-200">
                            <span className="text-gray-600">Wallet Address:</span>
                            <span className="font-medium text-xs sm:text-sm break-all">{paymentDetails.binance.address}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-white rounded border border-gray-200">
                            <span className="text-gray-600">Memo (Important):</span>
                            <span className="font-medium">{paymentDetails.binance.memo}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <p className="mt-4 text-sm text-gray-600">
                      After sending the payment, take a screenshot of the payment confirmation for verification.
                    </p>
                  </div>
                </motion.div>
              )}
              
              {/* Step 4: Upload Proof */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">4. Upload Payment Proof</h2>
                <div {...getRootProps()} className="cursor-pointer">
                  <input {...getInputProps()} />
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    previewUrl ? 'border-blue-800 bg-blue-50' : 'border-gray-300 hover:border-blue-800 hover:bg-blue-50'
                  }`}>
                    {previewUrl ? (
                      <div>
                        <img 
                          src={previewUrl} 
                          alt="Payment proof" 
                          className="mx-auto h-48 object-contain mb-2" 
                        />
                        <p className="text-sm text-blue-800 font-medium">
                          {uploadedFile?.name} ({Math.round(uploadedFile?.size / 1024)} KB)
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Click or drag to replace this image
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-gray-700 font-medium">
                          Drag & drop your payment proof here
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          or click to browse files (JPG, PNG, max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !!success}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                    isSubmitting || success
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-800 hover:bg-blue-700'
                  } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2`}
                >
                  {isSubmitting ? 'Submitting...' : success ? 'Submitted' : 'Submit Deposit Request'}
                </button>
                
                <p className="mt-4 text-sm text-gray-600 text-center">
                  Your deposit will be reviewed by our admin team and reflected in your balance once approved.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Deposit;
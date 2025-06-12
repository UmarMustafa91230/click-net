import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign, BarChart3, Shield, Clock } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Home = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            {/* Hero Content */}
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to ClickNet – Your Smart Investment Partner
              </h1>
              <p className="text-xl mb-6 text-blue-100">
                We offer monthly returns up to 30% on your investments.
                Start your journey towards financial freedom with us today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register" 
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  Start Investing Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link 
                  to="/investment-plans" 
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  View Investment Plans
                </Link>
              </div>
            </motion.div>
            
            {/* Hero Image/Card */}
            <motion.div 
              className="md:w-1/2 md:pl-12"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white p-8 rounded-xl shadow-xl text-gray-800">
                <h3 className="text-2xl font-bold mb-6 text-blue-800">Investment Highlights</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <DollarSign className="w-6 h-6 text-blue-800" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Up to 30% Monthly Returns</h4>
                      <p className="text-gray-600">Maximize your investment with our competitive rates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                      <BarChart3 className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Daily Profit Distribution</h4>
                      <p className="text-gray-600">Watch your earnings grow day by day</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-3 rounded-full mr-4">
                      <Clock className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Short 1-Month Lock Period</h4>
                      <p className="text-gray-600">Withdraw your funds after just one month</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose ClickNet?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform offers a seamless investment experience with features designed to maximize your returns while keeping your funds secure.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Feature 1 */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              variants={fadeIn}
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <DollarSign className="w-8 h-8 text-blue-800" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Easy Deposit Methods</h3>
              <p className="text-gray-600">
                Multiple convenient options including Easypaisa, JazzCash, and Binance. Start with any amount that suits your investment goals.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              variants={fadeIn}
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Daily Profit Tracking</h3>
              <p className="text-gray-600">
                Track your investment growth daily. Our transparent system shows your earnings in real-time on your personal dashboard.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              variants={fadeIn}
            >
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Secure & Transparent</h3>
              <p className="text-gray-600">
                Your investments are protected with our secure platform. We maintain full transparency with detailed reporting on all transactions.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-800 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Investment Journey?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of investors who trust ClickNet for their financial growth. Start with any amount and watch your money grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
              >
                Create Your Account
              </Link>
              <Link 
                to="/investment-plans" 
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-800 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
              >
                Explore Investment Plans
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
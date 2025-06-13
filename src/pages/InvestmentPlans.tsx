import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const InvestmentPlans = () => {
  const plans = [
    {
      name: 'Starter',
      minAmount: 1000,
      maxAmount: 10000,
      monthlyReturn: 25,
      features: [
        'Daily profit distribution',
        'Withdraw after 1 month',
        'Basic support',
        'Investment dashboard'
      ]
    },
    {
      name: 'Growth',
      minAmount: 10000,
      maxAmount: 50000,
      monthlyReturn: 28,
      features: [
        'Daily profit distribution',
        'Withdraw after 1 month',
        'Priority support',
        'Investment dashboard',
        'Monthly investment reports'
      ]
    },
    {
      name: 'Premium',
      minAmount: 50000,
      maxAmount: 500000,
      monthlyReturn: 30,
      features: [
        'Daily profit distribution',
        'Withdraw after 1 month',
        'VIP support',
        'Investment dashboard',
        'Monthly investment reports',
        'Personal investment advisor'
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-800 text-white py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Choose Your Investment Plan
              </h1>
              <p className="text-xl text-blue-100">
                Start your investment journey with our flexible plans designed to meet your financial goals.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-blue-800">
                        {plan.monthlyReturn}%
                      </span>
                      <span className="text-gray-600 ml-2">monthly return</span>
                    </div>
                    <div className="mb-6">
                      <div className="text-gray-600">
                        Min Investment: {plan.minAmount.toLocaleString()} PKR
                      </div>
                      <div className="text-gray-600">
                        Max Investment: {plan.maxAmount.toLocaleString()} PKR
                      </div>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <Check className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/register"
                      className="block w-full bg-blue-800 hover:bg-blue-700 text-white text-center py-3 rounded-lg transition-colors"
                    >
                      Start Investing
                      <ArrowRight className="inline-block ml-2 w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold mb-8">Why Invest with ClickNet?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold mb-3">Daily Profits</h3>
                  <p className="text-gray-600">
                    Watch your investment grow every day with our daily profit distribution system.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold mb-3">Flexible Terms</h3>
                  <p className="text-gray-600">
                    Start withdrawing your profits after just one month of investment.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold mb-3">Secure Platform</h3>
                  <p className="text-gray-600">
                    Your investments are protected with our state-of-the-art security measures.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold mb-3">Expert Support</h3>
                  <p className="text-gray-600">
                    Get assistance from our dedicated team of investment professionals.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-center mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-bold mb-2">
                    How are the returns generated?
                  </h3>
                  <p className="text-gray-600">
                    Our expert team manages investments across various sectors to generate consistent returns for our investors.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-bold mb-2">
                    When can I withdraw my profits?
                  </h3>
                  <p className="text-gray-600">
                    You can request withdrawals after completing one month of investment. Profits are distributed daily to your account.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-bold mb-2">
                    Is my investment secure?
                  </h3>
                  <p className="text-gray-600">
                    Yes, we implement strict security measures and maintain transparency in all our operations to protect your investments.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-800 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold mb-6">
                Start Your Investment Journey Today
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of successful investors and start growing your wealth with ClickNet.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center bg-white text-blue-800 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Create Your Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default InvestmentPlans;
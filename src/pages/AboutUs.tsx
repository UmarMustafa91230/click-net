import { motion } from 'framer-motion';
import { Shield, Users, TrendingUp, Award } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const AboutUs = () => {
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
                About ClickNet Investment
              </h1>
              <p className="text-xl text-blue-100">
                Your trusted partner in financial growth since 2023. We provide secure investment opportunities with attractive returns.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-800" />
                </div>
                <h3 className="text-xl font-bold mb-2">Security</h3>
                <p className="text-gray-600">
                  Your investments are protected with state-of-the-art security measures.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Growth</h3>
                <p className="text-gray-600">
                  Consistent monthly returns of up to 30% on your investments.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p className="text-gray-600">
                  Join thousands of successful investors in our growing community.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Excellence</h3>
                <p className="text-gray-600">
                  Committed to providing the best investment experience.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
              <div className="bg-white p-8 rounded-xl shadow-md">
                <p className="text-gray-600 mb-6">
                  Founded in 2023, ClickNet Investment emerged from a vision to make profitable investing accessible to everyone. Our platform combines cutting-edge technology with financial expertise to deliver consistent returns to our investors.
                </p>
                <p className="text-gray-600 mb-6">
                  We believe in transparency, security, and sustainable growth. Our team of financial experts carefully manages investments to ensure optimal returns while maintaining the highest standards of security and compliance.
                </p>
                <p className="text-gray-600">
                  Today, we serve thousands of investors across Pakistan, helping them achieve their financial goals through our innovative investment platform.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-blue-800 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            >
              <div>
                <div className="text-4xl font-bold mb-2">5000+</div>
                <div className="text-blue-200">Active Investors</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">$10M+</div>
                <div className="text-blue-200">Total Investments</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">30%</div>
                <div className="text-blue-200">Monthly Returns</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Meet the experts behind ClickNet Investment. Our team brings together decades of experience in finance, technology, and investment management.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold">Ahmed Khan</h3>
                <p className="text-gray-600">CEO & Founder</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold">Sarah Ali</h3>
                <p className="text-gray-600">Chief Investment Officer</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold">Imran Malik</h3>
                <p className="text-gray-600">Head of Technology</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
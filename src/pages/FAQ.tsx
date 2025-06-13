import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const faqItems: FAQItem[] = [
    {
      category: 'general',
      question: 'What is ClickNet Investment?',
      answer: 'ClickNet Investment is a trusted investment platform that offers up to 30% monthly returns on investments. We provide a secure and transparent way to grow your wealth through various investment plans.'
    },
    {
      category: 'general',
      question: 'How does ClickNet generate returns?',
      answer: 'Our expert team manages investments across various sectors and markets to generate consistent returns. We utilize diverse investment strategies to maintain stable profitability while managing risk.'
    },
    {
      category: 'investment',
      question: 'What is the minimum investment amount?',
      answer: 'The minimum investment amount starts at PKR 1,000 for our Starter Plan. Different plans have different minimum investment requirements to suit various investor needs.'
    },
    {
      category: 'investment',
      question: 'How long is the investment period?',
      answer: 'The minimum investment period is 1 month. After this period, you can withdraw your profits or continue investing to compound your returns.'
    },
    {
      category: 'profits',
      question: 'How are profits calculated and distributed?',
      answer: 'Profits are calculated based on your investment amount and plan (25-30% monthly). They are distributed daily to your account and can be withdrawn after the initial 1-month period.'
    },
    {
      category: 'profits',
      question: 'When can I withdraw my profits?',
      answer: 'You can withdraw your profits after completing the initial 1-month investment period. Withdrawal requests are processed within 24-48 hours.'
    },
    {
      category: 'security',
      question: 'How secure is my investment?',
      answer: 'We implement strict security measures to protect your investments. Our platform uses advanced encryption, and all transactions are carefully monitored and verified.'
    },
    {
      category: 'security',
      question: 'What happens if I forget my password?',
      answer: 'You can easily reset your password through the login page using your registered email address. We have a secure password recovery process in place.'
    },
    {
      category: 'support',
      question: 'How can I contact customer support?',
      answer: 'Our customer support team is available 24/7. You can reach us through email at support@clicknet.com or call us at +92 311 234 5678.'
    },
    {
      category: 'support',
      question: 'What if I have issues with my withdrawal?',
      answer: 'If you experience any issues with withdrawals, please contact our support team immediately. We aim to resolve all withdrawal-related queries within 24 hours.'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'general', name: 'General' },
    { id: 'investment', name: 'Investment' },
    { id: 'profits', name: 'Profits' },
    { id: 'security', name: 'Security' },
    { id: 'support', name: 'Support' }
  ];

  const filteredFAQs = activeCategory === 'all'
    ? faqItems
    : faqItems.filter(item => item.category === activeCategory);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

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
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-blue-100">
                Find answers to common questions about ClickNet Investment
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-800 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Items */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                    >
                      <span className="font-medium text-gray-900">
                        {faq.question}
                      </span>
                      {activeIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-blue-800" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {activeIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200"
                        >
                          <div className="px-6 py-4 text-gray-600">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold mb-4">
                Still have questions?
              </h2>
              <p className="text-gray-600 mb-8">
                Can't find the answer you're looking for? Our team is here to help.
              </p>
              <a
                href="/contact"
                className="inline-block bg-blue-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
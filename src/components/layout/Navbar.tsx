import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown, BarChart, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Track scroll position to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-blue-800" />
            <span className="text-2xl font-bold text-blue-800">ClickNet</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-800' 
                  : 'text-gray-700 hover:text-blue-800'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-blue-800' 
                  : 'text-gray-700 hover:text-blue-800'
              }`}
            >
              About Us
            </Link>
            <Link 
              to="/investment-plans" 
              className={`text-sm font-medium transition-colors ${
                isActive('/investment-plans') 
                  ? 'text-blue-800' 
                  : 'text-gray-700 hover:text-blue-800'
              }`}
            >
              Investment Plans
            </Link>
            <Link
              to="/instructions"
              className={`text-sm font-medium transition-colors ${
                isActive('/instructions')
                  ? 'text-blue-800'
                  : 'text-gray-700 hover:text-blue-800'
              }`}
            >
              Instructions
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm font-medium transition-colors ${
                isActive('/contact') 
                  ? 'text-blue-800' 
                  : 'text-gray-700 hover:text-blue-800'
              }`}
            >
              Contact Us
            </Link>
            <Link 
              to="/faq" 
              className={`text-sm font-medium transition-colors ${
                isActive('/faq') 
                  ? 'text-blue-800' 
                  : 'text-gray-700 hover:text-blue-800'
              }`}
            >
              FAQs
            </Link>
          </div>

          {/* Auth Buttons or Dashboard Link */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  className="flex items-center space-x-1 text-white bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <BarChart className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-800 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-blue-800 hover:text-blue-700 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-800 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-white shadow-lg py-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link
              to="/"
              className={`text-sm font-medium py-2 ${
                isActive('/') ? 'text-blue-800' : 'text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium py-2 ${
                isActive('/about') ? 'text-blue-800' : 'text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/investment-plans"
              className={`text-sm font-medium py-2 ${
                isActive('/investment-plans') ? 'text-blue-800' : 'text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Investment Plans
            </Link>
            <Link
              to="/instructions"
              className={`text-sm font-medium py-2 ${
                isActive('/instructions') ? 'text-blue-800' : 'text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Instructions
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium py-2 ${
                isActive('/contact') ? 'text-blue-800' : 'text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Link
              to="/faq"
              className={`text-sm font-medium py-2 ${
                isActive('/faq') ? 'text-blue-800' : 'text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              FAQs
            </Link>

            <div className="pt-2 border-t border-gray-200">
              {user ? (
                <>
                  <Link
                    to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                    className="block text-sm font-medium py-2 text-blue-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-sm font-medium py-2 text-gray-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-sm font-medium py-2 text-blue-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-sm font-medium py-2 text-blue-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
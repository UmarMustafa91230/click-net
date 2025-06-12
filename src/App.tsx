import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/user/Dashboard';
import DepositPage from './pages/user/Deposit';
import WithdrawalPage from './pages/user/Withdrawal';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AboutUs from './pages/AboutUs';
import InvestmentPlans from './pages/InvestmentPlans';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';
import Instructions from './pages/Instructions';

function App() {
  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/investment-plans" element={<InvestmentPlans />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* New Instructions Page */}
          <Route path="/instructions" element={<Instructions />} />

          {/* Protected User Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/deposit" 
            element={
              <ProtectedRoute>
                <DepositPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/withdrawal" 
            element={
              <ProtectedRoute>
                <WithdrawalPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;
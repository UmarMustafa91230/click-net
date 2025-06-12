// src/types/auth.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  balance?: number; // Make optional based on where it's used
  monthlyProfit?: number; // Make optional
  dailyProfit?: number; // Make optional
  status?: string; // Make optional
  createdAt: string; // Assuming createdAt is part of the user
  // Add other user properties as needed
}

// Define a Transaction interface based on backend structure
export interface Transaction {
    _id: string;
    user: string | { _id: string; name: string; email?: string }; // Can be user ID string or populated User object
    type: 'deposit' | 'withdraw' | 'profit' | 'manual';
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    createdAt: string;
    updatedAt?: string; // Assuming Mongoose timestamps
    reference?: string; // ObjectId of related deposit/withdrawal
    referenceModel?: 'Deposit' | 'Withdrawal';
    description?: string; // Optional description
    balance?: number; // User's balance after the transaction (optional, depending on backend populate)
    processedBy?: string | { _id: string; name: string }; // Can be user ID string or populated User object
    processedAt?: string;
    adminNote?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  adminLogin: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  // Add other registration fields if necessary
}

// Add types for Deposit and Withdrawal if they are used directly in context or dashboard (optional)
export interface Deposit {
  _id: string;
  user: string | User; // Can be user ID string or populated User object
  amount: number;
  method: string;
  screenshot: string; // path to the screenshot
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedAt?: string;
  processedBy?: string | User; // Can be user ID string or populated User object
  adminNote?: string;
}

export interface Withdrawal {
    _id: string;
    user: string | User; // Can be user ID string or populated User object
    amount: number;
    method: string;
    accountDetails: string; // or a more structured type
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    processedAt?: string;
    processedBy?: string | User; // Can be user ID string or populated User object
    adminNote?: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalProfit: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  deposits: { totalAmount: number; count: number };
  withdrawals: { totalAmount: number; count: number };
  profits: { totalAmount: number; count: number };
  users: { total: number; active: number };
  recentTransactions: Transaction[]; // Use the defined Transaction interface
}

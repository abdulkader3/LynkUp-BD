export interface User {
  id: string;
  email: string;
  name: string;
  role: 'merchant' | 'admin';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  price: number;
  commission: number;
  stock: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  offerId: string;
  offerName: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  customerPhone?: string;
}

export interface Wallet {
  balance: number;
  pendingBalance: number;
  totalEarnings: number;
  totalSpent: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  createdAt: string;
  referenceId?: string;
}

export interface Commission {
  id: string;
  orderId: string;
  amount: number;
  rate: number;
  createdAt: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  activeOffers: number;
  walletBalance: number;
}

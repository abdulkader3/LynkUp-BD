export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'operator' | 'merchant';
  phone?: string;
  active?: boolean;
  permissions?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  success: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: string;
}

export interface Offer {
  _id: string;
  operator: string;
  category: string;
  packageName: string;
  packageCode: string;
  description?: string;
  price: number;
  costPrice: number;
  commission: number;
  commissionType?: 'flat' | 'percentage';
  validity?: string;
  dataQuota?: string;
  voiceQuota?: string;
  smsQuota?: string;
  isActive: boolean;
  isFeatured?: boolean;
  displayOrder?: number;
  terms?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Order {
  _id: string;
  user: string;
  offer: Offer;
  offerId: string;
  quantity: number;
  totalPrice: number;
  status:
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'reversed'
    | 'refunded';
  paymentMethod: 'wallet' | 'online' | 'card';
  customerPhone: string;
  operatorResponse?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Wallet {
  _id: string;
  user: string;
  balance: number;
  pendingBalance: number;
  totalEarnings: number;
  totalSpent: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Transaction {
  _id: string;
  wallet: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  referenceId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Commission {
  _id: string;
  order: string;
  merchant: string;
  amount: number;
  rate: number;
  createdAt: string;
}

export interface DashboardStats {
  walletBalance: number;
  availableBalance: number;
  blockedBalance: number;
  todaySales: {
    amount: number;
    count: number;
    growth: number;
  };
  monthSales: {
    amount: number;
    count: number;
  };
  commissionEarned: number;
  pendingOrders: number;
  lastTransactions: DashboardTransaction[];
}

export interface DashboardTransaction {
  reference: string;
  type: 'credit' | 'debit';
  subtype: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

export interface OfferPerformance {
  topOffers: {
    offerId: string;
    packageName: string;
    operator: string;
    category: string;
    totalOrders: number;
    totalAmount: number;
    totalCommission: number;
  }[];
  dailyStats: {
    date: string;
    orders: number;
    amount: number;
  }[];
}

export interface NextSettlement {
  nextSettlementDate: string;
  estimatedAmount: number;
  lastSettlementDate: string;
  lastSettlementAmount: number;
  pendingAmount: number;
  eligible: boolean;
}

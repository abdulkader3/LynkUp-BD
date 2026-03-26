import { API_BASE_URL } from '../config';
import type {
  AuthResponse,
  LoginCredentials,
  SignupData,
  Offer,
  Order,
  Wallet,
  Transaction,
  Commission,
  DashboardStats,
} from '../types';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `Error ${response.status}`);
    }

    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOffers(): Promise<Offer[]> {
    return this.request<Offer[]>('/offers');
  }

  async getOfferById(id: string): Promise<Offer> {
    return this.request<Offer>(`/offers/${id}`);
  }

  async buyOffer(
    offerId: string,
    quantity: number,
    customerPhone: string,
  ): Promise<Order> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify({ offerId, quantity, customerPhone }),
    });
  }

  async getOrders(): Promise<Order[]> {
    return this.request<Order[]>('/orders');
  }

  async getWallet(): Promise<Wallet> {
    return this.request<Wallet>('/wallet');
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.request<Transaction[]>('/wallet/transactions');
  }

  async getCommissions(): Promise<Commission[]> {
    return this.request<Commission[]>('/merchants/commissions');
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/merchants/dashboard');
  }

  async getMe(): Promise<{
    user: { id: string; email: string; name: string; role: string };
  }> {
    return this.request('/auth/me', { method: 'GET' });
  }
}

export const apiClient = new ApiClient();

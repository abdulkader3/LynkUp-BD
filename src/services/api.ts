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
  OfferPerformance,
  NextSettlement,
  PaginatedResponse,
  User,
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

    console.log(
      'API Request:',
      options.method || 'GET',
      `${API_BASE_URL}${endpoint}`,
    );
    console.log('Request body:', options.body);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Request failed',
        statusCode: response.status,
      }));
      console.log('Error response:', error);
      throw new Error(error.message || `Error ${response.status}`);
    }

    const json = await response.json();
    console.log('Response JSON:', JSON.stringify(json).substring(0, 200));

    if (!json.success && json.statusCode >= 400) {
      throw new Error(json.message || 'Request failed');
    }

    return json.data as T;
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

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async getOffers(page = 1, limit = 20): Promise<PaginatedResponse<Offer>> {
    return this.request<PaginatedResponse<Offer>>(
      `/offers?page=${page}&limit=${limit}`,
    );
  }

  async getActiveOffers(
    operator?: string,
    category?: string,
  ): Promise<Offer[]> {
    let url = '/offers/active';
    const params = new URLSearchParams();
    if (operator) params.append('operator', operator);
    if (category) params.append('category', category);
    if (params.toString()) url += `?${params.toString()}`;
    return this.request<Offer[]>(url);
  }

  async getOfferById(id: string): Promise<Offer> {
    return this.request<Offer>(`/offers/${id}`);
  }

  async buyOffer(
    offerId: string,
    phoneNumber: string,
    paymentMethod: string = 'wallet',
    idempotencyKey?: string,
  ): Promise<Order> {
    const body: Record<string, unknown> = {
      offerId,
      phoneNumber,
      paymentMethod,
    };
    if (idempotencyKey) body.idempotencyKey = idempotencyKey;

    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async getMyOrders(page = 1, limit = 20): Promise<PaginatedResponse<Order>> {
    return this.request<PaginatedResponse<Order>>(
      `/orders/my-orders?page=${page}&limit=${limit}`,
    );
  }

  async getOrderById(id: string): Promise<Order> {
    return this.request<Order>(`/orders/my-orders/${id}`);
  }

  async getWallet(): Promise<Wallet> {
    return this.request<Wallet>('/wallet/my-wallet');
  }

  async getTransactions(
    page = 1,
    limit = 20,
  ): Promise<PaginatedResponse<Transaction>> {
    return this.request<PaginatedResponse<Transaction>>(
      `/wallet/my-ledger?page=${page}&limit=${limit}`,
    );
  }

  async getCommissions(
    page = 1,
    limit = 20,
  ): Promise<PaginatedResponse<Commission>> {
    return this.request<PaginatedResponse<Commission>>(
      `/merchants/commissions?page=${page}&limit=${limit}`,
    );
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/dashboard/my-stats');
  }

  async getOfferPerformance(): Promise<OfferPerformance> {
    return this.request<OfferPerformance>('/dashboard/my-offer-performance');
  }

  async getNextSettlement(): Promise<NextSettlement> {
    return this.request<NextSettlement>('/dashboard/my-next-settlement');
  }
}

export const apiClient = new ApiClient();

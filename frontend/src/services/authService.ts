import { apiRequest } from './api';

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  wallet_address: string;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

export interface LoginPayload {
  username_or_email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  role?: string;
  wallet_address?: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  public async login(payload: LoginPayload): Promise<TokenResponse> {
    const response = await apiRequest<TokenResponse, LoginPayload>({
      endpoint: '/api/v1/auth/login',
      method: 'POST',
      body: payload,
    });

    this.saveSession(response.access_token, response.user);
    return response;
  }

  public async register(payload: RegisterPayload): Promise<TokenResponse> {
    const response = await apiRequest<TokenResponse, RegisterPayload>({
      endpoint: '/api/v1/auth/register',
      method: 'POST',
      body: payload,
    });

    this.saveSession(response.access_token, response.user);
    return response;
  }

  public async getMe(): Promise<UserResponse> {
    const token = this.getToken();
    return await apiRequest<UserResponse>({
      endpoint: '/api/v1/auth/me',
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  public saveSession(token: string, user: UserResponse): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('auth-change'));
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    window.dispatchEvent(new Event('auth-change'));
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public getUser(): UserResponse | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as UserResponse;
    } catch {
      return null;
    }
  }

  public isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }
}

export const authService = new AuthService();

import BaseService from './base-service';
import type { LoginRequest, LoginResponse, User } from 'app/components/core/_models';
import { setCookie, getCookie, deleteCookie, debugCookies } from 'app/utils/cookie';

class AuthService extends BaseService {
  private TOKEN_KEY = 'auth_token';

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const { data } = await this._axios.post<LoginResponse>('/auth/login', credentials);

      // Store token in cookie
      if (data.accessToken) {
        setCookie(this.TOKEN_KEY, data.accessToken, 7);
        
        // Debug: Check if cookie was set
        setTimeout(() => {
          const savedToken = getCookie(this.TOKEN_KEY);
          debugCookies();
        }, 100);
      } else {
        console.error('No accessToken in login response');
      }
      
      return data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const { data } = await this._axios.get<User>('/auth/me');
      return data;
    } catch (error: any) {
      this.clearToken();
      throw new Error(error.response?.data?.message || 'Failed to get current user');
    }
  }

  logout(): void {
    this.clearToken();
    
    // Clear any other localStorage/sessionStorage items if needed
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('auth_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  getToken(): string | undefined {
    return getCookie(this.TOKEN_KEY);
  }

  clearToken(): void {
    deleteCookie(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export individual functions for backward compatibility
export const login = (credentials: LoginRequest) => authService.login(credentials);
export const validateToken = () => authService.getCurrentUser();
export const logout = () => authService.logout();
export const getToken = () => authService.getToken();
export const clearToken = () => authService.clearToken();
export const isAuthenticated = () => authService.isAuthenticated();

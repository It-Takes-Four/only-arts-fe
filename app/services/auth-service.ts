import BaseService from './base-service';
import type { User, ApiError } from 'app/components/core/_models';
import type { LoginRequest, LoginResponse } from 'app/pages/login/core';
import type { RegisterRequest, RegisterResponse } from 'app/pages/register/core';
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
      const apiError = error.response?.data as ApiError;
      const errorMessage = Array.isArray(apiError?.message) 
        ? apiError.message.join(', ') 
        : apiError?.message || 'Login failed';
      throw new Error(errorMessage);
    }
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const { data } = await this._axios.post<RegisterResponse>('/auth/register', userData);
      
      //console.log('Register response received:', data);
      
      // Store token in cookie
      if (data.accessToken) {
        //console.log('Setting auth token cookie after registration:', data.accessToken.substring(0, 20) + '...');
        setCookie(this.TOKEN_KEY, data.accessToken, 7);
        
        // Debug: Check if cookie was set
        setTimeout(() => {
          const savedToken = getCookie(this.TOKEN_KEY);
          //console.log('Cookie verification after register - Saved token:', savedToken ? 'Found' : 'Not found');
          debugCookies();
        }, 100);
      } else {
        console.error('No accessToken in register response');
      }
      
      return data;
    } catch (error: any) {
      console.error('Register error:', error);
      const apiError = error.response?.data as ApiError;
      const errorMessage = Array.isArray(apiError?.message) 
        ? apiError.message.join(', ') 
        : apiError?.message || 'Registration failed';
      throw new Error(errorMessage);
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
    //console.log('AuthService logout called');
    
    // Clear the auth token cookie
    this.clearToken();
    
    // Clear any other localStorage/sessionStorage items if needed
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('auth_')) {
          //console.log('Clearing localStorage key:', key);
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
    
    //console.log('AuthService logout completed');
  }

  getToken(): string | undefined {
    const token = getCookie(this.TOKEN_KEY);
    // Return undefined if token is empty or falsy
    return token && token.trim() ? token : undefined;
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
export const register = (userData: RegisterRequest) => authService.register(userData);
export const validateToken = () => authService.getCurrentUser();
export const logout = () => authService.logout();
export const getToken = () => authService.getToken();
export const clearToken = () => authService.clearToken();
export const isAuthenticated = () => authService.isAuthenticated();

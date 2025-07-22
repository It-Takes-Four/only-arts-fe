import type { LoginRequest, LoginResponse, User } from 'app/components/core/_models';
import axios from 'axios';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'celestview_token';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    const { data } = await axios.post<LoginResponse>(
      `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
      credentials
    );
    
    // Store token in cookie
    Cookies.set(TOKEN_KEY, data.access_token, { 
      expires: 7, // 7 days
      secure: false, // Allow non-HTTPS in development
      sameSite: 'lax' // More permissive for development
    });
    
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('An unexpected error occurred');
  }
}

export async function validateToken(): Promise<User> {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const { data } = await axios.get<User>(
      `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return data;
  } catch (error) {
    // Clear invalid token
    clearToken();
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Token validation failed');
    }
    throw new Error('An unexpected error occurred');
  }
}

export function logout(): void {
  clearToken();
  
  // Clear any other localStorage/sessionStorage items if needed
  try {
    // Clear any cached data from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('celestview_') || key.includes('auth')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function clearToken(): void {
  Cookies.remove(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// Axios interceptor to add token to requests
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios interceptor to handle 401 responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      // The auth context will handle redirecting to login
    }
    return Promise.reject(error);
  }
);

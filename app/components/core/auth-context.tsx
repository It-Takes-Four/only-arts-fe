import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import type { User } from './_models';
import type { RegisterRequest } from 'app/pages/register/core';
import { useAuth } from '../hooks/useAuth';

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => void;
  loginAsync: (credentials: { email: string; password: string }) => Promise<any>;
  isLoggingIn: boolean;
  loginError: Error | null;
  register: (userData: RegisterRequest) => void;
  registerAsync: (userData: RegisterRequest) => Promise<any>;
  isRegistering: boolean;
  registerError: Error | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated && location.pathname !== '/login') {
      if (!auth.user) {
        // navigate('/login', { replace: true });
      }
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user, location.pathname, navigate]);

  const handleLogout = () => {
    auth.logout();
    // Use navigate for SPA navigation
    navigate('/login', { replace: true });
  };

  const contextValue: AuthContextType = {
    user: auth.user,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    login: auth.login,
    loginAsync: auth.loginAsync,
    isLoggingIn: auth.isLoggingIn,
    loginError: auth.loginError,
    register: auth.register,
    registerAsync: auth.registerAsync,
    isRegistering: auth.isRegistering,
    registerError: auth.registerError,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

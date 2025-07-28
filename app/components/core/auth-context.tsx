import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import type { User } from './_models';
import type { RegisterRequest } from 'app/pages/register/core';
import { useAuth } from '../hooks/useAuth';

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  login: (credentials: { email: string; password: string }) => void;
  loginAsync: (credentials: { email: string; password: string }) => Promise<any>;
  isLoggingIn: boolean;
  loginError: Error | null;
  register: (userData: RegisterRequest) => void;
  registerAsync: (userData: RegisterRequest) => Promise<any>;
  isRegistering: boolean;
  registerError: Error | null;
  refreshUser: () => Promise<User>;
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Don't redirect during logout process
    if (isLoggingOut) return;
    
    // Handle authentication state changes
    if (!auth.isLoading) {
      if (!auth.isAuthenticated && !auth.user) {
        // User is not authenticated
        const protectedRoutes = ['/', '/profile', '/settings', '/become-artist'];
        const isProtectedRoute = protectedRoutes.includes(location.pathname);
        
        if (isProtectedRoute) {
          console.log('AuthProvider: Redirecting unauthenticated user from protected route:', location.pathname);
          navigate('/login', { 
            replace: true,
            state: { from: location.pathname }
          });
        }
      }
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user, location.pathname, navigate, isLoggingOut]);

  const handleLogout = () => {
    console.log('AuthProvider: handleLogout called');
    setIsLoggingOut(true);
    
    // Clear auth state first
    auth.logout();
    
    // Force navigate to login page, clearing any navigation state
    console.log('AuthProvider: Navigating to login');
    navigate('/login', { 
      replace: true,
      state: {} // Clear any previous state
    });
    
    // Keep logout state longer to prevent redirect conflicts
    setTimeout(() => {
      console.log('AuthProvider: Resetting isLoggingOut state');
      setIsLoggingOut(false);
    }, 2000); // Increased from 500ms to 2 seconds
  };

  const contextValue: AuthContextType = {
    user: auth.user,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    isLoggingOut,
    login: auth.login,
    loginAsync: auth.loginAsync,
    isLoggingIn: auth.isLoggingIn,
    loginError: auth.loginError,
    register: auth.register,
    registerAsync: auth.registerAsync,
    isRegistering: auth.isRegistering,
    registerError: auth.registerError,
    refreshUser: auth.refreshUser,
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

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login as loginService, register as registerService, validateToken, logout as logoutService, getToken } from 'app/services/auth-service';
import { useEffect, useState } from 'react';

export function useAuth() {
  const queryClient = useQueryClient();
  const [isClient, setIsClient] = useState(false);
  const [forceDisableQuery, setForceDisableQuery] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Query to validate current authentication status - only if token exists and we're on client-side
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: validateToken,
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized) or 403 (forbidden)
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isClient && !!getToken() && !forceDisableQuery && !isLoggedOut, // Also disable if logged out
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: true, // Always refetch on mount to verify current user
    refetchInterval: false, // Don't auto-refresh
  });

  // Log auth state for debugging
  useEffect(() => {
    if (isClient) {
      console.log('Auth Debug:', {
        user,
        isLoading,
        error,
        hasToken: !!getToken(),
        isAuthenticated: !!user
      });
    }
  }, [user, isLoading, error, isClient]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginService,
    onSuccess: async (data) => {
      try {
        // Reset logged out state on successful login
        setIsLoggedOut(false);
        setForceDisableQuery(false);
        
        const userData = await validateToken();
        queryClient.setQueryData(['auth', 'user'], userData);
        // Immediately refresh the auth query to trigger re-render
        queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      } catch (error) {
        console.error('Failed to fetch user data after login:', error);
      }
    },
    onError: (error) => {
      console.error('Login mutation error:', error);
      // Clear any cached user data on login error
      queryClient.setQueryData(['auth', 'user'], null);
    }
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: registerService,
    onSuccess: async (data) => {
      console.log('Register mutation successful, data:', data);
      
      // Reset logged out state on successful registration
      setIsLoggedOut(false);
      setForceDisableQuery(false);
      
      // After successful registration, fetch user data
      try {
        console.log('Fetching user data after registration...');
        const userData = await validateToken();
        console.log('User data fetched:', userData);
        queryClient.setQueryData(['auth', 'user'], userData);
        // Immediately refresh the auth query to trigger re-render
        queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      } catch (error) {
        console.error('Failed to fetch user data after registration:', error);
      }
    },
    onError: (error) => {
      console.error('Register mutation error:', error);
      // Clear any cached user data on register error
      queryClient.setQueryData(['auth', 'user'], null);
    }
  });

  // Logout function
  const logout = () => {
    console.log('Logout called - clearing auth state');
    
    // Set logged out state immediately to prevent query from running
    setIsLoggedOut(true);
    setForceDisableQuery(true);
    
    // Cancel any ongoing queries
    queryClient.cancelQueries({ queryKey: ['auth', 'user'] });
    
    // Clear token from cookies first
    logoutService(); 
    
    // Immediately clear user data from cache
    queryClient.setQueryData(['auth', 'user'], null);
    queryClient.setQueryData(['auth', 'user'], undefined);
    
    // Aggressively clear all auth-related cache
    queryClient.removeQueries({ queryKey: ['auth'] });
    queryClient.invalidateQueries({ 
      queryKey: ['auth'], 
      refetchType: 'none',
      exact: false 
    });
    
    // Clear all cached data to prevent any state persistence
    queryClient.clear();
    
    console.log('Auth state cleared after logout');
    
    // Keep query disabled for longer to ensure clean logout
    setTimeout(() => {
      setForceDisableQuery(false);
      setIsLoggedOut(false);
      console.log('Query re-enabled after logout');
    }, 3000); // Increased from 1 second to 3 seconds
  };

  return {
    user: isLoggedOut ? null : user, // Force null if logged out
    isLoading: isLoggedOut ? false : isLoading, // Don't show loading if logged out
    isAuthenticated: isLoggedOut ? false : !!user, // Force false if logged out
    error,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout,
  };
}

export function useAuthValidation() {
  return useQuery({
    queryKey: ['auth', 'validate'],
    queryFn: validateToken,
    retry: false,
    staleTime: 0, // Always check
  });
}

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

  // Check if we have a token synchronously for immediate auth state
  const hasToken = isClient ? !!getToken() : false;

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
    enabled: isClient && hasToken && !forceDisableQuery && !isLoggedOut,
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: true, // Always refetch on mount to verify current user
    refetchInterval: false, // Don't auto-refresh
  });

  // Determine if we're still in the initial loading state
  const isInitialLoading = !isClient || (isClient && hasToken && isLoading && !user && !error);

  // Log auth state for debugging
  useEffect(() => {
    if (isClient) {
      console.log('Auth Debug:', {
        user,
        isLoading,
        isInitialLoading,
        error,
        hasToken: !!getToken(),
        isAuthenticated: !!user,
        isLoggedOut,
        forceDisableQuery,
        queryEnabled: isClient && !!getToken() && !forceDisableQuery && !isLoggedOut
      });
    }
  }, [user, isLoading, isInitialLoading, error, isClient, isLoggedOut, forceDisableQuery]);

  // Reset logout state (for when user tries to login again)
  const resetLogoutState = () => {
    console.log('Resetting logout state for fresh authentication');
    setIsLoggedOut(false);
    setForceDisableQuery(false);
  };

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginService,
    onSuccess: async (data) => {
      try {
        console.log('Login successful, refreshing user data with enhanced validation...');
        // Reset logout state before refreshing user data
        resetLogoutState();
        // Use the internal helper for user refresh
        await performUserRefresh();
        console.log('User data successfully refreshed after login');
      } catch (error) {
        console.error('Failed to refresh user data after login:', error);
      }
    },
    onMutate: () => {
      // Reset logout state when login starts
      resetLogoutState();
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
      
      try {
        console.log('Registration successful, refreshing user data with enhanced validation...');
        // Reset logout state before refreshing user data
        resetLogoutState();
        // Use the internal helper for user refresh
        await performUserRefresh();
        console.log('User data successfully refreshed after registration');
      } catch (error) {
        console.error('Failed to refresh user data after registration:', error);
      }
    },
    onMutate: () => {
      // Reset logout state when registration starts
      resetLogoutState();
    },
    onError: (error) => {
      console.error('Register mutation error:', error);
      // Clear any cached user data on register error
      queryClient.setQueryData(['auth', 'user'], null);
    }
  });

  // Refresh user data function
  const refreshUser = async () => {
    try {
      console.log('Refreshing user data...');
      const userData = await validateToken();
      console.log('User data refreshed:', userData);
      queryClient.setQueryData(['auth', 'user'], userData);
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      return userData;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      throw error;
    }
  };

  // Enhanced refresh user with cookie validation and redirect
  const refreshUserWithValidation = async () => {
    try {
      console.log('Starting enhanced user refresh with validation...');
      
      // First, check if auth token exists in cookies
      const token = getToken();
      console.log('Auth token check:', token ? 'Found' : 'Not found');
      
      if (!token) {
        console.log('No auth token found, clearing user state and redirecting to login');
        
        // Clear user state immediately
        setIsLoggedOut(true);
        setForceDisableQuery(true);
        queryClient.setQueryData(['auth', 'user'], null);
        queryClient.removeQueries({ queryKey: ['auth'] });
        
        // Return null to indicate no user and that redirect should happen
        return null;
      }
      
      // Token exists, try to fetch user data
      console.log('Token found, fetching user data from /me endpoint...');
      const userData = await validateToken();
      console.log('User data successfully fetched:', userData);
      
      // Reset any logout states since we have valid data
      resetLogoutState();
      
      // Update the cache with fresh user data
      queryClient.setQueryData(['auth', 'user'], userData);
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      
      return userData;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      
      // If the API call failed (likely due to invalid token), clear everything
      console.log('API call failed, clearing user state');
      setIsLoggedOut(true);
      setForceDisableQuery(true);
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.removeQueries({ queryKey: ['auth'] });
      
      // Clear the invalid token
      logoutService();
      
      throw error;
    }
  };

  // Internal helper function for login/register success
  const performUserRefresh = async () => {
    try {
      console.log('Performing internal user refresh...');
      
      // Check if auth token exists in cookies first
      const token = getToken();
      if (!token) {
        console.error('No auth token found after login/register - this should not happen');
        return;
      }
      
      // Token exists, fetch user data
      const userData = await validateToken();
      console.log('User data refreshed internally:', userData);
      
      // Reset any logout states
      resetLogoutState();
      
      // Update the cache with fresh user data
      queryClient.setQueryData(['auth', 'user'], userData);
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      
      return userData;
    } catch (error) {
      console.error('Internal user refresh failed:', error);
      throw error;
    }
  };

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
    
    // Keep logged out state permanently until manual reset
    // Don't automatically re-enable queries to prevent logout bounce-back
    console.log('Logout state will remain disabled to prevent re-authentication');
  };

  return {
    user: isLoggedOut ? null : user, // Force null if logged out
    isLoading: isLoggedOut ? false : isInitialLoading, // Use the more accurate loading state
    isAuthenticated: isLoggedOut ? false : (hasToken && !!user), // Force false if logged out, true if we have token and user
    error,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    refreshUser,
    refreshUserWithValidation,
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

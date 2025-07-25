import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login as loginService, register as registerService, validateToken, logout as logoutService, getToken } from 'app/services/auth-service';
import { useEffect, useState } from 'react';

export function useAuth() {
  const queryClient = useQueryClient();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Query to validate current authentication status - only if token exists and we're on client-side
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: validateToken,
    retry: false, // Don't retry on 401
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isClient && !!getToken(), // Only run on client-side if token exists
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginService,
    onSuccess: async (data) => {
      try {
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
    logoutService();
    queryClient.setQueryData(['auth', 'user'], null);
    queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    queryClient.clear(); // Clear all cached data
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
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

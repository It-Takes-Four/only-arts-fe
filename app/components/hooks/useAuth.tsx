import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login as loginService, validateToken, logout as logoutService } from 'app/services/auth-service';


export function useAuth() {
  const queryClient = useQueryClient();

  // Query to validate current authentication status
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: validateToken,
    retry: false, // Don't retry on 401
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginService,
    onSuccess: async (data) => {
      // After successful login, fetch user data
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
      console.error('Login error:', error);
      // Clear any cached user data on login error
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

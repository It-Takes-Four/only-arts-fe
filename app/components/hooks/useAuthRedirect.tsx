import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../core/auth-context';

/**
 * Hook to redirect users to login if they're not authenticated
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isAuthenticated, isLoading };
}

/**
 * Hook to redirect authenticated users away from login page
 */
export function useRedirectIfAuthenticated() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isAuthenticated, isLoading };
}

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuthContext } from './auth-context';
import { Loading } from '../common/loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login', 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      // Store the current location to redirect back after login
      const returnTo = location.pathname + location.search;
      navigate(redirectTo, { 
        replace: true,
        state: { from: returnTo }
      });
    }
  }, [isLoading, isAuthenticated, requireAuth, navigate, redirectTo, location]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  // If authentication is required but user is not authenticated, don't render children
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If user is authenticated but we're checking for a valid user object
  if (requireAuth && isAuthenticated && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Component for routes that should only be accessible to unauthenticated users
 * (like login/register pages)
 */
export function PublicOnlyRoute({ 
  children, 
  redirectTo = '/' 
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { isLoading, isAuthenticated, user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('PublicOnlyRoute Debug:', {
      isLoading,
      isAuthenticated,
      user: !!user,
      redirectTo
    });

    if (!isLoading && isAuthenticated && user) {
      console.log('PublicOnlyRoute: Redirecting authenticated user to', redirectTo);
      navigate(redirectTo, { replace: true });
    }
  }, [isLoading, isAuthenticated, user, navigate, redirectTo]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  // If user is authenticated, don't render children (will redirect)
  if (isAuthenticated && user) {
    return null;
  }

  return <>{children}</>;
}

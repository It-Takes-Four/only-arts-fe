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
  const { isLoading, isAuthenticated, user, isLoggingOut } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while loading or during logout process
    if (isLoading || isLoggingOut) return;

    if (requireAuth && !isAuthenticated) {
      console.log('ProtectedRoute: Redirecting unauthenticated user to', redirectTo);
      // Store the current location to redirect back after login
      const returnTo = location.pathname + location.search;
      navigate(redirectTo, { 
        replace: true,
        state: { from: returnTo }
      });
    }
  }, [isLoading, isAuthenticated, requireAuth, navigate, redirectTo, location, isLoggingOut]);

  // Show loading spinner while checking authentication or during logout
  if (isLoading || isLoggingOut) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  // If authentication is required but user is not authenticated, don't render children
  // But don't check this during logout process as AuthProvider handles it
  if (requireAuth && !isAuthenticated && !isLoggingOut) {
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

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
  redirectTo = '/landing', 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, user, isLoggingOut } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while loading or during logout process
    if (isLoading || isLoggingOut) return;

    // Only handle redirects for protected routes that require auth
    if (requireAuth) {
      const publicRoutes = ['/login', '/register', '/landing'];
      const isPublicRoute = publicRoutes.includes(location.pathname);
      
      // If we're on a public route, don't redirect
      if (isPublicRoute) return;
      
      // If not authenticated and not on a public route, redirect to landing
      // But add a small delay to ensure authentication state is fully resolved
      if (!isAuthenticated || !user) {
        console.log('ProtectedRoute: Redirecting unauthenticated user to', redirectTo);
        const returnTo = location.pathname + location.search;
        
        // Use setTimeout to avoid redirect during React render cycle
        setTimeout(() => {
          navigate(redirectTo, { 
            replace: true,
            state: { from: returnTo }
          });
        }, 0);
      }
    }
  }, [isLoading, isAuthenticated, user, requireAuth, navigate, redirectTo, location, isLoggingOut]);

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
  const location = useLocation();

  useEffect(() => {
    console.log('PublicOnlyRoute Debug:', {
      isLoading,
      isAuthenticated,
      user: !!user,
      redirectTo,
      locationState: location.state,
      pathname: location.pathname
    });

    // Only redirect if user is authenticated and we're on a public-only route
    // But don't redirect if we're already in the process of navigating
    if (!isLoading && isAuthenticated && user) {
      // Check if there's a 'from' location in the state (where user was trying to go)
      const intendedDestination = location.state?.from || redirectTo;
      
      // Don't redirect if we're already where we need to be
      if (location.pathname !== intendedDestination) {
        console.log('PublicOnlyRoute: Redirecting authenticated user from', location.pathname, 'to', intendedDestination);
        navigate(intendedDestination, { replace: true, state: {} });
      }
    }
  }, [isLoading, isAuthenticated, user, navigate, redirectTo, location]);

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

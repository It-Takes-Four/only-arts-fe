import { useAuthContext } from './auth-context';
import { Loading } from '../common/loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated } = useAuthContext();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    // The AuthProvider will handle redirecting to login
    return null;
  }

  return <>{children}</>;
}

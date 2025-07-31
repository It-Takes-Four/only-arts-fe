import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "app/components/core/auth-context";
import { Loading } from "app/components/common/loading";

export function meta() {
  return [
    { title: "OnlyArts" },
    { name: "description", content: "OnlyArts - Where Artists Create Magic" },
  ];
}

export default function RootIndex() {
  const { isLoading, isAuthenticated, user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // User is logged in, redirect to home
        navigate('/home', { replace: true });
      } else {
        // User is not logged in, redirect to landing
        navigate('/landing', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  // Show loading while determining where to redirect
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loading />
    </div>
  );
}

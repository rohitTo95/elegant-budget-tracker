import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean; // true = requires authentication, false = requires no authentication
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = "/login", 
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <div className="text-xl font-semibold text-gray-700">Verifying token...</div>
            <div className="text-sm text-gray-500">Please wait while we validate your authentication</div>
          </div>
        </div>
      </div>
    );
  }

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to={redirectTo} replace />;
  }

  // If route requires no authentication (login/signup pages) and user is authenticated
  if (!requireAuth && isAuthenticated) {
    console.log('User already authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // User has correct authentication status for this route
  return <>{children}</>;
};

export default ProtectedRoute;

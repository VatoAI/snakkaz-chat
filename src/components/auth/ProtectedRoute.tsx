
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/authentication";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  redirectTo = "/login"  // Changed from "/auth" to "/login"
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log('🔒 ProtectedRoute: Checking access...', { user, loading, redirectTo });

  useEffect(() => {
    if (!loading && !user) {
      console.log('🚫 ProtectedRoute: No user, redirecting to:', redirectTo);
      navigate(redirectTo, { replace: true });
    } else if (!loading && user) {
      console.log('✅ ProtectedRoute: User authenticated, allowing access');
    }
  }, [user, loading, navigate, redirectTo]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-cyberdark-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-cybergold-500" />
          <p className="text-cybergold-400 text-lg">Sjekker innlogging...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will be redirected by the useEffect
  }

  return <>{children}</>;
};

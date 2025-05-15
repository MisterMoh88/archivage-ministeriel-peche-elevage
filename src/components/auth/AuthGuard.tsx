
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    console.log("AuthGuard checking auth state:", { user: !!user, isLoading });
    
    // Un court délai pour éviter les redirections flash dues à des états intermédiaires
    const timeoutId = setTimeout(() => {
      if (!isLoading && !user) {
        console.log("No authenticated user, redirecting to login");
        navigate("/login", { replace: true });
      }
      setIsCheckingAuth(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [user, isLoading, navigate]);

  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ministry-blue"></div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
};

export default AuthGuard;

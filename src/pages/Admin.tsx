
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Admin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        // Vérifier le rôle dans la table profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Erreur lors de la vérification du rôle:", error);
          toast.error("Impossible de vérifier vos droits d'accès");
          setIsAdmin(false);
        } else {
          setIsAdmin(data.role === 'admin');
        }
      } catch (error) {
        console.error("Erreur inattendue:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminStatus();
  }, [user]);

  if (isLoading) {
    return (
      <div className="page-container flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ministry-blue"></div>
      </div>
    );
  }

  if (!isAdmin) {
    toast.error("Vous n'avez pas les droits d'accès à cette page");
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-container">
      <h1 className="section-title">Administration du système</h1>
      <AdminTabs />
    </div>
  );
}

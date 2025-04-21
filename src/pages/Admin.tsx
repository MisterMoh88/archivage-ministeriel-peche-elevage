
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { AdminTabs } from "@/components/admin/AdminTabs";

export default function Admin() {
  const { user } = useAuth();
  // La vérification admin doit rester côté page pour la sécurité
  const isAdmin = user?.email === "malitechholding@gmail.com";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-container">
      <h1 className="section-title">Administration du système</h1>
      <AdminTabs />
    </div>
  );
}

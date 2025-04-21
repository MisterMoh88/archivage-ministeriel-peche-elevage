
import { useState } from "react";
import { 
  Settings, 
  Users, 
  FileText, 
  Palette, 
  LayoutDashboard, 
  Shield, 
  Activity 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/UserManagement";
import { CategoryManagement } from "@/components/admin/CategoryManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");

  // Vérifier si l'utilisateur a les droits d'administration
  const isAdmin = user?.email === "malitechholding@gmail.com"; // Temporaire, à remplacer par un vrai check de rôle

  // Rediriger si l'utilisateur n'est pas administrateur
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-container">
      <h1 className="section-title">Administration du système</h1>

      <Tabs 
        defaultValue="users" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-7 lg:w-full">
          <TabsTrigger value="users" className="flex gap-2 items-center">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex gap-2 items-center">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Catégories</span>
          </TabsTrigger>
          <TabsTrigger value="interface" className="flex gap-2 items-center">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Paramètres</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex gap-2 items-center">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Tableau de bord</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex gap-2 items-center">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex gap-2 items-center">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Journaux</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex gap-2 items-center">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Avancé</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Gestion des utilisateurs */}
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        {/* Onglet Gestion des catégories */}
        <TabsContent value="categories">
          <CategoryManagement />
        </TabsContent>

        {/* Onglet Paramètres du système */}
        <TabsContent value="interface">
          <SystemSettings />
        </TabsContent>

        {/* Autres onglets (à implémenter au besoin) */}
        <TabsContent value="dashboard">
          <div className="border rounded-lg p-8 text-center text-muted-foreground">
            Configuration du tableau de bord - En développement
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="border rounded-lg p-8 text-center text-muted-foreground">
            Paramètres de sécurité - En développement
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <div className="border rounded-lg p-8 text-center text-muted-foreground">
            Journaux d'activité - En développement
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="border rounded-lg p-8 text-center text-muted-foreground">
            Paramètres avancés - En développement
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

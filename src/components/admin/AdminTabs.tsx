
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "./UserManagement";
import { CategoryManagement } from "./CategoryManagement";
import { SystemSettings } from "./SystemSettings";
import { SecuritySettings } from "./SecuritySettings";
import { ActivityLogs } from "./ActivityLogs";
import { AdvancedSettings } from "./AdvancedSettings";
import { DashboardSettings } from "./DashboardSettings";
import { DepartmentManagement } from "./DepartmentManagement";

export function AdminTabs() {
  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        <TabsTrigger value="departments">Départements</TabsTrigger>
        <TabsTrigger value="categories">Catégories</TabsTrigger>
        <TabsTrigger value="system">Système</TabsTrigger>
        <TabsTrigger value="security">Sécurité</TabsTrigger>
        <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
        <TabsTrigger value="logs">Journaux</TabsTrigger>
        <TabsTrigger value="advanced">Avancé</TabsTrigger>
      </TabsList>
      
      <TabsContent value="users" className="mt-6">
        <UserManagement />
      </TabsContent>
      
      <TabsContent value="departments" className="mt-6">
        <DepartmentManagement />
      </TabsContent>
      
      <TabsContent value="categories" className="mt-6">
        <CategoryManagement />
      </TabsContent>
      
      <TabsContent value="system" className="mt-6">
        <SystemSettings />
      </TabsContent>
      
      <TabsContent value="security" className="mt-6">
        <SecuritySettings />
      </TabsContent>
      
      <TabsContent value="dashboard" className="mt-6">
        <DashboardSettings />
      </TabsContent>
      
      <TabsContent value="logs" className="mt-6">
        <ActivityLogs />
      </TabsContent>
      
      <TabsContent value="advanced" className="mt-6">
        <AdvancedSettings />
      </TabsContent>
    </Tabs>
  );
}

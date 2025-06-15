
import { useState } from "react";
import {
  Users,
  FileText,
  Palette,
  LayoutDashboard,
  Shield,
  Activity,
  Settings
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/UserManagement";
import { CategoryManagement } from "@/components/admin/CategoryManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { DashboardSettings } from "@/components/admin/DashboardSettings";
import { SecuritySettings } from "@/components/admin/SecuritySettings";
import { ActivityLogs } from "@/components/admin/ActivityLogs";
import { AdvancedSettings } from "@/components/admin/AdvancedSettings";

export function AdminTabs() {
  const [activeTab, setActiveTab] = useState("users");

  return (
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

      <TabsContent value="users">
        <UserManagement />
      </TabsContent>
      <TabsContent value="categories">
        <CategoryManagement />
      </TabsContent>
      <TabsContent value="interface">
        <SystemSettings />
      </TabsContent>
      <TabsContent value="dashboard">
        <DashboardSettings />
      </TabsContent>
      <TabsContent value="security">
        <SecuritySettings />
      </TabsContent>
      <TabsContent value="logs">
        <ActivityLogs />
      </TabsContent>
      <TabsContent value="advanced">
        <AdvancedSettings />
      </TabsContent>
    </Tabs>
  );
}

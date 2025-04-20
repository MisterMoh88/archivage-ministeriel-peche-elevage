
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, FileUp, Users, Search, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { fetchDocumentStats, fetchRecentActivity, fetchRecentDocuments } from "@/services/dashboard";

export default function Dashboard() {
  const { data: stats = { totalDocs: 0, monthlyUploads: 0, activeUsers: 0, todaySearches: 0 }, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDocumentStats
  });

  const { data: recentActivity = [], isLoading: activityLoading } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: fetchRecentActivity
  });

  const { data: recentDocuments = [], isLoading: documentsLoading } = useQuery({
    queryKey: ['recentDocuments'],
    queryFn: fetchRecentDocuments
  });

  const statsData = [
    {
      title: "Total Documents",
      value: stats.totalDocs.toString(),
      icon: Archive,
    },
    {
      title: "Uploads ce mois",
      value: stats.monthlyUploads.toString(),
      icon: FileUp,
    },
    {
      title: "Utilisateurs actifs",
      value: stats.activeUsers.toString(),
      icon: Users,
    },
    {
      title: "Recherches aujourd'hui",
      value: stats.todaySearches.toString(),
      icon: Search,
    },
  ];

  return (
    <div className="page-container">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Dernière mise à jour: {new Date().toLocaleString()}</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <StatsCard 
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>

        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList>
            <TabsTrigger value="activity">Activité récente</TabsTrigger>
            <TabsTrigger value="documents">Documents récents</TabsTrigger>
          </TabsList>
          <TabsContent value="activity" className="space-y-4">
            <RecentActivity activities={recentActivity} isLoading={activityLoading} />
          </TabsContent>
          <TabsContent value="documents" className="space-y-4">
            <RecentDocuments documents={recentDocuments} isLoading={documentsLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, FileText, FileUp, Users, Search, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Fetch functions
const fetchDocumentStats = async () => {
  const { data: totalDocs } = await supabase
    .from('documents')
    .select('count');

  const { data: monthlyUploads } = await supabase
    .from('documents')
    .select('count')
    .gte('upload_date', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

  const { data: activeUsers } = await supabase
    .from('profiles')
    .select('count')
    .eq('status', 'Actif');

  const { data: todaySearches } = await supabase
    .from('user_actions')
    .select('count')
    .eq('action_type', 'search')
    .gte('performed_at', new Date().toISOString().split('T')[0]);

  return {
    totalDocs: totalDocs?.[0]?.count || 0,
    monthlyUploads: monthlyUploads?.[0]?.count || 0,
    activeUsers: activeUsers?.[0]?.count || 0,
    todaySearches: todaySearches?.[0]?.count || 0
  };
};

const fetchRecentActivity = async () => {
  const { data } = await supabase
    .from('user_actions')
    .select(`
      *,
      documents!inner(title),
      profiles!inner(full_name)
    `)
    .order('performed_at', { ascending: false })
    .limit(5);

  return data || [];
};

const fetchRecentDocuments = async () => {
  const { data } = await supabase
    .from('documents')
    .select(`
      *,
      document_categories(name)
    `)
    .order('upload_date', { ascending: false })
    .limit(5);

  return data || [];
};

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
      icon: <Archive className="h-5 w-5 text-ministry-blue" />,
    },
    {
      title: "Uploads ce mois",
      value: stats.monthlyUploads.toString(),
      icon: <FileUp className="h-5 w-5 text-ministry-blue" />,
    },
    {
      title: "Utilisateurs actifs",
      value: stats.activeUsers.toString(),
      icon: <Users className="h-5 w-5 text-ministry-blue" />,
    },
    {
      title: "Recherches aujourd'hui",
      value: stats.todaySearches.toString(),
      icon: <Search className="h-5 w-5 text-ministry-blue" />,
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
            <Card key={index} className="dashboard-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList>
            <TabsTrigger value="activity">Activité récente</TabsTrigger>
            <TabsTrigger value="documents">Documents récents</TabsTrigger>
          </TabsList>
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>
                  Les 5 dernières actions effectuées dans le système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLoading ? (
                    <p>Chargement...</p>
                  ) : recentActivity.map((item: any) => (
                    <div key={item.id} className="flex items-start gap-4 rounded-lg border p-3">
                      <div className="rounded-full p-2 bg-ministry-blue/10">
                        <FileText className="h-4 w-4 text-ministry-blue" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {item.action_type}: {item.documents.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Par {item.profiles.full_name} • {new Date(item.performed_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Documents récents</CardTitle>
                <CardDescription>
                  Les 5 derniers documents ajoutés au système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documentsLoading ? (
                    <p>Chargement...</p>
                  ) : recentDocuments.map((doc: any) => (
                    <div key={doc.id} className="flex items-start gap-4 rounded-lg border p-3">
                      <div className="rounded-full p-2 bg-ministry-blue/10">
                        <FileText className="h-4 w-4 text-ministry-blue" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{doc.title}</p>
                        <div className="flex gap-2 text-xs">
                          <span className="rounded-full bg-ministry-blue/20 px-2 py-0.5 text-ministry-darkBlue">
                            {doc.document_categories?.name}
                          </span>
                          <span className="text-muted-foreground">
                            {doc.document_type} • {new Date(doc.document_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, FileText, FileUp, Users, Search, Clock } from "lucide-react";

export default function Dashboard() {
  // Données fictives pour la démonstration
  const stats = [
    {
      title: "Total Documents",
      value: "3,456",
      change: "+12.5%",
      icon: <Archive className="h-5 w-5 text-ministry-blue" />,
    },
    {
      title: "Uploads ce mois",
      value: "245",
      change: "+18.2%",
      icon: <FileUp className="h-5 w-5 text-ministry-blue" />,
    },
    {
      title: "Utilisateurs actifs",
      value: "32",
      change: "+7.3%",
      icon: <Users className="h-5 w-5 text-ministry-blue" />,
    },
    {
      title: "Recherches aujourd'hui",
      value: "126",
      change: "+4.9%",
      icon: <Search className="h-5 w-5 text-ministry-blue" />,
    },
  ];

  // Activité récente fictive
  const recentActivity = [
    {
      action: "Upload",
      document: "Arrêté ministériel N°2023-1567",
      user: "Amadou Diallo",
      time: "Il y a 10 minutes",
    },
    {
      action: "Consultation",
      document: "Rapport annuel 2022",
      user: "Fatima Touré",
      time: "Il y a 45 minutes",
    },
    {
      action: "Téléchargement",
      document: "Données statistiques Q1 2023",
      user: "Ibrahim Camara",
      time: "Il y a 2 heures",
    },
    {
      action: "Modification",
      document: "Procédure d'inspection",
      user: "Aminata Koné",
      time: "Il y a 4 heures",
    },
    {
      action: "Upload",
      document: "Budget prévisionnel 2024",
      user: "Mamadou Keita",
      time: "Il y a 1 jour",
    },
  ];

  // Documents récents fictifs
  const recentDocuments = [
    {
      title: "Arrêté ministériel N°2023-1567",
      category: "Documents administratifs",
      date: "23/04/2023",
      type: "Arrêté",
    },
    {
      title: "Rapport d'étude sur l'aquaculture",
      category: "Documents techniques",
      date: "15/04/2023",
      type: "Rapport",
    },
    {
      title: "Budget prévisionnel 2024",
      category: "Documents financiers",
      date: "10/04/2023",
      type: "Budget",
    },
    {
      title: "Campagne de vaccination du bétail",
      category: "Documents de communication",
      date: "05/04/2023",
      type: "Brochure",
    },
    {
      title: "Correspondance historique 1995",
      category: "Archives historiques",
      date: "01/04/2023",
      type: "Correspondance",
    },
  ];

  return (
    <div className="page-container">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Dernière mise à jour: aujourd'hui à 09:45</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="dashboard-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-ministry-blue">{stat.change} depuis le mois dernier</p>
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
                  {recentActivity.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 rounded-lg border p-3">
                      <div className="rounded-full p-2 bg-ministry-blue/10">
                        <FileText className="h-4 w-4 text-ministry-blue" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{item.action}: {item.document}</p>
                        <p className="text-xs text-muted-foreground">
                          Par {item.user} • {item.time}
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
                  {recentDocuments.map((doc, index) => (
                    <div key={index} className="flex items-start gap-4 rounded-lg border p-3">
                      <div className="rounded-full p-2 bg-ministry-blue/10">
                        <FileText className="h-4 w-4 text-ministry-blue" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{doc.title}</p>
                        <div className="flex gap-2 text-xs">
                          <span className="rounded-full bg-ministry-blue/20 px-2 py-0.5 text-ministry-darkBlue">
                            {doc.category}
                          </span>
                          <span className="text-muted-foreground">
                            {doc.type} • {doc.date}
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

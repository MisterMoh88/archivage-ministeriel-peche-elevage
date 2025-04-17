
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

export default function Stats() {
  // Données fictives pour les statistiques
  const documentsByCategory = [
    { name: "Documents administratifs", value: 578, color: "#4A9BDB" },
    { name: "Documents techniques", value: 342, color: "#1A5B8F" },
    { name: "Documents financiers", value: 289, color: "#F8B93B" },
    { name: "Documents de communication", value: 156, color: "#5BCEFA" },
    { name: "Archives historiques", value: 91, color: "#6B7280" },
  ];

  const documentsByYear = [
    { name: "2019", administratifs: 98, techniques: 54, financiers: 42, communication: 25, historiques: 8 },
    { name: "2020", administratifs: 120, techniques: 65, financiers: 51, communication: 31, historiques: 12 },
    { name: "2021", administratifs: 145, techniques: 72, financiers: 60, communication: 35, historiques: 18 },
    { name: "2022", administratifs: 170, techniques: 89, financiers: 73, communication: 40, historiques: 25 },
    { name: "2023", administratifs: 45, techniques: 62, financiers: 63, communication: 25, historiques: 28 },
  ];

  const uploadsByMonth = [
    { name: "Jan", count: 65 },
    { name: "Fév", count: 59 },
    { name: "Mar", count: 80 },
    { name: "Avr", count: 81 },
    { name: "Mai", count: 56 },
    { name: "Juin", count: 55 },
    { name: "Juil", count: 40 },
    { name: "Août", count: 45 },
    { name: "Sep", count: 67 },
    { name: "Oct", count: 88 },
    { name: "Nov", count: 74 },
    { name: "Déc", count: 51 },
  ];

  const userActivity = [
    { name: "Consultation", count: 842 },
    { name: "Téléchargement", count: 456 },
    { name: "Upload", count: 245 },
    { name: "Recherche", count: 567 },
    { name: "Modification", count: 123 },
  ];

  return (
    <div className="page-container">
      <h1 className="section-title">Statistiques</h1>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="uploads">Uploads</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Répartition par catégorie */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par catégorie</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={documentsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {documentsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Évolution par année */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution par année</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={documentsByYear}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="administratifs" name="Administratifs" fill="#4A9BDB" />
                    <Bar dataKey="techniques" name="Techniques" fill="#1A5B8F" />
                    <Bar dataKey="financiers" name="Financiers" fill="#F8B93B" />
                    <Bar dataKey="communication" name="Communication" fill="#5BCEFA" />
                    <Bar dataKey="historiques" name="Historiques" fill="#6B7280" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="uploads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Uploads par mois (2023)</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={uploadsByMonth}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#4A9BDB"
                    name="Nombre d'uploads"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activité des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userActivity}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#1A5B8F"
                    name="Nombre d'actions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Fetch functions
const fetchDocumentsByCategory = async () => {
  const { data } = await supabase
    .from('documents')
    .select(`
      document_categories!inner(name)
    `);

  if (!data) return [];

  const categoryCount = data.reduce((acc: any, doc) => {
    const category = doc.document_categories.name;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Fixed color mapping for categories
  const colors = {
    "Documents administratifs et réglementaires": "#4A9BDB",
    "Documents techniques et spécialisés": "#1A5B8F",
    "Documents financiers et comptables": "#F8B93B",
    "Documents de communication et de sensibilisation": "#5BCEFA",
    "Archives et documentation historique": "#6B7280",
  };

  return Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value,
    color: colors[name as keyof typeof colors] || "#6B7280"
  }));
};

const fetchDocumentsByYear = async () => {
  const { data } = await supabase
    .from('documents')
    .select(`
      document_date,
      document_categories!inner(name)
    `);

  if (!data) return [];

  const yearlyData: any = {};
  
  data.forEach(doc => {
    const year = new Date(doc.document_date).getFullYear().toString();
    const category = doc.document_categories.name;
    
    if (!yearlyData[year]) {
      yearlyData[year] = {
        name: year,
        "Documents administratifs": 0,
        "Documents techniques": 0,
        "Documents financiers": 0,
        "Documents de communication": 0,
        "Archives historiques": 0,
      };
    }
    
    const categoryMapping: any = {
      "Documents administratifs et réglementaires": "Documents administratifs",
      "Documents techniques et spécialisés": "Documents techniques",
      "Documents financiers et comptables": "Documents financiers",
      "Documents de communication et de sensibilisation": "Documents de communication",
      "Archives et documentation historique": "Archives historiques",
    };
    
    yearlyData[year][categoryMapping[category]]++;
  });

  return Object.values(yearlyData);
};

const fetchUploadsByMonth = async () => {
  const { data } = await supabase
    .from('documents')
    .select('upload_date');

  if (!data) return [];

  const monthCount: any = {};
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

  data.forEach(doc => {
    const date = new Date(doc.upload_date);
    const monthIndex = date.getMonth();
    const monthName = months[monthIndex];
    monthCount[monthName] = (monthCount[monthName] || 0) + 1;
  });

  return months.map(month => ({
    name: month,
    count: monthCount[month] || 0
  }));
};

const fetchUserActivity = async () => {
  const { data } = await supabase
    .from('user_actions')
    .select('action_type');

  if (!data) return [];

  const activityCount = data.reduce((acc: any, action) => {
    acc[action.action_type] = (acc[action.action_type] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(activityCount).map(([name, count]) => ({
    name,
    count
  }));
};

export default function Stats() {
  const { data: documentsByCategory = [] } = useQuery({
    queryKey: ['documentsByCategory'],
    queryFn: fetchDocumentsByCategory
  });

  const { data: documentsByYear = [] } = useQuery({
    queryKey: ['documentsByYear'],
    queryFn: fetchDocumentsByYear
  });

  const { data: uploadsByMonth = [] } = useQuery({
    queryKey: ['uploadsByMonth'],
    queryFn: fetchUploadsByMonth
  });

  const { data: userActivity = [] } = useQuery({
    queryKey: ['userActivity'],
    queryFn: fetchUserActivity
  });

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
                    <Bar dataKey="Documents administratifs" fill="#4A9BDB" />
                    <Bar dataKey="Documents techniques" fill="#1A5B8F" />
                    <Bar dataKey="Documents financiers" fill="#F8B93B" />
                    <Bar dataKey="Documents de communication" fill="#5BCEFA" />
                    <Bar dataKey="Archives historiques" fill="#6B7280" />
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

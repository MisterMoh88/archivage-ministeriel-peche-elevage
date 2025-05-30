
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { CategoryDistribution } from "@/components/stats/CategoryDistribution";
import { YearlyDistribution } from "@/components/stats/YearlyDistribution";
import { fetchDocumentsByCategory, fetchDocumentsByYear } from "@/services/stats";

export default function Stats() {
  const { data: documentsByCategory = [], isLoading: isCategoryLoading } = useQuery({
    queryKey: ['documentsByCategory'],
    queryFn: fetchDocumentsByCategory
  });

  const { data: documentsByYear = [], isLoading: isYearlyLoading } = useQuery({
    queryKey: ['documentsByYear'],
    queryFn: fetchDocumentsByYear
  });

  return (
    <div className="page-container">
      <h1 className="section-title">Statistiques</h1>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {isCategoryLoading ? (
              <div className="h-[400px] flex items-center justify-center">Chargement...</div>
            ) : (
              <CategoryDistribution data={documentsByCategory} />
            )}
            
            {isYearlyLoading ? (
              <div className="h-[400px] flex items-center justify-center">Chargement...</div>
            ) : (
              <YearlyDistribution data={documentsByYear} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

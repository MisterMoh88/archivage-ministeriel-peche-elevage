
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DocumentCategoryTabsProps {
  categories: { id: string; name: string }[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  children: React.ReactNode;
}

export const DocumentCategoryTabs = ({
  categories,
  selectedCategory,
  onCategoryChange,
  children
}: DocumentCategoryTabsProps) => {
  return (
    <Tabs 
      defaultValue="all" 
      className="space-y-4"
      value={selectedCategory}
      onValueChange={onCategoryChange}
    >
      <TabsList>
        <TabsTrigger value="all">Tous</TabsTrigger>
        {categories.map(category => (
          <TabsTrigger 
            key={category.id} 
            value={category.id}
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={selectedCategory} className="space-y-4">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-lg">
              Liste des documents
            </CardTitle>
            <CardDescription>
              Consultez et gérez les documents archivés
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {children}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

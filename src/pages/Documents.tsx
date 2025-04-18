
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowUpDown } from "lucide-react";
import { getDocuments, getDocumentCategories } from "@/services/documentService";
import { useQuery } from "@tanstack/react-query";
import { Document } from "@/types/document";
import { DocumentSearchBar } from "@/components/documents/DocumentSearchBar";
import { DocumentTableRow } from "@/components/documents/DocumentTableRow";

export default function Documents() {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  // Fetch documents and categories
  const { data: documents, isLoading, error, refetch } = useQuery({
    queryKey: ["documents"],
    queryFn: getDocuments,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getDocumentCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Filter and sort documents
  const filteredAndSortedDocuments = () => {
    if (!documents) return [];
    
    let filtered = [...documents];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.reference_number.toLowerCase().includes(query) ||
        doc.document_type.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(doc => doc.category_id === selectedCategory);
    }
    
    if (sortColumn) {
      filtered.sort((a, b) => {
        const direction = sortDirection === "asc" ? 1 : -1;
        
        switch (sortColumn) {
          case "title":
            return a.title.localeCompare(b.title) * direction;
          case "date":
            return new Date(a.document_date).getTime() - 
                  new Date(b.document_date).getTime() * direction;
          case "type":
            return a.document_type.localeCompare(b.document_type) * direction;
          case "reference":
            return a.reference_number.localeCompare(b.reference_number) * direction;
          default:
            return 0;
        }
      });
    }
    
    return filtered;
  };

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  if (error) {
    return (
      <div className="page-container">
        <div className="text-center py-10">
          <h2 className="text-xl text-destructive mb-2">
            Erreur lors du chargement des documents
          </h2>
          <p className="text-muted-foreground mb-4">
            Une erreur est survenue lors de la récupération des documents.
          </p>
          <Button onClick={() => refetch()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="section-title">Documents</h1>

      <DocumentSearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Tabs 
        defaultValue="all" 
        className="space-y-4"
        value={selectedCategory}
        onValueChange={setSelectedCategory}
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
                Liste des documents ({isLoading ? '...' : filteredAndSortedDocuments().length})
              </CardTitle>
              <CardDescription>
                Consultez et gérez les documents archivés
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center p-10">
                  <Loader2 className="h-8 w-8 animate-spin text-ministry-blue" />
                  <span className="ml-2">Chargement des documents...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]">
                        <Checkbox />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort("title")}
                      >
                        <div className="flex items-center gap-1">
                          Titre
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort("type")}
                      >
                        <div className="flex items-center gap-1">
                          Type
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort("date")}
                      >
                        <div className="flex items-center gap-1">
                          Date
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort("reference")}
                      >
                        <div className="flex items-center gap-1">
                          Référence
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedDocuments().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10">
                          <p className="text-muted-foreground">Aucun document trouvé</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAndSortedDocuments().map((doc) => (
                        <DocumentTableRow key={doc.id} document={doc} />
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

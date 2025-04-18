
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDocuments, getDocumentCategories } from "@/services/documentService";
import { DocumentSearchBar } from "@/components/documents/DocumentSearchBar";
import { DocumentCategoryTabs } from "@/components/documents/DocumentCategoryTabs";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { Document } from "@/types/document";

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
    
    let filtered = [...documents] as Document[];
    
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
            return (new Date(a.document_date).getTime() - 
                  new Date(b.document_date).getTime()) * direction;
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

      <DocumentCategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      >
        <DocumentsTable 
          documents={filteredAndSortedDocuments()}
          isLoading={isLoading}
          categories={categories}
          onDocumentChange={refetch}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </DocumentCategoryTabs>
    </div>
  );
}


import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getDocuments } from "@/services/documents/crudService";
import { getDocumentCategories } from "@/services/documents/categoryService";
import { DocumentSearchBar } from "@/components/documents/DocumentSearchBar";
import { DocumentCategoryTabs } from "@/components/documents/DocumentCategoryTabs";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { useDocumentSorting } from "@/hooks/useDocumentSorting";

export default function Documents() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  // Fetch documents and categories
  const { data: documents, isLoading, error, refetch } = useQuery({
    queryKey: ["documents"],
    queryFn: getDocuments,
  });

  const {
    filteredAndSortedDocuments,
    sortColumn,
    sortDirection,
    handleSort,
  } = useDocumentSorting({
    documents,
    searchQuery,
    selectedCategory,
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
          documents={filteredAndSortedDocuments}
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


import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "@/services/documents/crudService";
import { getDocumentCategories } from "@/services/documents/categoryService";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import { DocumentEditForm } from "@/components/documents/DocumentEditForm";
import { DocumentDeleteConfirm } from "@/components/documents/DocumentDeleteConfirm";
import { ArchiveFilters } from "@/components/documents/ArchiveFilters";
import { useDocumentFilters } from "@/hooks/useDocumentFilters";
import { Document } from "@/types/document";

export default function Archives() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("newest");
  
  // States for document actions
  const [viewDocument, setViewDocument] = useState<Document | null>(null);
  const [editDocument, setEditDocument] = useState<Document | null>(null);
  const [deleteDocument, setDeleteDocument] = useState<Document | null>(null);

  // Fetch documents and categories
  const { data: documents, isLoading, error, refetch } = useQuery({
    queryKey: ["archives-documents"],
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

  const filteredDocuments = useDocumentFilters({
    documents,
    searchQuery,
    selectedCategory,
    selectedSort,
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Non catégorisé";
  };

  const handleDocumentChange = () => {
    refetch();
  };
  
  return (
    <div className="page-container">
      <h1 className="section-title">Archives documentaires</h1>

      <ArchiveFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        categories={categories}
        filteredDocuments={filteredDocuments}
        isLoading={isLoading}
        getCategoryName={getCategoryName}
        onView={setViewDocument}
        onEdit={setEditDocument}
        onDelete={setDeleteDocument}
      />

      {/* Document details viewer */}
      <DocumentViewer 
        document={viewDocument}
        isOpen={!!viewDocument}
        onClose={() => setViewDocument(null)}
      />

      {/* Document edit form */}
      <DocumentEditForm 
        document={editDocument}
        isOpen={!!editDocument}
        onClose={() => setEditDocument(null)}
        onSuccess={handleDocumentChange}
        categories={categories}
      />

      {/* Document delete confirmation */}
      {deleteDocument && (
        <DocumentDeleteConfirm 
          documentId={deleteDocument.id}
          documentTitle={deleteDocument.title}
          isOpen={!!deleteDocument}
          onClose={() => setDeleteDocument(null)}
          onSuccess={handleDocumentChange}
        />
      )}
    </div>
  );
}

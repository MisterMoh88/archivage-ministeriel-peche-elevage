
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
  const [selectedSort, setSelectedSort] = useState<string>("newest");
  
  // States for document actions
  const [viewDocument, setViewDocument] = useState<Document | null>(null);
  const [editDocument, setEditDocument] = useState<Document | null>(null);
  const [deleteDocument, setDeleteDocument] = useState<Document | null>(null);

  // Fetch documents and categories with better error handling
  const { data: documents = [], isLoading, error, refetch } = useQuery({
    queryKey: ["archives-documents"],
    queryFn: getDocuments,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["document-categories"],
    queryFn: getDocumentCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });

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

  console.log("Archives page state:", {
    documentsCount: documents.length,
    filteredCount: filteredDocuments.length,
    categoriesCount: categories.length,
    isLoading,
    categoriesLoading,
    error: error?.message
  });
  
  if (error) {
    return (
      <div className="page-container">
        <h1 className="section-title">Archives documentaires</h1>
        <div className="flex items-center justify-center py-10">
          <div className="text-center">
            <p className="text-destructive mb-4">
              Erreur lors du chargement des documents: {error.message}
            </p>
            <button 
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }
  
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
        isLoading={isLoading || categoriesLoading}
        getCategoryName={getCategoryName}
        onView={setViewDocument}
        onEdit={setEditDocument}
        onDelete={setDeleteDocument}
      />

      {/* Document details viewer */}
      {viewDocument && (
        <DocumentViewer 
          document={viewDocument}
          isOpen={!!viewDocument}
          onClose={() => setViewDocument(null)}
        />
      )}

      {/* Document edit form */}
      {editDocument && (
        <DocumentEditForm 
          document={editDocument}
          isOpen={!!editDocument}
          onClose={() => setEditDocument(null)}
          onSuccess={handleDocumentChange}
          categories={categories}
        />
      )}

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

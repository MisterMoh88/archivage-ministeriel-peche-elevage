
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "@/services/documents/crudService";
import { getDocumentCategories } from "@/services/documents/categoryService";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import { DocumentEditForm } from "@/components/documents/DocumentEditForm";
import { DocumentDeleteConfirm } from "@/components/documents/DocumentDeleteConfirm";
import { ArchiveFilters } from "@/components/documents/ArchiveFilters";
import { useSecureDocumentFilters } from "@/hooks/useSecureDocumentFilters";
import { useAuth } from "@/context/AuthContext";
import { Document } from "@/types/document";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function Archives() {
  const { userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("newest");
  
  // States for document actions
  const [viewDocument, setViewDocument] = useState<Document | null>(null);
  const [editDocument, setEditDocument] = useState<Document | null>(null);
  const [deleteDocument, setDeleteDocument] = useState<Document | null>(null);

  // Fetch documents with debugging
  const { data: documents = [], isLoading, error, refetch } = useQuery({
    queryKey: ["archives-documents"],
    queryFn: async () => {
      console.log("📋 Exécution de la requête getDocuments...");
      const result = await getDocuments();
      console.log("📋 Résultat de getDocuments:", result);
      return result;
    },
    staleTime: 30 * 1000, // 30 secondes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["document-categories"],
    queryFn: getDocumentCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const filteredDocuments = useSecureDocumentFilters({
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
    console.log("🔄 Rafraîchissement des documents...");
    refetch();
  };

  // Vérifier les permissions pour l'édition et la suppression
  const canEditDocument = (document: Document) => {
    if (!userProfile) return false;
    
    if (userProfile.role === 'admin') return true;
    if (userProfile.role === 'admin_local') {
      return document.issuing_department === userProfile.department;
    }
    return false; // Les utilisateurs normaux ne peuvent pas éditer
  };

  const canDeleteDocument = (document: Document) => {
    if (!userProfile) return false;
    
    if (userProfile.role === 'admin') return true;
    if (userProfile.role === 'admin_local') {
      return document.issuing_department === userProfile.department;
    }
    return false; // Les utilisateurs normaux ne peuvent pas supprimer
  };

  // Handler sécurisé pour l'édition
  const handleEdit = (doc: Document) => {
    if (canEditDocument(doc)) {
      setEditDocument(doc);
    }
  };

  // Handler sécurisé pour la suppression
  const handleDelete = (doc: Document) => {
    if (canDeleteDocument(doc)) {
      setDeleteDocument(doc);
    }
  };

  // Debug logging
  useEffect(() => {
    console.log("🏛️ Archives page - État actuel:", {
      documentsCount: documents.length,
      filteredCount: filteredDocuments.length,
      categoriesCount: categories.length,
      isLoading,
      categoriesLoading,
      error: error?.message,
      searchQuery,
      selectedCategory,
      selectedSort,
      userRole: userProfile?.role,
      userDepartment: userProfile?.department
    });
  }, [documents, filteredDocuments, categories, isLoading, categoriesLoading, error, searchQuery, selectedCategory, selectedSort, userProfile]);
  
  if (error) {
    console.error("❌ Erreur dans Archives:", error);
    return (
      <div className="page-container">
        <h1 className="section-title">Archives documentaires</h1>
        <div className="flex items-center justify-center py-10">
          <div className="text-center">
            <p className="text-destructive mb-4">
              Erreur lors du chargement des documents: {error.message}
            </p>
            <button 
              onClick={() => {
                console.log("🔄 Tentative de rechargement...");
                refetch();
              }}
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

      {/* Message d'information sur le département */}
      {userProfile && userProfile.department && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            {userProfile.role === 'admin' 
              ? "Vous consultez les archives de tous les départements (accès administrateur)"
              : `Vous consultez les archives du département : ${userProfile.department}`
            }
          </AlertDescription>
        </Alert>
      )}

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
        onEdit={handleEdit}
        onDelete={handleDelete}
        userProfile={userProfile}
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
          userProfile={userProfile}
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

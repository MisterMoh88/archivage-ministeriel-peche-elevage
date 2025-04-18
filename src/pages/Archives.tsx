
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getDocuments, getDocumentCategories } from "@/services/documentService";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import { DocumentEditForm } from "@/components/documents/DocumentEditForm";
import { DocumentDeleteConfirm } from "@/components/documents/DocumentDeleteConfirm";
import { ArchivesSearchBar } from "@/components/documents/ArchivesSearchBar";
import { ArchivesSortBar } from "@/components/documents/ArchivesSortBar";
import { ArchiveDocumentItem } from "@/components/documents/ArchiveDocumentItem";
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

  // Filter and sort documents
  const filteredAndSortedDocuments = () => {
    if (!documents) return [];
    
    let filtered = [...documents];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.reference_number.toLowerCase().includes(query) ||
        doc.document_type.toLowerCase().includes(query) ||
        (doc.issuing_department && doc.issuing_department.toLowerCase().includes(query))
      );
    }
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(doc => doc.category_id === selectedCategory);
    }
    
    // Sort documents
    switch (selectedSort) {
      case "newest":
        filtered.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime());
        break;
      case "a-z":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    
    return filtered;
  };

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

      <ArchivesSearchBar 
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
          <div className="rounded-md border">
            <ArchivesSortBar 
              documentCount={filteredAndSortedDocuments().length}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
            />

            <div className="divide-y">
              {isLoading ? (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">Chargement des documents...</p>
                </div>
              ) : filteredAndSortedDocuments().length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">Aucun document trouvé</p>
                </div>
              ) : (
                filteredAndSortedDocuments().map((doc) => (
                  <ArchiveDocumentItem
                    key={doc.id}
                    document={doc}
                    getCategoryName={getCategoryName}
                    onView={setViewDocument}
                    onEdit={setEditDocument}
                    onDelete={setDeleteDocument}
                  />
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

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

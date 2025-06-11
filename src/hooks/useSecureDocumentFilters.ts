
import { useMemo } from "react";
import { Document } from "@/types/document";
import { useAuth } from "@/context/AuthContext";

interface UseSecureDocumentFiltersProps {
  documents: Document[] | undefined;
  searchQuery: string;
  selectedCategory: string;
  selectedSort: string;
}

export const useSecureDocumentFilters = ({
  documents,
  searchQuery,
  selectedCategory,
  selectedSort,
}: UseSecureDocumentFiltersProps) => {
  const { userProfile } = useAuth();

  const filteredAndSortedDocuments = useMemo(() => {
    console.log("🔍 Filtrage sécurisé des documents:", {
      totalDocuments: documents?.length || 0,
      searchQuery,
      selectedCategory,
      selectedSort,
      userRole: userProfile?.role,
      userDepartment: userProfile?.department
    });

    if (!documents || documents.length === 0 || !userProfile) {
      console.log("📋 Aucun document à filtrer ou utilisateur non connecté");
      return [];
    }
    
    let filtered = [...documents] as Document[];
    console.log("📋 Documents avant filtrage:", filtered.length);
    
    // Filtrage par sécurité (département) - déjà géré par RLS mais on garde la logique côté client pour la cohérence
    if (userProfile.role === 'utilisateur' || userProfile.role === 'admin_local') {
      filtered = filtered.filter(doc => doc.issuing_department === userProfile.department);
      console.log("📋 Documents après filtrage par département:", filtered.length);
    }
    
    // Filtrage par recherche - recherche insensible à la casse
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(doc => 
        doc.title?.toLowerCase().includes(query) ||
        doc.reference_number?.toLowerCase().includes(query) ||
        doc.document_type?.toLowerCase().includes(query) ||
        (doc.issuing_department && doc.issuing_department.toLowerCase().includes(query))
      );
      console.log("📋 Documents après recherche:", filtered.length);
    }
    
    // Filtrage par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter(doc => doc.category_id === selectedCategory);
      console.log("📋 Documents après filtrage par catégorie:", filtered.length);
    }
    
    // Tri des documents
    switch (selectedSort) {
      case "newest":
        filtered.sort((a, b) => {
          const dateA = new Date(a.upload_date || a.document_date).getTime();
          const dateB = new Date(b.upload_date || b.document_date).getTime();
          return dateB - dateA;
        });
        break;
      case "oldest":
        filtered.sort((a, b) => {
          const dateA = new Date(a.upload_date || a.document_date).getTime();
          const dateB = new Date(b.upload_date || b.document_date).getTime();
          return dateA - dateB;
        });
        break;
      case "a-z":
        filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "z-a":
        filtered.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;
    }
    
    console.log("✅ Documents finaux après tri:", filtered.length);
    return filtered;
  }, [documents, searchQuery, selectedCategory, selectedSort, userProfile]);

  return filteredAndSortedDocuments;
};

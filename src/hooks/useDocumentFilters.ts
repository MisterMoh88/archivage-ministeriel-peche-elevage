
import { useState, useMemo } from "react";
import { Document } from "@/types/document";

interface UseDocumentFiltersProps {
  documents: Document[] | undefined;
  searchQuery: string;
  selectedCategory: string;
  selectedSort: string;
}

export const useDocumentFilters = ({
  documents,
  searchQuery,
  selectedCategory,
  selectedSort,
}: UseDocumentFiltersProps) => {
  const filteredAndSortedDocuments = useMemo(() => {
    console.log("🔍 Filtrage des documents:", {
      totalDocuments: documents?.length || 0,
      searchQuery,
      selectedCategory,
      selectedSort
    });

    if (!documents || documents.length === 0) {
      console.log("📋 Aucun document à filtrer");
      return [];
    }
    
    let filtered = [...documents] as Document[];
    console.log("📋 Documents avant filtrage:", filtered.length);
    
    // Filtrage par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
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
  }, [documents, searchQuery, selectedCategory, selectedSort]);

  return filteredAndSortedDocuments;
};


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
    if (!documents) return [];
    
    let filtered = [...documents] as Document[];
    
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
  }, [documents, searchQuery, selectedCategory, selectedSort]);

  return filteredAndSortedDocuments;
};

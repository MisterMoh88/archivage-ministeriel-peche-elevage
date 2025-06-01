
import { useState, useMemo } from "react";
import { Document } from "@/types/document";

interface UseDocumentSortingProps {
  documents: Document[] | undefined;
  searchQuery: string;
  selectedCategory: string;
}

export const useDocumentSorting = ({
  documents,
  searchQuery,
  selectedCategory,
}: UseDocumentSortingProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredAndSortedDocuments = useMemo(() => {
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
  }, [documents, searchQuery, selectedCategory, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return {
    filteredAndSortedDocuments,
    sortColumn,
    sortDirection,
    handleSort,
  };
};

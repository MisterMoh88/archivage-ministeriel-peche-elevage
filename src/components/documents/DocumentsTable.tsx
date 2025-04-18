
import { useState } from "react";
import { Document } from "@/types/document";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, Loader2 } from "lucide-react";
import { DocumentTableRow } from "./DocumentTableRow";

interface DocumentsTableProps {
  documents: Document[];
  isLoading: boolean;
  categories: { id: string; name: string }[];
  onDocumentChange: () => void;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
}

export const DocumentsTable = ({
  documents,
  isLoading,
  categories,
  onDocumentChange,
  sortColumn,
  sortDirection,
  onSort,
}: DocumentsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[30px]">
            <Checkbox />
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => onSort("title")}
          >
            <div className="flex items-center gap-1">
              Titre
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </TableHead>
          <TableHead>Catégorie</TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => onSort("type")}
          >
            <div className="flex items-center gap-1">
              Type
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => onSort("date")}
          >
            <div className="flex items-center gap-1">
              Date
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => onSort("reference")}
          >
            <div className="flex items-center gap-1">
              Référence
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </TableHead>
          <TableHead>Format</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-10">
              <div className="flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-ministry-blue" />
                <span className="ml-2">Chargement des documents...</span>
              </div>
            </TableCell>
          </TableRow>
        ) : documents.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-10">
              <p className="text-muted-foreground">Aucun document trouvé</p>
            </TableCell>
          </TableRow>
        ) : (
          documents.map((doc) => (
            <DocumentTableRow 
              key={doc.id} 
              document={doc}
              categories={categories}
              onDocumentChange={onDocumentChange}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

import { useState } from "react";
import { Document } from "@/types/document";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Download, MoreVertical, FileText, FilePen, Trash2 } from "lucide-react";
import { formatDate, formatFileSize, getFileIcon, handleDownload, handlePreview, logDocumentView } from "@/utils/documentUtils";
import { DocumentViewer } from "./DocumentViewer";
import { DocumentEditForm } from "./DocumentEditForm";
import { DocumentDeleteConfirm } from "./DocumentDeleteConfirm";

interface DocumentTableRowProps {
  document: Document;
  categories: { id: string; name: string }[];
  onDocumentChange: () => void;
}

export const DocumentTableRow = ({ document, categories, onDocumentChange }: DocumentTableRowProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openViewer = async () => {
    setIsViewerOpen(true);
    // Log document view in history
    await logDocumentView(document.id);
  };

  return (
    <>
      <TableRow key={document.id}>
        <TableCell>
          <Checkbox />
        </TableCell>
        <TableCell className="font-medium">{document.title}</TableCell>
        <TableCell>
          <Badge variant="outline">{document.document_categories?.name || "Non catégorisé"}</Badge>
        </TableCell>
        <TableCell>
          <Badge variant="secondary">{document.document_type}</Badge>
        </TableCell>
        <TableCell>{formatDate(document.document_date)}</TableCell>
        <TableCell>{document.reference_number}</TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            {getFileIcon(document.file_type)}
            <span className="text-xs">{document.file_type?.split('/')[1]?.toUpperCase() || "DOC"}</span>
            <span className="text-xs text-muted-foreground">({formatFileSize(document.file_size)})</span>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={openViewer}
              title="Détails"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleDownload(document.file_path, document.title)}
              title="Télécharger"
            >
              <Download className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={openViewer}>
                  <FileText className="h-4 w-4 mr-2" />
                  Détails
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                  <FilePen className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => setIsDeleteOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>

      {/* Document details viewer */}
      <DocumentViewer 
        document={document}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />

      {/* Document edit form */}
      <DocumentEditForm 
        document={document}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={onDocumentChange}
        categories={categories}
      />

      {/* Document delete confirmation */}
      <DocumentDeleteConfirm 
        documentId={document.id}
        documentTitle={document.title}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={onDocumentChange}
      />
    </>
  );
};

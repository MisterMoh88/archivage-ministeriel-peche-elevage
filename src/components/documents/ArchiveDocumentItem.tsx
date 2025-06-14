
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Document } from "@/types/document";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Download,
  MoreVertical,
  FileText,
  FilePen,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { formatDate, getFileIcon, handleDownload } from "@/utils/documentUtils";

interface ArchiveDocumentItemProps {
  document: Document;
  getCategoryName: (categoryId: string) => string;
  onView: (doc: Document) => void;
  onEdit: (doc: Document) => void;
  onDelete: (doc: Document) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export const ArchiveDocumentItem = ({
  document,
  getCategoryName,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: ArchiveDocumentItemProps) => {
  const navigate = useNavigate();
  
  const fileIcon = useMemo(() => {
    return (
      getFileIcon(document.file_type) || (
        <FileText className="h-6 w-6 text-ministry-blue" />
      )
    );
  }, [document.file_type]);

  const handleOpenInViewer = () => {
    console.log("Opening document in viewer:", document.id);
    navigate(`/document-viewer?id=${document.id}`);
  };

  const handleViewDocument = () => {
    console.log("Viewing document:", document.id);
    onView(document);
  };

  const handleDownloadDocument = () => {
    console.log("Downloading document:", document.file_path);
    handleDownload(document.file_path, document.title);
  };

  const isPDF = document.file_type?.toLowerCase().includes('pdf') || 
              document.file_path?.toLowerCase().endsWith('.pdf');

  return (
    <div className="p-4 flex items-start gap-4 hover:bg-muted/30 transition-colors">
      <div className="rounded-md bg-ministry-blue/10 p-2 mt-1 flex-shrink-0">
        {fileIcon}
      </div>
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-medium truncate pr-2">{document.title}</h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDate(document.document_date)}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline">{getCategoryName(document.category_id)}</Badge>
          <Badge variant="secondary">{document.document_type}</Badge>
          <span className="text-muted-foreground">
            Réf: {document.reference_number}
          </span>
          {document.issuing_department && (
            <span className="text-muted-foreground">
              Source: {document.issuing_department}
            </span>
          )}
        </div>
        {document.budget_program && (
          <div className="bg-ministry-gold/10 p-2 rounded-md mt-2 text-xs">
            {document.budget_year && (
              <p>
                <span className="font-medium">Année budgétaire:</span>{" "}
                {document.budget_year}
              </p>
            )}
            <p>
              <span className="font-medium">Programme budgétaire:</span>{" "}
              {document.budget_program}
            </p>
            {document.market_type && (
              <p>
                <span className="font-medium">Type de marché:</span>{" "}
                {document.market_type}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {isPDF && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenInViewer}
            aria-label="Ouvrir en plein écran"
            title="Ouvrir en plein écran"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleViewDocument}
          aria-label="Voir le document"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownloadDocument}
          aria-label="Télécharger le document"
        >
          <Download className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Plus d'options">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isPDF && (
              <>
                <DropdownMenuItem onClick={handleOpenInViewer}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Plein écran
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={handleViewDocument}>
              <FileText className="h-4 w-4 mr-2" />
              Détails
            </DropdownMenuItem>
            {canEdit && (
              <DropdownMenuItem onClick={() => onEdit(document)}>
                <FilePen className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
            )}
            {canDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(document)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

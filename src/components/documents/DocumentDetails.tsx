
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Document } from "@/types/document";
import { formatDate, formatFileSize } from "@/utils/documentUtils";
import { Info, Hash, Calendar, FileType, Building } from "lucide-react";

interface DocumentDetailsProps {
  document: Document;
}

export const DocumentDetails = ({ document }: DocumentDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="font-medium">Informations générales</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Titre:</span>
              <span className="text-sm ml-2">{document.title}</span>
            </div>
            <div className="flex items-center">
              <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Référence:</span>
              <span className="text-sm ml-2">{document.reference_number}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Date:</span>
              <span className="text-sm ml-2">{formatDate(document.document_date)}</span>
            </div>
            <div className="flex items-center">
              <FileType className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Type:</span>
              <span className="text-sm ml-2">
                <Badge variant="secondary">{document.document_type}</Badge>
              </span>
            </div>
            {document.document_categories && (
              <div className="flex items-center">
                <FileType className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Catégorie:</span>
                <span className="text-sm ml-2">
                  <Badge>{document.document_categories.name}</Badge>
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-medium">Métadonnées</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Service émetteur:</span>
              <span className="text-sm ml-2">{document.issuing_department || "Non spécifié"}</span>
            </div>
            <div className="flex items-center">
              <FileType className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Format:</span>
              <span className="text-sm ml-2">{document.file_type?.split('/')[1]?.toUpperCase() || "Non spécifié"} ({formatFileSize(document.file_size)})</span>
            </div>
            {document.budget_year && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Année budgétaire:</span>
                <span className="text-sm ml-2">{document.budget_year}</span>
              </div>
            )}
            {document.budget_program && (
              <div className="flex items-center">
                <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Programme budgétaire:</span>
                <span className="text-sm ml-2">{document.budget_program}</span>
              </div>
            )}
            {document.market_type && (
              <div className="flex items-center">
                <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Type de marché:</span>
                <span className="text-sm ml-2">{document.market_type}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {document.description && (
        <div className="space-y-2 mt-4">
          <h3 className="font-medium">Description</h3>
          <p className="text-sm text-muted-foreground">{document.description}</p>
        </div>
      )}
    </div>
  );
};

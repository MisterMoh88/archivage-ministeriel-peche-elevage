
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, Calendar, FileType, Building, Shield, Archive, MapPin } from "lucide-react";
import { Document } from "@/types/document";
import { formatDate, formatFileSize } from "@/utils/documentUtils";

interface DocumentDetailsPanelProps {
  document: Document;
}

export const DocumentDetailsPanel = ({ document }: DocumentDetailsPanelProps) => {
  return (
    <div className="lg:w-80 bg-card border-r border-border p-4 space-y-4 overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Détails du document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center text-sm">
            <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium">Référence:</span>
            <span className="ml-2">{document.reference_number}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium">Date:</span>
            <span className="ml-2">{formatDate(document.document_date)}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <FileType className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium">Type:</span>
            <Badge variant="secondary" className="ml-2">{document.document_type}</Badge>
          </div>
          
          {document.document_categories && (
            <div className="flex items-center text-sm">
              <FileType className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Catégorie:</span>
              <Badge className="ml-2">{document.document_categories.name}</Badge>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium">Confidentialité:</span>
            <Badge variant={
              document.confidentiality_level === 'C3' ? 'destructive' :
              document.confidentiality_level === 'C2' ? 'default' :
              document.confidentiality_level === 'C1' ? 'secondary' : 'outline'
            } className="ml-2">
              {document.confidentiality_level === 'C0' ? 'C0 – Public' :
               document.confidentiality_level === 'C1' ? 'C1 – Interne' :
               document.confidentiality_level === 'C2' ? 'C2 – Confidentiel' :
               'C3 – Très Confidentiel'}
            </Badge>
          </div>
          
          {document.issuing_department && (
            <div className="flex items-center text-sm">
              <Building className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Service:</span>
              <span className="ml-2">{document.issuing_department}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <FileType className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium">Taille:</span>
            <span className="ml-2">{formatFileSize(document.file_size)}</span>
          </div>
          
          {document.budget_year && (
            <div className="bg-ministry-gold/10 p-2 rounded-md text-xs">
              <p><span className="font-medium">Année budgétaire:</span> {document.budget_year}</p>
              {document.budget_program && (
                <p><span className="font-medium">Programme:</span> {document.budget_program}</p>
              )}
              {document.market_type && (
                <p><span className="font-medium">Type de marché:</span> {document.market_type}</p>
              )}
            </div>
          )}

          {document.archive_code && (
            <div className="bg-primary/10 p-3 rounded-md space-y-1">
              <div className="flex items-center gap-1 text-sm font-medium">
                <Archive className="h-4 w-4" />
                Code d'archivage
              </div>
              <p className="text-sm font-mono">{document.archive_code}</p>
              {document.archive_zone && (
                <div className="text-xs space-y-0.5 mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{document.archive_zone} › {document.archive_room} › {document.archive_cabinet}</span>
                  </div>
                  {document.archive_shelf && <p>Rayon: {document.archive_shelf}</p>}
                  {document.archive_box && <p>Boîte: {document.archive_box}</p>}
                  {document.archive_folder && <p>Dossier: {document.archive_folder}</p>}
                </div>
              )}
            </div>
          )}
          
          {document.description && (
            <div className="space-y-1">
              <span className="text-sm font-medium">Description:</span>
              <p className="text-xs text-muted-foreground">{document.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

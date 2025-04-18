
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Document } from "@/types/document";
import { formatDate, formatFileSize } from "@/utils/documentUtils";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, FileType, Hash, Info, User, Building } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getDocumentHistory } from "@/services/documentService";

interface DocumentViewerProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentViewer = ({ document, isOpen, onClose }: DocumentViewerProps) => {
  const [activeTab, setActiveTab] = useState<string>("preview");
  
  const { data: documentHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["documentHistory", document?.id],
    queryFn: () => getDocumentHistory(document?.id || ""),
    enabled: !!document && activeTab === "history",
  });

  if (!document) return null;

  // Détermine si le document est un PDF, une image ou un autre type
  const isPdf = document.file_type?.includes("pdf");
  const isImage = document.file_type?.includes("image") || 
                 document.file_type?.includes("jpg") || 
                 document.file_type?.includes("png") || 
                 document.file_type?.includes("jpeg");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{document.title}</DialogTitle>
          <DialogDescription>
            {document.reference_number} - {document.document_type}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 overflow-auto">
            <div className="h-[60vh] border rounded-md bg-muted/30 overflow-hidden">
              {isPdf && (
                <iframe 
                  src={`https://knvrrwesxppwldomarhn.supabase.co/storage/v1/object/public/documents/${document.file_path}#toolbar=0&navpanes=0`} 
                  className="w-full h-full" 
                  title={document.title}
                />
              )}
              {isImage && (
                <div className="flex items-center justify-center h-full">
                  <img 
                    src={`https://knvrrwesxppwldomarhn.supabase.co/storage/v1/object/public/documents/${document.file_path}`} 
                    alt={document.title} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
              {!isPdf && !isImage && (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-muted-foreground">Aperçu non disponible pour ce type de fichier.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => window.open(`https://knvrrwesxppwldomarhn.supabase.co/storage/v1/object/public/documents/${document.file_path}`, '_blank')}
                  >
                    Télécharger pour visualiser
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {historyLoading ? (
              <div className="py-10 text-center">
                <p className="text-muted-foreground">Chargement de l'historique...</p>
              </div>
            ) : documentHistory && documentHistory.length > 0 ? (
              <div className="space-y-2">
                {documentHistory.map((entry, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 rounded-md border">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          {entry.action_type === "upload" && "Ajout du document"}
                          {entry.action_type === "update" && "Modification du document"}
                          {entry.action_type === "delete" && "Suppression du document"}
                          {entry.action_type === "view" && "Consultation du document"}
                        </span>
                        <span className="text-xs text-muted-foreground">{formatDate(entry.performed_at)}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{entry.user_fullname || "Utilisateur inconnu"}</span>
                      </div>
                      {entry.details && entry.details.notes && (
                        <p className="text-xs mt-1">{entry.details.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-muted-foreground">Aucun historique disponible pour ce document.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

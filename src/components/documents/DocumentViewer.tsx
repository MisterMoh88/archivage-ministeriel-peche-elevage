
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Document } from "@/types/document";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getDocumentHistory } from "@/services/documents/historyService";
import { DocumentPreview } from "./DocumentPreview";
import { DocumentDetails } from "./DocumentDetails";
import { DocumentHistory } from "./DocumentHistory";
import { PDFViewerPage } from "./PDFViewerPage";
import { toast } from "sonner";
import { handleDownload } from "@/utils/documentUtils";
import { checkFileExists } from "@/services/documents/previewService";
import { getSupabasePublicUrl } from "@/utils/documentUtils";

interface DocumentViewerProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentViewer = ({ document, isOpen, onClose }: DocumentViewerProps) => {
  if (!document || !isOpen) return null;
  
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [documentExists, setDocumentExists] = useState<boolean>(true);
  
  const { data: documentHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["documentHistory", document.id],
    queryFn: () => getDocumentHistory(document.id || ""),
    enabled: !!document && activeTab === "history",
  });

  useEffect(() => {
    if (document && document.file_path) {
      checkFileExists(document.file_path)
        .then(exists => {
          setDocumentExists(exists);
          console.log("Document exists:", exists, "Path:", document.file_path);
        })
        .catch(error => {
          console.error("Erreur lors de la vérification du document:", error);
          setDocumentExists(true);
        });
    }
  }, [document]);

  const downloadDocument = () => {
    if (document && document.file_path) {
      handleDownload(document.file_path, document.title)
        .then(() => {
          toast.success("Document téléchargé avec succès");
        })
        .catch((error) => {
          console.error("Erreur lors du téléchargement:", error);
          toast.error("Erreur lors du téléchargement du document");
        });
    }
  };

  // Amélioration de la détection PDF
  const isPDF = document.file_type?.toLowerCase().includes('pdf') || 
                document.file_path?.toLowerCase().endsWith('.pdf') ||
                document.title?.toLowerCase().endsWith('.pdf');

  const documentUrl = (document?.file_path && documentExists)
    ? getSupabasePublicUrl(document.file_path)
    : null;

  useEffect(() => {
    console.log("Document details:", {
      title: document.title,
      fileType: document.file_type,
      filePath: document.file_path,
      isPDF: isPDF,
      documentUrl: documentUrl,
      exists: documentExists
    });
  }, [document, isPDF, documentUrl, documentExists]);

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

          <TabsContent value="preview" className="flex-1 overflow-auto relative">
            {!documentExists ? (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <p className="text-destructive font-medium mb-2">Ce document n'est plus disponible dans le stockage</p>
                <p className="text-muted-foreground text-sm text-center mb-4">
                  Le fichier a peut-être été supprimé ou déplacé.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => toast.info("Un administrateur a été notifié du problème")}
                >
                  Signaler le problème
                </Button>
              </div>
            ) : isPDF && documentUrl ? (
              <div className="h-full">
                <PDFViewerPage 
                  fileUrl={documentUrl} 
                  documentTitle={document.title}
                />
              </div>
            ) : (
              <DocumentPreview document={document} />
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <DocumentDetails document={document} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <DocumentHistory history={documentHistory} isLoading={historyLoading} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={downloadDocument} disabled={!documentExists}>
            Télécharger
          </Button>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Document } from "@/types/document";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getDocumentHistory } from "@/services/documents/historyService";
import { DocumentPreview } from "./DocumentPreview";
import { DocumentDetails } from "./DocumentDetails";
import { DocumentHistory } from "./DocumentHistory";
import { toast } from "sonner";
import { handleDownload } from "@/utils/documentUtils";

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

  // Ne rendre le Dialog que si isOpen est true pour éviter les erreurs de hooks React
  if (!isOpen) return null;

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
            <DocumentPreview document={document} />
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <DocumentDetails document={document} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <DocumentHistory history={documentHistory} isLoading={historyLoading} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={downloadDocument}>Télécharger</Button>
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

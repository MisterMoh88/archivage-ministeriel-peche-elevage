
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Document } from "@/types/document";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getDocumentHistory } from "@/services/documents/historyService";
import { DocumentDetails } from "./DocumentDetails";
import { DocumentHistory } from "./DocumentHistory";
import { toast } from "sonner";
import { handleDownload } from "@/utils/documentUtils";
import { checkFileExists } from "@/services/documents/previewService";

interface DocumentViewerProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentViewer = ({ document, isOpen, onClose }: DocumentViewerProps) => {
  if (!document || !isOpen) return null;
  
  const [activeTab, setActiveTab] = useState<string>("details");
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{document.title}</DialogTitle>
          <DialogDescription>
            {document.reference_number} - {document.document_type}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 overflow-auto">
            <DocumentDetails document={document} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4 overflow-auto">
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

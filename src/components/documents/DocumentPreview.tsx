
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, File, Download } from "lucide-react";
import { toast } from "sonner";
import { Document } from "@/types/document";
import { getDocumentPreviewUrl, checkFileExists } from "@/services/documents/previewService";
import { logDocumentView } from "@/utils/documentUtils";

interface DocumentPreviewProps {
  document: Document;
}

export const DocumentPreview = ({ document }: DocumentPreviewProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fileType = document.file_type?.toLowerCase() ?? "inconnu";

  const isPdf = fileType.includes("pdf");
  const isImage = ["image", "jpg", "jpeg", "png", "gif", "bmp"].some(type => fileType.includes(type));
  const isOfficeDoc = ["doc", "docx", "xls", "xlsx", "csv", "ppt", "pptx"].some(type => fileType.includes(type));

  useEffect(() => {
    fetchPublicUrl();
    if (document.id) {
      logDocumentView(document.id).catch(console.error);
    }
  }, [document]);

  const fetchPublicUrl = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!document.file_path) {
        throw new Error("Chemin du fichier manquant");
      }

      const exists = await checkFileExists(document.file_path);
      if (!exists) {
        throw new Error("Ce document n'existe plus dans le système de stockage");
      }

      const url = await getDocumentPreviewUrl(document.file_path);
      setPublicUrl(`${url}?t=${Date.now()}`); // Anti-cache
      setRetryCount(0);
    } catch (err: any) {
      console.error("Erreur lors de la récupération de l'URL du document:", err);
      setError(err.message || "Erreur lors de la récupération du document");

      if (retryCount < maxRetries && !err.message.includes("n'existe plus")) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          console.log(`Tentative automatique ${retryCount + 1}/${maxRetries}`);
          fetchPublicUrl();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (publicUrl) {
      const downloadUrl = publicUrl.split("?")[0];
      window.open(downloadUrl, "_blank");
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    fetchPublicUrl();
    toast.info("Tentative de rechargement du document...");
  };

  const handleReportIssue = () => {
    toast.success("Le problème a été signalé à l'administrateur", {
      description: `Document: ${document.title}, Type: ${document.file_type}, ID: ${document.id}`,
    });
  };

  if (loading) {
    return (
      <div className="h-[60vh] border rounded-md bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-10 w-10 animate-spin text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Chargement du document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] border rounded-md bg-muted/30 flex items-center justify-center">
        <div className="w-3/4 max-w-lg">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de chargement</AlertTitle>
            <AlertDescription>
              Impossible de charger le document. {error}
            </AlertDescription>
          </Alert>
          <div className="flex flex-col gap-2 sm:flex-row justify-center">
            <Button variant="outline" onClick={handleRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
            <Button variant="outline" onClick={handleReportIssue}>
              <AlertCircle className="mr-2 h-4 w-4" />
              Signaler le problème
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!publicUrl) {
    return (
      <div className="h-[60vh] border rounded-md bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <File className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Lien du document non disponible</p>
          <Button variant="outline" className="mt-4" onClick={handleRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[60vh] border rounded-md bg-muted/30 overflow-hidden">
      {/* Bouton Télécharger global */}
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 z-10"
        onClick={handleDownload}
      >
        <Download className="w-4 h-4 mr-2" />
        Télécharger
      </Button>

      {isPdf && (
        <iframe
          src={`${publicUrl}#toolbar=0&navpanes=0`}
          className="w-full h-full"
          title={document.title}
          sandbox=""
          onError={() => setError("Erreur d'affichage du PDF")}
        />
      )}

      {isImage && (
        <div className="flex items-center justify-center h-full">
          <img
            src={publicUrl}
            alt={document.title}
            className="max-w-full max-h-full object-contain"
            onError={() => setError("Erreur d'affichage de l'image")}
          />
        </div>
      )}

      {isOfficeDoc && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <p className="text-muted-foreground">
            Aperçu non disponible pour ce type de fichier Office.
          </p>
          <Button variant="outline" className="mt-4" onClick={handleDownload}>
            Télécharger pour ouvrir
          </Button>
        </div>
      )}

      {!isPdf && !isImage && !isOfficeDoc && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <p className="text-muted-foreground">Aperçu non disponible pour ce type de fichier.</p>
          <Button variant="outline" className="mt-4" onClick={handleDownload}>
            Télécharger pour visualiser
          </Button>
        </div>
      )}
    </div>
  );
};

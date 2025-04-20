import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, File } from "lucide-react";
import { toast } from "sonner";
import { Document } from "@/types/document";
import { supabase } from "@/integrations/supabase/client";
import { logDocumentView } from "@/utils/documentUtils";

interface DocumentPreviewProps {
  document: Document;
}

export const DocumentPreview = ({ document }: DocumentPreviewProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  const isPdf = document.file_type?.includes("pdf");
  const isImage = document.file_type?.includes("image") || 
                 document.file_type?.includes("jpg") || 
                 document.file_type?.includes("png") || 
                 document.file_type?.includes("jpeg");

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
      
      // Vérifier que le chemin du fichier existe
      if (!document.file_path) {
        throw new Error("Chemin du fichier manquant");
      }
      
      // Obtenir l'URL publique - Noter que la nouvelle API ne retourne plus d'erreur séparément
      const { data } = await supabase.storage
        .from('documents')
        .getPublicUrl(document.file_path);
      
      if (!data || !data.publicUrl) {
        throw new Error("Impossible d'obtenir l'URL publique");
      }

      setPublicUrl(data.publicUrl);
    } catch (err: any) {
      console.error("Erreur lors de la récupération de l'URL du document:", err);
      setError(err.message || "Erreur lors de la récupération du document");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (publicUrl) {
      window.open(publicUrl, '_blank');
    }
  };

  const handleRetry = () => {
    fetchPublicUrl();
    toast.info("Tentative de rechargement du document...");
  };

  const handleReportIssue = () => {
    // Simuler un signalement à l'administrateur
    toast.success("Le problème a été signalé à l'administrateur");
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
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={handleRetry}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[60vh] border rounded-md bg-muted/30 overflow-hidden">
      {isPdf && (
        <iframe 
          src={`${publicUrl}#toolbar=0&navpanes=0`}
          className="w-full h-full" 
          title={document.title}
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
      {!isPdf && !isImage && (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-muted-foreground">Aperçu non disponible pour ce type de fichier.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={handleDownload}
          >
            Télécharger pour visualiser
          </Button>
        </div>
      )}
    </div>
  );
};

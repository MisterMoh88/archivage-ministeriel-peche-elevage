
import { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkFileExists } from "@/services/documents/previewService";
import { toast } from "sonner";

interface PDFViewerProps {
  fileUrl: string | null;
}

export const PDFViewer = ({ fileUrl }: PDFViewerProps) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Fonction pour vérifier si le fichier existe avant d'essayer de le charger
  const verifyFileAndPrepareUrl = async (url: string | null) => {
    if (!url) return null;
    
    setIsLoading(true);
    
    try {
      // Extraire le chemin du fichier de l'URL
      const filePath = url.includes('documents/') 
        ? url.split('documents/')[1].split('?')[0] 
        : null;
      
      if (!filePath) {
        setLoadError("Chemin de fichier invalide");
        setIsLoading(false);
        return null;
      }
      
      // Vérifier si le fichier existe
      const exists = await checkFileExists(filePath);
      
      if (!exists) {
        setLoadError("Le fichier demandé n'existe plus ou est inaccessible");
        setIsLoading(false);
        return null;
      }
      
      // Ajouter timestamp pour éviter les problèmes de cache
      const urlWithCacheBuster = `${url.split('?')[0]}?t=${Date.now()}`;
      return urlWithCacheBuster;
    } catch (error) {
      console.error("Erreur lors de la vérification du fichier:", error);
      return url; // Continuer avec l'URL originale si la vérification échoue
    }
  };

  // Reset error state when URL changes and add parameter to bypass cache
  useEffect(() => {
    const prepareUrl = async () => {
      if (fileUrl) {
        setLoadError(null);
        setIsLoading(true);
        
        const preparedUrl = await verifyFileAndPrepareUrl(fileUrl);
        setCurrentUrl(preparedUrl);
      } else {
        setCurrentUrl(null);
        setIsLoading(false);
      }
    };
    
    prepareUrl();
  }, [fileUrl]);

  const handleLoadError = () => {
    if (retryCount < maxRetries) {
      // Auto-retry logic
      console.log(`Tentative automatique ${retryCount + 1}/${maxRetries}`);
      setRetryCount(prev => prev + 1);
      handleRetry();
    } else {
      setLoadError("Impossible de charger le document PDF après plusieurs tentatives. Vérifiez votre connexion ou essayez à nouveau plus tard.");
      setIsLoading(false);
    }
  };

  const handleLoadSuccess = () => {
    setLoadError(null);
    setIsLoading(false);
    setRetryCount(0); // Reset retry count on success
  };

  const handleRetry = () => {
    setLoadError(null);
    setIsLoading(true);
    // Force reload by adding timestamp to URL
    if (fileUrl) {
      const refreshedUrl = `${fileUrl.split('?')[0]}?t=${Date.now()}_${Math.random()}`;
      setCurrentUrl(refreshedUrl);
      toast.info("Tentative de rechargement du document...");
    }
  };

  if (!fileUrl) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Aucun document PDF à afficher
        </AlertDescription>
      </Alert>
    );
  }

  if (loadError) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur de chargement</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{loadError}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={handleRetry}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Critical fix: Don't render PDF viewer if URL is null or empty string
  if (!currentUrl) {
    return (
      <div className="h-[60vh] border rounded-md overflow-hidden bg-background relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <RefreshCw className="h-8 w-8 animate-spin text-ministry-blue" />
            <p className="mt-2 text-sm text-muted-foreground">Préparation du document...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[60vh] border rounded-md overflow-hidden bg-background relative">
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
        <Viewer
          fileUrl={currentUrl}
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={1}
          theme="light"
          onDocumentLoad={handleLoadSuccess}
          renderError={(error) => {
            // This function must return a React element
            handleLoadError();
            return (
              <div className="flex flex-col items-center justify-center h-full">
                <AlertCircle className="h-12 w-12 text-destructive mb-2" />
                <p className="text-destructive font-medium">Erreur de chargement du PDF</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4" 
                  onClick={handleRetry}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            );
          }}
        />
      </Worker>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="flex flex-col items-center">
            <RefreshCw className="h-8 w-8 animate-spin text-ministry-blue" />
            <p className="mt-2 text-sm text-muted-foreground">Chargement du document...</p>
          </div>
        </div>
      )}
    </div>
  );
};

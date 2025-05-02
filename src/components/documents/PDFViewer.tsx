
import { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface PDFViewerProps {
  fileUrl: string | null;
}

export const PDFViewer = ({ fileUrl }: PDFViewerProps) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Réinitialiser l'état d'erreur quand l'URL change
  useEffect(() => {
    setLoadError(null);
    setIsLoading(true);
  }, [fileUrl]);

  const handleLoadError = () => {
    setLoadError("Impossible de charger le document PDF. Vérifiez votre connexion ou essayez à nouveau plus tard.");
    setIsLoading(false);
  };

  const handleLoadSuccess = () => {
    setLoadError(null);
    setIsLoading(false);
  };

  const handleRetry = () => {
    setLoadError(null);
    setIsLoading(true);
    // Force le rechargement en ajoutant un timestamp à l'URL
    const refreshedUrl = fileUrl ? `${fileUrl}?t=${Date.now()}` : null;
    if (refreshedUrl) {
      const img = new Image();
      img.onload = () => setIsLoading(false);
      img.onerror = handleLoadError;
      img.src = refreshedUrl;
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

  return (
    <div className="h-[60vh] border rounded-md overflow-hidden bg-background">
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={1}
          theme="light"
          onDocumentLoad={handleLoadSuccess}
          renderError={() => {
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

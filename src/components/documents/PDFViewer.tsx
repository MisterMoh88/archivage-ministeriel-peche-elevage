
import { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PDFViewerProps {
  fileUrl: string | null;
}

export const PDFViewer = ({ fileUrl }: PDFViewerProps) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Reset error state when URL changes
  useEffect(() => {
    if (fileUrl) {
      setLoadError(null);
      setIsLoading(true);
      setRetryCount(0);
    }
  }, [fileUrl]);

  const handleLoadSuccess = () => {
    setLoadError(null);
    setIsLoading(false);
    setRetryCount(0);
    console.log("PDF chargé avec succès");
  };

  const handleLoadError = (error: any) => {
    console.error("Erreur de chargement PDF:", error);
    setIsLoading(false);
    
    if (retryCount < maxRetries) {
      const nextRetryCount = retryCount + 1;
      setRetryCount(nextRetryCount);
      console.log(`Tentative automatique ${nextRetryCount}/${maxRetries}`);
      
      // Auto-retry après 2 secondes
      setTimeout(() => {
        setIsLoading(true);
        setLoadError(null);
      }, 2000);
    } else {
      setLoadError("Impossible de charger le document PDF après plusieurs tentatives. Le fichier pourrait être corrompu ou inaccessible.");
    }
  };

  const handleRetry = () => {
    setLoadError(null);
    setIsLoading(true);
    setRetryCount(0);
    toast.info("Tentative de rechargement du document...");
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
    <div className="h-[60vh] border rounded-md overflow-hidden bg-background relative">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={1}
          theme="light"
          onDocumentLoad={handleLoadSuccess}
          renderError={(error) => {
            console.error("Erreur de rendu PDF:", error);
            handleLoadError(error);
            return (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-destructive font-medium mb-2">Erreur de chargement du PDF</p>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Le document ne peut pas être affiché. Vérifiez que le fichier est valide.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
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
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <RefreshCw className="h-8 w-8 animate-spin text-ministry-blue mb-2" />
            <p className="text-sm text-muted-foreground">Chargement du document PDF...</p>
          </div>
        </div>
      )}
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkFileAccessibility } from "@/utils/documentUtils";

interface DocumentPDFViewerProps {
  documentUrl: string;
  onLoadSuccess: () => void;
  onLoadError: (error: any) => void;
  loading: boolean;
}

export const DocumentPDFViewer = ({ 
  documentUrl, 
  onLoadSuccess, 
  onLoadError, 
  loading 
}: DocumentPDFViewerProps) => {
  const [fileAccessible, setFileAccessible] = useState<boolean | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      defaultTabs[0], // Thumbnails
      defaultTabs[1], // Bookmarks
    ],
    toolbarPlugin: {
      searchPlugin: {
        keyword: '',
      },
    },
  });

  // Vérifier l'accessibilité du fichier au montage du composant
  useEffect(() => {
    const checkAccess = async () => {
      if (!documentUrl) return;
      
      setCheckingAccess(true);
      console.log("Vérification de l'accessibilité du fichier:", documentUrl);
      
      const accessible = await checkFileAccessibility(documentUrl);
      console.log("Fichier accessible:", accessible);
      
      setFileAccessible(accessible);
      setCheckingAccess(false);
      
      if (!accessible) {
        onLoadError(new Error(`Le fichier n'est pas accessible à l'URL: ${documentUrl}`));
      }
    };

    checkAccess();
  }, [documentUrl, onLoadError]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleOpenInNewTab = () => {
    window.open(documentUrl, '_blank');
  };

  // Affichage pendant la vérification d'accessibilité
  if (checkingAccess) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-ministry-blue" />
          <p className="text-sm text-muted-foreground">
            Vérification de l'accessibilité du document...
          </p>
        </div>
      </div>
    );
  }

  // Affichage si le fichier n'est pas accessible
  if (fileAccessible === false) {
    return (
      <div className="flex-1 p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Document non accessible</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>Le document ne peut pas être chargé depuis le stockage. Cela peut être dû à :</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Le fichier a été supprimé ou déplacé</li>
              <li>Les permissions d'accès au bucket de stockage</li>
              <li>Un problème de connectivité réseau</li>
            </ul>
            <div className="flex space-x-2 mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRetry}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleOpenInNewTab}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ouvrir dans un nouvel onglet
              </Button>
            </div>
            <div className="mt-2 p-2 bg-muted rounded text-xs">
              <strong>URL du document:</strong> {documentUrl}
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div className="h-full w-full">
          <Viewer
            fileUrl={documentUrl}
            plugins={[defaultLayoutPluginInstance]}
            defaultScale={1}
            theme="light"
            onDocumentLoad={onLoadSuccess}
            renderError={(error) => {
              console.error("Erreur de rendu PDF:", error);
              onLoadError(error);
              return (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <AlertCircle className="h-16 w-16 text-destructive mb-4" />
                  <h3 className="text-lg font-medium text-destructive mb-2">
                    Erreur de chargement du PDF
                  </h3>
                  <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
                    Le document ne peut pas être affiché. Vérifiez que le fichier est valide et accessible.
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={handleRetry}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Réessayer
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleOpenInNewTab}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ouvrir dans un nouvel onglet
                    </Button>
                  </div>
                  <div className="mt-4 p-2 bg-muted rounded text-xs max-w-lg">
                    <strong>Détails de l'erreur:</strong> {error.message || 'Erreur inconnue'}
                  </div>
                </div>
              );
            }}
          />
        </div>
      </Worker>
      
      {/* Indicateur de chargement */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin text-ministry-blue" />
            <p className="text-sm text-muted-foreground">
              Chargement du document PDF...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

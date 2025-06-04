
import React, { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X, Download, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface PDFViewerPageProps {
  fileUrl: string;
  onClose?: () => void;
  documentTitle?: string;
}

type ViewerState = 'loading' | 'pdf-viewer' | 'google-viewer' | 'error';

export const PDFViewerPage = ({ 
  fileUrl, 
  onClose, 
  documentTitle = "Document PDF" 
}: PDFViewerPageProps) => {
  const [viewerState, setViewerState] = useState<ViewerState>('loading');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      defaultTabs[0], // Thumbnails
      defaultTabs[1], // Bookmarks
    ],
  });

  // Reset viewer state when URL changes
  useEffect(() => {
    if (fileUrl) {
      console.log("🔄 Initialisation de la visionneuse pour:", fileUrl);
      setViewerState('loading');
      setRetryCount(0);
    }
  }, [fileUrl]);

  const handlePDFLoadSuccess = () => {
    console.log("✅ PDF chargé avec succès via PDF Viewer");
    setViewerState('pdf-viewer');
    setRetryCount(0);
  };

  const handlePDFLoadError = (error: any) => {
    console.error("❌ Erreur PDF Viewer:", error);
    
    if (retryCount < maxRetries) {
      const nextRetryCount = retryCount + 1;
      setRetryCount(nextRetryCount);
      console.log(`🔄 Tentative PDF ${nextRetryCount}/${maxRetries}`);
      
      // Retry après un court délai
      setTimeout(() => {
        setViewerState('loading');
      }, 1000);
    } else {
      console.log("📱 Basculement vers Google Docs Viewer");
      setViewerState('google-viewer');
    }
  };

  const handleGoogleViewerError = () => {
    console.error("❌ Erreur Google Docs Viewer");
    setViewerState('error');
  };

  const handleDownload = async () => {
    try {
      console.log("💾 Tentative de téléchargement:", fileUrl);
      
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${documentTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Document téléchargé avec succès");
    } catch (error) {
      console.error("❌ Erreur de téléchargement:", error);
      toast.error("Erreur lors du téléchargement du document");
    }
  };

  const handleRetry = () => {
    console.log("🔄 Nouvelle tentative demandée");
    setViewerState('loading');
    setRetryCount(0);
  };

  const renderContent = () => {
    switch (viewerState) {
      case 'loading':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <RefreshCw className="h-12 w-12 animate-spin text-blue-600" />
              <p className="text-lg text-muted-foreground">
                Chargement du document...
              </p>
              <p className="text-sm text-muted-foreground">
                Tentative {retryCount + 1} sur {maxRetries + 1}
              </p>
            </div>
          </div>
        );

      case 'pdf-viewer':
        return (
          <div className="flex-1 bg-gray-100">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer
                fileUrl={fileUrl}
                plugins={[defaultLayoutPluginInstance]}
                defaultScale={1}
                theme="light"
                onDocumentLoad={handlePDFLoadSuccess}
                renderError={(error) => {
                  console.error("❌ Erreur de rendu PDF:", error);
                  handlePDFLoadError(error);
                  return (
                    <div className="flex items-center justify-center h-full">
                      <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  );
                }}
              />
            </Worker>
          </div>
        );

      case 'google-viewer':
        const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
        return (
          <div className="flex-1 bg-gray-100">
            <iframe
              src={googleViewerUrl}
              className="w-full h-full border-0"
              title="Google Docs Viewer"
              onError={handleGoogleViewerError}
              onLoad={() => {
                console.log("✅ Google Docs Viewer chargé avec succès");
              }}
            />
          </div>
        );

      case 'error':
        return (
          <div className="flex-1 flex items-center justify-center p-8">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Document non accessible</AlertTitle>
              <AlertDescription className="space-y-4">
                <p>
                  Le document ne peut pas être affiché dans la visionneuse. 
                  Cela peut être dû à un format non supporté ou à un problème de réseau.
                </p>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleDownload}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le document
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={handleRetry}
                    className="w-full"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* En-tête */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Visionneuse de document
          </h1>
          {documentTitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {documentTitle}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
          
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4 mr-2" />
              Fermer
            </Button>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 min-h-0">
        {renderContent()}
      </div>

      {/* Indicateur de méthode d'affichage */}
      {viewerState !== 'loading' && viewerState !== 'error' && (
        <div className="px-4 py-2 bg-muted/50 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            {viewerState === 'pdf-viewer' 
              ? '📄 Affiché via PDF Viewer' 
              : '🌐 Affiché via Google Docs Viewer'
            }
          </p>
        </div>
      )}
    </div>
  );
};

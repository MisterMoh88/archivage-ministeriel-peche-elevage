
import React, { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw, AlertCircle, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface PDFViewerProps {
  fileUrl: string;
  documentTitle?: string;
  onClose?: () => void;
}

export const PDFViewer = ({ fileUrl, documentTitle = "Document PDF", onClose }: PDFViewerProps) => {
  const [viewerState, setViewerState] = useState<'loading' | 'success' | 'error' | 'fallback'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [defaultTabs[0]], // Garde seulement l'onglet des miniatures
    toolbarPlugin: {
      fullScreenPlugin: {
        enableShortcuts: true,
      },
      getFilePlugin: {
        fileNameGenerator: () => documentTitle,
      },
      printPlugin: {
        enableShortcuts: true,
      },
      rotatePlugin: {
        enableShortcuts: true,
      },
      searchPlugin: {
        enableShortcuts: true,
      },
      zoomPlugin: {
        enableShortcuts: true,
      },
    },
  });

  // Réinitialise l'état quand l'URL change
  useEffect(() => {
    setViewerState('loading');
    setErrorMessage('');
    setRetryCount(0);
  }, [fileUrl]);

  const handleDocumentLoad = () => {
    console.log('✅ Document PDF chargé avec succès');
    setViewerState('success');
    toast.success('Document chargé avec succès');
  };

  const handleViewerError = () => {
    console.error('❌ Erreur de la visionneuse PDF');
    setErrorMessage('Erreur de la visionneuse PDF par défaut');
    
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      toast.warning(`Tentative ${retryCount + 1}/${maxRetries} - Utilisation du fallback Google Docs...`);
      setViewerState('fallback');
    } else {
      setViewerState('error');
      toast.error('Impossible d\'afficher le document avec toutes les méthodes');
    }
  };

  const handleIframeLoad = () => {
    console.log('✅ Document chargé via Google Docs Viewer');
    setViewerState('success');
  };

  const handleIframeError = () => {
    console.error('❌ Erreur du fallback Google Docs');
    setViewerState('error');
    setErrorMessage('Échec de toutes les méthodes de visualisation');
  };

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = documentTitle;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Téléchargement initié');
    } catch (error) {
      console.error('Erreur de téléchargement:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  const handleOpenInNewTab = () => {
    window.open(fileUrl, '_blank');
  };

  const handleRetry = () => {
    setViewerState('loading');
    setErrorMessage('');
    setRetryCount(0);
  };

  const renderViewer = () => {
    switch (viewerState) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center h-full bg-muted/30">
            <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-lg font-medium">Chargement du document...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Initialisation de la visionneuse PDF
            </p>
          </div>
        );

      case 'success':
        return null; // Le viewer/iframe est affiché

      case 'fallback':
        return (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            className="w-full h-full border-0"
            title={documentTitle}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        );

      case 'error':
        return (
          <div className="flex flex-col items-center justify-center h-full bg-muted/30 p-6">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Impossible d'afficher le document</AlertTitle>
              <AlertDescription className="space-y-4">
                <p>{errorMessage}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Solutions alternatives :</p>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={handleDownload} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le document
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleOpenInNewTab} className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ouvrir dans un nouvel onglet
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleRetry} className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Réessayer
                    </Button>
                  </div>
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
    <div className="h-full flex flex-col bg-background">
      {/* Header avec titre et actions */}
      <div className="bg-muted border-b p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold truncate">{documentTitle}</h1>
          <p className="text-sm text-muted-foreground">Visionneuse PDF avancée</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
          {onClose && (
            <Button size="sm" variant="outline" onClick={onClose}>
              Fermer
            </Button>
          )}
        </div>
      </div>

      {/* Zone de contenu */}
      <div className="flex-1 relative">
        {/* Visionneuse PDF par défaut */}
        {(viewerState === 'loading' || viewerState === 'success') && (
          <div className="absolute inset-0">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={fileUrl}
                plugins={[defaultLayoutPluginInstance]}
                onDocumentLoad={handleDocumentLoad}
                renderError={handleViewerError}
                defaultScale={1.0}
              />
            </Worker>
          </div>
        )}

        {/* Overlay pour les états spéciaux */}
        {renderViewer()}
      </div>

      {/* Spécifications techniques en bas */}
      <div className="bg-muted/50 border-t p-3 text-xs text-muted-foreground flex-shrink-0">
        <div className="flex flex-wrap items-center gap-4">
          <span><strong>Formats supportés:</strong> PDF (toutes versions), PDF/A, PDF scannés</span>
          <span><strong>Taille max:</strong> 50MB recommandé</span>
          <span><strong>Fallback:</strong> Google Docs Viewer</span>
        </div>
      </div>
    </div>
  );
};

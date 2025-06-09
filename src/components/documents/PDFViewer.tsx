
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PDFViewerHeader } from './pdf/PDFViewerHeader';
import { PDFViewerFooter } from './pdf/PDFViewerFooter';
import { PDFLoadingState } from './pdf/PDFLoadingState';
import { PDFErrorState } from './pdf/PDFErrorState';
import { PDFFallbackViewer } from './pdf/PDFFallbackViewer';
import { PDFNativeViewer } from './pdf/PDFNativeViewer';
import { downloadFile, openInNewTab } from './pdf/pdfUtils';

interface PDFViewerProps {
  fileUrl: string;
  documentTitle?: string;
  onClose?: () => void;
}

type ViewerState = 'loading' | 'success' | 'error' | 'fallback';

export const PDFViewer = ({ fileUrl, documentTitle = "Document PDF", onClose }: PDFViewerProps) => {
  const [viewerState, setViewerState] = useState<ViewerState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

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
    const success = downloadFile(fileUrl, documentTitle);
    if (success) {
      toast.success('Téléchargement initié');
    } else {
      toast.error('Erreur lors du téléchargement');
    }
  };

  const handleOpenInNewTab = () => {
    openInNewTab(fileUrl);
  };

  const handleRetry = () => {
    setViewerState('loading');
    setErrorMessage('');
    setRetryCount(0);
  };

  const renderContent = () => {
    switch (viewerState) {
      case 'loading':
        return <PDFLoadingState />;

      case 'fallback':
        return (
          <PDFFallbackViewer
            fileUrl={fileUrl}
            documentTitle={documentTitle}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        );

      case 'error':
        return (
          <PDFErrorState
            errorMessage={errorMessage}
            onDownload={handleDownload}
            onOpenInNewTab={handleOpenInNewTab}
            onRetry={handleRetry}
          />
        );

      case 'success':
        return null; // Le viewer principal est affiché
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <PDFViewerHeader
        documentTitle={documentTitle}
        onDownload={handleDownload}
        onClose={onClose}
      />

      <div className="flex-1 relative">
        {/* Visionneuse PDF par défaut */}
        {(viewerState === 'loading' || viewerState === 'success') && (
          <div className="absolute inset-0">
            <PDFNativeViewer
              fileUrl={fileUrl}
              documentTitle={documentTitle}
              onDocumentLoad={handleDocumentLoad}
              onError={handleViewerError}
            />
          </div>
        )}

        {/* Overlay pour les états spéciaux */}
        {renderContent()}
      </div>

      <PDFViewerFooter />
    </div>
  );
};

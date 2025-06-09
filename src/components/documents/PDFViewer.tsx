
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

type ViewerState = 'loading' | 'success' | 'fallback' | 'error';

export const PDFViewer = ({ fileUrl, documentTitle = "Document PDF", onClose }: PDFViewerProps) => {
  const [viewerState, setViewerState] = useState<ViewerState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [hasTriedNative, setHasTriedNative] = useState(false);

  // Réinitialise l'état quand l'URL change
  useEffect(() => {
    setViewerState('loading');
    setErrorMessage('');
    setHasTriedNative(false);
  }, [fileUrl]);

  const handleDocumentLoad = () => {
    console.log('✅ Document PDF chargé avec succès');
    setViewerState('success');
    setHasTriedNative(true);
    toast.success('Document chargé avec succès');
  };

  const handleViewerError = () => {
    console.error('❌ Erreur de la visionneuse PDF');
    setErrorMessage('Erreur de la visionneuse PDF par défaut');
    setHasTriedNative(true);
    
    // Une seule tentative - passage direct au fallback
    toast.warning('Utilisation du mode de compatibilité...');
    setViewerState('fallback');
  };

  const handleFallbackLoad = () => {
    console.log('✅ Document chargé via Google Docs Viewer');
    setViewerState('success');
  };

  const handleFallbackError = () => {
    console.error('❌ Erreur du fallback Google Docs');
    setViewerState('error');
    setErrorMessage('Impossible d\'afficher le document. Veuillez le télécharger pour le consulter.');
    toast.error('Impossible d\'afficher le document');
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
    toast.info('Document ouvert dans un nouvel onglet');
  };

  const handleRetry = () => {
    setViewerState('loading');
    setErrorMessage('');
    setHasTriedNative(false);
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
            onLoad={handleFallbackLoad}
            onError={handleFallbackError}
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
        return null; // Le viewer approprié est affiché
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
        {/* Visionneuse PDF native - une seule tentative */}
        {(viewerState === 'loading' || (viewerState === 'success' && hasTriedNative)) && (
          <div className="absolute inset-0">
            <PDFNativeViewer
              fileUrl={fileUrl}
              documentTitle={documentTitle}
              onDocumentLoad={handleDocumentLoad}
              onError={handleViewerError}
            />
          </div>
        )}

        {/* Visionneuse fallback */}
        {viewerState === 'fallback' && (
          <div className="absolute inset-0">
            <PDFFallbackViewer
              fileUrl={fileUrl}
              documentTitle={documentTitle}
              onLoad={handleFallbackLoad}
              onError={handleFallbackError}
            />
          </div>
        )}

        {/* Overlay pour les états de chargement et d'erreur */}
        {(viewerState === 'loading' || viewerState === 'error') && renderContent()}
      </div>

      <PDFViewerFooter />
    </div>
  );
};

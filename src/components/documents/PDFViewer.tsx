
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

type ViewerState = 'loading' | 'native' | 'fallback' | 'error';

export const PDFViewer = ({ fileUrl, documentTitle = "Document PDF", onClose }: PDFViewerProps) => {
  const [viewerState, setViewerState] = useState<ViewerState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Réinitialise l'état quand l'URL change
  useEffect(() => {
    setViewerState('loading');
    setErrorMessage('');
  }, [fileUrl]);

  const handleDocumentLoad = () => {
    console.log('✅ Document PDF chargé avec succès (visionneuse native)');
    setViewerState('native');
    toast.success('Document chargé avec succès');
  };

  const handleViewerError = () => {
    console.error('❌ Erreur de la visionneuse PDF native, passage au fallback');
    setErrorMessage('Erreur de la visionneuse PDF par défaut');
    
    // Passage direct au fallback - une seule fois
    toast.warning('Utilisation du mode de compatibilité...');
    setViewerState('fallback');
  };

  const handleFallbackLoad = () => {
    console.log('✅ Document chargé via Google Docs Viewer');
    // On reste en état 'fallback' mais on cache le message de chargement
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
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <PDFViewerHeader
        documentTitle={documentTitle}
        onDownload={handleDownload}
        onClose={onClose}
      />

      <div className="flex-1 relative">
        {/* État de chargement */}
        {viewerState === 'loading' && (
          <PDFLoadingState />
        )}

        {/* Visionneuse PDF native */}
        {(viewerState === 'loading' || viewerState === 'native') && (
          <div className="absolute inset-0">
            <PDFNativeViewer
              fileUrl={fileUrl}
              documentTitle={documentTitle}
              onDocumentLoad={handleDocumentLoad}
              onError={handleViewerError}
            />
          </div>
        )}

        {/* Visionneuse fallback - seulement si en mode fallback */}
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

        {/* État d'erreur */}
        {viewerState === 'error' && (
          <PDFErrorState
            errorMessage={errorMessage}
            onDownload={handleDownload}
            onOpenInNewTab={handleOpenInNewTab}
            onRetry={handleRetry}
          />
        )}
      </div>

      <PDFViewerFooter />
    </div>
  );
};

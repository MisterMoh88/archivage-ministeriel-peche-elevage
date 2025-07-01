
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PDFViewerHeader } from './pdf/PDFViewerHeader';
import { PDFViewerFooter } from './pdf/PDFViewerFooter';
import { PDFLoadingState } from './pdf/PDFLoadingState';
import { PDFErrorState } from './pdf/PDFErrorState';
import { PDFFallbackViewer } from './pdf/PDFFallbackViewer';
import { PDFOptimizedViewer } from './pdf/PDFOptimizedViewer';
import { downloadFile, openInNewTab } from './pdf/pdfUtils';
import { usePDFOptimization } from '@/hooks/usePDFOptimization';

interface PDFViewerProps {
  fileUrl: string;
  documentTitle?: string;
  onClose?: () => void;
}

type ViewerState = 'loading' | 'optimized' | 'fallback' | 'error';

export const PDFViewer = ({ fileUrl, documentTitle = "Document PDF", onClose }: PDFViewerProps) => {
  const [viewerState, setViewerState] = useState<ViewerState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Hook d'optimisation PDF
  const { state: optimizationState, actions: optimizationActions } = usePDFOptimization({
    fileUrl,
    cacheEnabled: true,
    preloadPages: 2,
    timeoutMs: 10000
  });

  // Réinitialise l'état quand l'URL change
  useEffect(() => {
    setViewerState('loading');
    setErrorMessage('');
  }, [fileUrl]);

  // Gestion de l'état d'optimisation
  useEffect(() => {
    if (optimizationState.recommendFallback && viewerState === 'loading') {
      console.warn('⚠️ Connexion lente détectée, basculement recommandé vers le fallback');
      toast.warning('Connexion lente détectée. Basculement vers le mode de compatibilité...');
      setViewerState('fallback');
    }
  }, [optimizationState.recommendFallback, viewerState]);

  const handleOptimizedViewerLoad = () => {
    console.log('✅ Document PDF chargé avec la visionneuse optimisée');
    const loadTime = optimizationActions.recordLoadTime();
    
    setViewerState('optimized');
    
    if (optimizationState.cacheHit) {
      toast.success('Document chargé depuis le cache');
    } else if (loadTime < 3000) {
      toast.success('Document chargé rapidement');
    } else {
      toast.success('Document chargé');
    }
    
    optimizationActions.clearTimeout();
  };

  const handleOptimizedViewerError = () => {
    console.error('❌ Erreur de la visionneuse PDF optimisée, passage au fallback');
    setErrorMessage('Erreur de la visionneuse PDF optimisée');
    
    toast.warning('Basculement vers le mode de compatibilité...');
    setViewerState('fallback');
  };

  const handleFallbackLoad = () => {
    console.log('✅ Document chargé via Google Docs Viewer (fallback)');
    toast.info('Document chargé en mode de compatibilité');
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
    optimizationActions.startTimeout();
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
          <div className="absolute inset-0">
            <PDFLoadingState />
            {/* Visionneuse optimisée en arrière-plan */}
            <div className="opacity-0 pointer-events-none">
              <PDFOptimizedViewer
                fileUrl={optimizationActions.getOptimizedUrl()}
                documentTitle={documentTitle}
                onDocumentLoad={handleOptimizedViewerLoad}
                onError={handleOptimizedViewerError}
              />
            </div>
          </div>
        )}

        {/* Visionneuse PDF optimisée */}
        {viewerState === 'optimized' && (
          <div className="absolute inset-0">
            <PDFOptimizedViewer
              fileUrl={optimizationActions.getOptimizedUrl()}
              documentTitle={documentTitle}
              onDocumentLoad={handleOptimizedViewerLoad}
              onError={handleOptimizedViewerError}
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
      
      {/* Indicateur de performance en développement */}
      {process.env.NODE_ENV === 'development' && optimizationState.isOptimized && (
        <div className="bg-muted p-2 text-xs text-muted-foreground border-t">
          Performance: {optimizationState.loadTime.toFixed(0)}ms | 
          Connexion: {optimizationState.connectionSpeed} | 
          Cache: {optimizationState.cacheHit ? 'HIT' : 'MISS'}
        </div>
      )}
    </div>
  );
};

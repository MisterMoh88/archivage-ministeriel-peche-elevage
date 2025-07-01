
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

interface PDFOptimizedViewerProps {
  fileUrl: string;
  documentTitle: string;
  onDocumentLoad: () => void;
  onError: () => void;
}

interface LoadingState {
  isLoading: boolean;
  progress: number;
  currentPage: number;
  totalPages: number;
  error: boolean;
  slowConnection: boolean;
}

export const PDFOptimizedViewer = ({ 
  fileUrl, 
  documentTitle, 
  onDocumentLoad, 
  onError 
}: PDFOptimizedViewerProps) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    progress: 0,
    currentPage: 1,
    totalPages: 0,
    error: false,
    slowConnection: false
  });

  const [currentZoom, setCurrentZoom] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Plugins avec configuration optimisée
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const zoomPluginInstance = zoomPlugin();
  const toolbarPluginInstance = toolbarPlugin({
    fullScreenPlugin: {
      enableShortcuts: true,
    },
    getFilePlugin: {
      fileNameGenerator: () => documentTitle,
    },
    printPlugin: {
      enableShortcuts: true,
    },
    searchPlugin: {
      enableShortcuts: true,
    },
    zoomPlugin: {
      enableShortcuts: true,
    },
  });

  // Sauvegarde de la position de lecture
  const saveReadingPosition = useCallback((page: number) => {
    localStorage.setItem(`pdf-position-${fileUrl}`, page.toString());
  }, [fileUrl]);

  // Restauration de la position de lecture
  const getLastReadingPosition = useCallback(() => {
    const saved = localStorage.getItem(`pdf-position-${fileUrl}`);
    return saved ? parseInt(saved, 10) : 1;
  }, [fileUrl]);

  // Gestion du timeout de chargement lent
  useEffect(() => {
    startTimeRef.current = Date.now();
    
    // Timeout pour détecter une connexion lente
    loadingTimeoutRef.current = setTimeout(() => {
      if (loadingState.isLoading) {
        setLoadingState(prev => ({ ...prev, slowConnection: true }));
        toast.warning('Connexion lente détectée. Le document peut prendre plus de temps à charger.');
      }
    }, 10000);

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [fileUrl]);

  // Gestion du chargement du document
  const handleDocumentLoad = useCallback((e: any) => {
    const loadTime = Date.now() - startTimeRef.current;
    const numPages = e.doc.numPages;
    
    console.log(`✅ Document PDF chargé en ${loadTime}ms avec ${numPages} pages`);
    
    setLoadingState({
      isLoading: false,
      progress: 100,
      currentPage: getLastReadingPosition(),
      totalPages: numPages,
      error: false,
      slowConnection: loadTime > 10000
    });

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    onDocumentLoad();
    toast.success(`Document chargé (${numPages} pages)`);
  }, [onDocumentLoad, getLastReadingPosition]);

  // Gestion des erreurs
  const handleError = useCallback(() => {
    console.error('❌ Erreur lors du chargement du PDF optimisé');
    setLoadingState(prev => ({ ...prev, error: true, isLoading: false }));
    onError();
  }, [onError]);

  // Gestion du changement de page
  const handlePageChange = useCallback((e: any) => {
    const newPage = e.currentPage + 1; // pdf.js utilise l'index 0
    setLoadingState(prev => ({ ...prev, currentPage: newPage }));
    saveReadingPosition(newPage);
  }, [saveReadingPosition]);

  // Navigation manuelle des pages
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= loadingState.totalPages) {
      pageNavigationPluginInstance.jumpToPage(page - 1);
      setLoadingState(prev => ({ ...prev, currentPage: page }));
      saveReadingPosition(page);
    }
  }, [loadingState.totalPages, pageNavigationPluginInstance, saveReadingPosition]);

  // Contrôles de zoom
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(currentZoom * 1.2, 3.0);
    setCurrentZoom(newZoom);
    zoomPluginInstance.zoom(newZoom);
  }, [currentZoom, zoomPluginInstance]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(currentZoom / 1.2, 0.5);
    setCurrentZoom(newZoom);
    zoomPluginInstance.zoom(newZoom);
  }, [currentZoom, zoomPluginInstance]);

  // Téléchargement du document
  const handleDownload = useCallback(() => {
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
  }, [fileUrl, documentTitle]);

  // Configuration du rendu avec optimisations
  const renderPage = useCallback((props: any) => {
    return (
      <>
        {props.canvasLayer.children}
        <div style={{ userSelect: 'none' }}>
          {props.textLayer.children}
        </div>
        {props.annotationLayer.children}
      </>
    );
  }, []);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Barre d'outils personnalisée */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => goToPage(loadingState.currentPage - 1)}
            disabled={loadingState.currentPage <= 1 || loadingState.isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium min-w-0">
            {loadingState.isLoading ? 'Chargement...' : 
             `Page ${loadingState.currentPage} / ${loadingState.totalPages}`}
          </span>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => goToPage(loadingState.currentPage + 1)}
            disabled={loadingState.currentPage >= loadingState.totalPages || loadingState.isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-sm min-w-0">
            {Math.round(currentZoom * 100)}%
          </span>
          
          <Button size="sm" variant="outline" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Indicateur de progression */}
      {loadingState.isLoading && (
        <div className="p-4 bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {loadingState.slowConnection ? 'Connexion lente détectée...' : 'Chargement du document...'}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(loadingState.progress)}%
            </span>
          </div>
          <Progress value={loadingState.progress} className="h-2" />
          {loadingState.slowConnection && (
            <p className="text-xs text-amber-600 mt-2">
              Le document peut prendre plus de temps à charger en raison d'une connexion lente
            </p>
          )}
        </div>
      )}

      {/* Visionneuse PDF */}
      <div className="flex-1 relative">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl={fileUrl}
            plugins={[
              pageNavigationPluginInstance,
              zoomPluginInstance,
              toolbarPluginInstance,
            ]}
            onDocumentLoad={handleDocumentLoad}
            onPageChange={handlePageChange}
            renderError={handleError}
            renderPage={renderPage}
            defaultScale={SpecialZoomLevel.PageFit}
            initialPage={getLastReadingPosition() - 1}
            // Optimisations pour les performances
            renderLoader={(percentages: number) => {
              const progress = percentages * 100;
              setLoadingState(prev => ({ ...prev, progress }));
              return (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Chargement... {Math.round(progress)}%
                  </p>
                </div>
              );
            }}
            // Configuration pour le rendu page par page
            renderProtectedView={() => (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Document protégé</p>
              </div>
            )}
          />
        </Worker>
      </div>
    </div>
  );
};

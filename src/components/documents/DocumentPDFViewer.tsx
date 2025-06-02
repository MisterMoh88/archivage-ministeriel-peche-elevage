
import React, { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, ExternalLink, FileText } from "lucide-react";
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
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);

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

  // Diagnostic approfondi du fichier
  useEffect(() => {
    const performDiagnostic = async () => {
      if (!documentUrl) return;
      
      setCheckingAccess(true);
      console.log("🔍 Diagnostic complet du document:", documentUrl);
      
      const diagnostic = {
        url: documentUrl,
        timestamp: new Date().toISOString(),
        accessible: false,
        responseStatus: null,
        responseHeaders: {},
        errorDetails: null
      };

      try {
        // Test d'accessibilité avec plus de détails
        const response = await fetch(documentUrl, { 
          method: 'HEAD',
          mode: 'cors',
          cache: 'no-cache'
        });
        
        diagnostic.accessible = response.ok;
        diagnostic.responseStatus = response.status;
        diagnostic.responseHeaders = Object.fromEntries(response.headers.entries());
        
        console.log("📊 Diagnostic détaillé:", diagnostic);
        
        if (!response.ok) {
          diagnostic.errorDetails = `HTTP ${response.status}: ${response.statusText}`;
        }
      } catch (error: any) {
        console.error("❌ Erreur lors du diagnostic:", error);
        diagnostic.errorDetails = error.message;
        diagnostic.accessible = false;
      }
      
      setDiagnosticInfo(diagnostic);
      setFileAccessible(diagnostic.accessible);
      setCheckingAccess(false);
      
      if (!diagnostic.accessible) {
        onLoadError(new Error(`Document inaccessible: ${diagnostic.errorDetails || 'Erreur inconnue'}`));
      }
    };

    performDiagnostic();
  }, [documentUrl, onLoadError]);

  const handleRetry = () => {
    console.log("🔄 Tentative de rechargement...");
    setCheckingAccess(true);
    setFileAccessible(null);
    setDiagnosticInfo(null);
    window.location.reload();
  };

  const handleOpenInNewTab = () => {
    console.log("🌐 Ouverture dans un nouvel onglet:", documentUrl);
    window.open(documentUrl, '_blank');
  };

  const handleDownloadDirect = async () => {
    try {
      console.log("💾 Tentative de téléchargement direct:", documentUrl);
      const response = await fetch(documentUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Erreur de téléchargement:", error);
    }
  };

  // Affichage pendant la vérification d'accessibilité
  if (checkingAccess) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-ministry-blue" />
          <p className="text-sm text-muted-foreground">
            Diagnostic du document en cours...
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
            <p>Le document ne peut pas être chargé. Diagnostic :</p>
            
            {diagnosticInfo && (
              <div className="bg-muted p-3 rounded text-xs space-y-2">
                <div><strong>URL:</strong> {diagnosticInfo.url}</div>
                <div><strong>Statut HTTP:</strong> {diagnosticInfo.responseStatus || 'N/A'}</div>
                <div><strong>Erreur:</strong> {diagnosticInfo.errorDetails || 'Inconnue'}</div>
                {diagnosticInfo.responseHeaders && Object.keys(diagnosticInfo.responseHeaders).length > 0 && (
                  <div>
                    <strong>En-têtes de réponse:</strong>
                    <pre className="mt-1 text-xs bg-background p-2 rounded overflow-auto">
                      {JSON.stringify(diagnosticInfo.responseHeaders, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Le fichier a été supprimé ou déplacé du stockage</li>
              <li>Problème de permissions d'accès au bucket Supabase</li>
              <li>URL de stockage incorrecte ou expirée</li>
              <li>Problème de connectivité réseau</li>
            </ul>

            <div className="flex flex-wrap gap-2 mt-4">
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
                Nouvel onglet
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadDirect}
              >
                <FileText className="h-4 w-4 mr-2" />
                Téléchargement direct
              </Button>
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
            onDocumentLoad={(e) => {
              console.log("✅ Document PDF chargé avec succès:", e);
              onLoadSuccess();
            }}
            renderError={(error) => {
              console.error("❌ Erreur de rendu PDF:", error);
              onLoadError(error);
              return (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <AlertCircle className="h-16 w-16 text-destructive mb-4" />
                  <h3 className="text-lg font-medium text-destructive mb-2">
                    Erreur de chargement du PDF
                  </h3>
                  <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
                    Le document PDF ne peut pas être affiché. Cela peut être dû à un fichier corrompu ou un format non supporté.
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
                    <Button 
                      variant="outline" 
                      onClick={handleDownloadDirect}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Télécharger
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

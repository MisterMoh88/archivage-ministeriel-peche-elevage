
import React, { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, ExternalLink, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { performDocumentDiagnostic } from "@/utils/documentUtils";

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
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

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

  // Diagnostic détaillé du fichier
  useEffect(() => {
    const performDiagnostic = async () => {
      if (!documentUrl) return;
      
      setCheckingAccess(true);
      console.log("🔍 Démarrage du diagnostic pour:", documentUrl);
      
      try {
        // Extraire le chemin du fichier depuis l'URL
        const urlParts = documentUrl.split('/documents/');
        const filePath = urlParts.length > 1 ? decodeURIComponent(urlParts[1].split('?')[0]) : '';
        
        if (!filePath) {
          throw new Error("Impossible d'extraire le chemin du fichier depuis l'URL");
        }
        
        const diagnostic = await performDocumentDiagnostic(filePath);
        setDiagnosticInfo(diagnostic);
        
        // Vérifier si le diagnostic contient un objet d'accessibilité ou une erreur
        if ('success' in diagnostic && !diagnostic.success) {
          setFileAccessible(false);
          onLoadError(new Error(`Erreur de diagnostic: ${diagnostic.error}`));
        } else if ('accessibility' in diagnostic && diagnostic.accessibility && diagnostic.accessibility.accessible) {
          setFileAccessible(true);
        } else {
          setFileAccessible(false);
          const errorMessage = 'accessibility' in diagnostic && diagnostic.accessibility?.details?.errorMessage 
            ? diagnostic.accessibility.details.errorMessage 
            : 'Erreur inconnue';
          onLoadError(new Error(`Document inaccessible: ${errorMessage}`));
        }
      } catch (error: any) {
        console.error("❌ Erreur durant le diagnostic:", error);
        setDiagnosticInfo({ error: error.message });
        setFileAccessible(false);
        onLoadError(error);
      } finally {
        setCheckingAccess(false);
      }
    };

    performDiagnostic();
  }, [documentUrl, onLoadError]);

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      console.log(`🔄 Tentative ${retryCount + 1}/${maxRetries}`);
      setRetryCount(prev => prev + 1);
      setCheckingAccess(true);
      setFileAccessible(null);
      setDiagnosticInfo(null);
    } else {
      console.log("❌ Nombre maximum de tentatives atteint");
      window.location.reload();
    }
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
            <p>Le document ne peut pas être chargé.</p>
            
            {diagnosticInfo && (
              <div className="bg-muted p-3 rounded text-xs space-y-2">
                <div><strong>URL:</strong> {documentUrl}</div>
                {/* Vérification sécurisée du diagnostic */}
                {diagnosticInfo && 'accessibility' in diagnosticInfo && diagnosticInfo.accessibility?.details && (
                  <>
                    <div><strong>Statut HTTP:</strong> {diagnosticInfo.accessibility.details.httpStatus || 'N/A'}</div>
                    <div><strong>Erreur:</strong> {diagnosticInfo.accessibility.details.errorMessage || 'Inconnue'}</div>
                    <div><strong>CORS activé:</strong> {diagnosticInfo.accessibility.details.corsEnabled ? 'Oui' : 'Non'}</div>
                    <div><strong>Fichier dans bucket:</strong> {diagnosticInfo.bucketFileExists ? 'Oui' : 'Non'}</div>
                  </>
                )}
                {diagnosticInfo && 'error' in diagnosticInfo && (
                  <div><strong>Erreur de diagnostic:</strong> {diagnosticInfo.error}</div>
                )}
              </div>
            )}

            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Le fichier a été supprimé ou déplacé du stockage</li>
              <li>Problème de permissions d'accès au bucket Supabase</li>
              <li>URL de stockage incorrecte ou corrompue</li>
              <li>Problème de connectivité réseau</li>
            </ul>

            <div className="flex flex-wrap gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRetry}
                disabled={retryCount >= maxRetries}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {retryCount >= maxRetries ? 'Recharger la page' : 'Réessayer'}
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
                Télécharger
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <div className="h-full w-full">
          <Viewer
            fileUrl={documentUrl}
            plugins={[defaultLayoutPluginInstance]}
            defaultScale={1}
            theme="light"
            onDocumentLoad={(e) => {
              console.log("✅ Document PDF chargé avec succès");
              onLoadSuccess();
            }}
            renderError={(error) => {
              console.error("❌ Erreur de rendu PDF:", error);
              onLoadError(error);
              return (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <AlertCircle className="h-16 w-16 text-destructive mb-4" />
                  <h3 className="text-lg font-medium text-destructive mb-2">
                    Erreur de rendu PDF
                  </h3>
                  <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
                    Le document PDF ne peut pas être affiché. Cela peut être dû à un fichier corrompu.
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={handleRetry}
                      disabled={retryCount >= maxRetries}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {retryCount >= maxRetries ? 'Recharger' : 'Réessayer'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleOpenInNewTab}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Nouvel onglet
                    </Button>
                  </div>
                  {diagnosticInfo && (
                    <div className="mt-4 p-2 bg-muted rounded text-xs max-w-lg">
                      <strong>Détails:</strong> {error.message || 'Erreur inconnue'}
                    </div>
                  )}
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

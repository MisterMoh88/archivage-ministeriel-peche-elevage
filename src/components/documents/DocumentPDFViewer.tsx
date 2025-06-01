
import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

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

  const handleRetry = () => {
    window.location.reload();
  };

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
                  <Button 
                    variant="outline" 
                    onClick={handleRetry}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </Button>
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

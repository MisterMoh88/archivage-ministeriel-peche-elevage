
import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface PDFNativeViewerProps {
  fileUrl: string;
  documentTitle: string;
  onDocumentLoad: () => void;
  onError: () => void;
}

export const PDFNativeViewer = ({ fileUrl, documentTitle, onDocumentLoad, onError }: PDFNativeViewerProps) => {
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
      searchPlugin: {
        enableShortcuts: true,
      },
      zoomPlugin: {
        enableShortcuts: true,
      },
    },
  });

  const renderError = () => {
    onError();
    return <div>Erreur de chargement du PDF</div>;
  };

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <Viewer
        fileUrl={fileUrl}
        plugins={[defaultLayoutPluginInstance]}
        onDocumentLoad={onDocumentLoad}
        renderError={renderError}
        defaultScale={1.0}
      />
    </Worker>
  );
};

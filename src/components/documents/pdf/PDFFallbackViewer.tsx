
import React from 'react';
import { createGoogleDocsViewerUrl } from './pdfUtils';

interface PDFFallbackViewerProps {
  fileUrl: string;
  documentTitle: string;
  onLoad: () => void;
  onError: () => void;
}

export const PDFFallbackViewer = ({ fileUrl, documentTitle, onLoad, onError }: PDFFallbackViewerProps) => {
  return (
    <iframe
      src={createGoogleDocsViewerUrl(fileUrl)}
      className="w-full h-full border-0"
      title={documentTitle}
      onLoad={onLoad}
      onError={onError}
    />
  );
};

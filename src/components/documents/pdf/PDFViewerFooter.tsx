
import React from 'react';

export const PDFViewerFooter = () => {
  return (
    <div className="bg-muted/50 border-t p-3 text-xs text-muted-foreground flex-shrink-0">
      <div className="flex flex-wrap items-center gap-4">
        <span><strong>Formats supportés:</strong> PDF (toutes versions), PDF/A, PDF scannés</span>
        <span><strong>Taille max:</strong> 50MB recommandé</span>
        <span><strong>Fallback:</strong> Google Docs Viewer</span>
      </div>
    </div>
  );
};

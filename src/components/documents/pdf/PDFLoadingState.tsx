
import React from 'react';
import { RefreshCw } from 'lucide-react';

export const PDFLoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-muted/30">
      <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mb-4" />
      <p className="text-lg font-medium">Chargement du document...</p>
      <p className="text-sm text-muted-foreground mt-2">
        Initialisation de la visionneuse PDF
      </p>
    </div>
  );
};

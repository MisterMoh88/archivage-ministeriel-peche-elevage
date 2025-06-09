
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Download, ExternalLink, RefreshCw } from 'lucide-react';

interface PDFErrorStateProps {
  errorMessage: string;
  onDownload: () => void;
  onOpenInNewTab: () => void;
  onRetry: () => void;
}

export const PDFErrorState = ({ errorMessage, onDownload, onOpenInNewTab, onRetry }: PDFErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-muted/30 p-6">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Impossible d'afficher le document</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>{errorMessage}</p>
          <div className="space-y-2">
            <p className="text-sm font-medium">Solutions alternatives :</p>
            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={onDownload} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Télécharger le document
              </Button>
              <Button size="sm" variant="outline" onClick={onOpenInNewTab} className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ouvrir dans un nouvel onglet
              </Button>
              <Button size="sm" variant="outline" onClick={onRetry} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface PDFViewerHeaderProps {
  documentTitle: string;
  onDownload: () => void;
  onClose?: () => void;
}

export const PDFViewerHeader = ({ documentTitle, onDownload, onClose }: PDFViewerHeaderProps) => {
  return (
    <div className="bg-muted border-b p-4 flex items-center justify-between flex-shrink-0">
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold truncate">{documentTitle}</h1>
        <p className="text-sm text-muted-foreground">Visionneuse PDF avancée</p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Button size="sm" variant="outline" onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Télécharger
        </Button>
        {onClose && (
          <Button size="sm" variant="outline" onClick={onClose}>
            Fermer
          </Button>
        )}
      </div>
    </div>
  );
};

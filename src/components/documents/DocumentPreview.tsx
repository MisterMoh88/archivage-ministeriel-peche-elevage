
import React from "react";
import { Button } from "@/components/ui/button";
import { Document } from "@/types/document";

interface DocumentPreviewProps {
  document: Document;
}

export const DocumentPreview = ({ document }: DocumentPreviewProps) => {
  const isPdf = document.file_type?.includes("pdf");
  const isImage = document.file_type?.includes("image") || 
                 document.file_type?.includes("jpg") || 
                 document.file_type?.includes("png") || 
                 document.file_type?.includes("jpeg");
                 
  const getPublicUrl = (filePath: string) => {
    return `https://knvrrwesxppwldomarhn.supabase.co/storage/v1/object/public/documents/${filePath}`;
  };

  return (
    <div className="h-[60vh] border rounded-md bg-muted/30 overflow-hidden">
      {isPdf && (
        <iframe 
          src={`${getPublicUrl(document.file_path)}#toolbar=0&navpanes=0`}
          className="w-full h-full" 
          title={document.title}
        />
      )}
      {isImage && (
        <div className="flex items-center justify-center h-full">
          <img 
            src={getPublicUrl(document.file_path)}
            alt={document.title} 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
      {!isPdf && !isImage && (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-muted-foreground">Aperçu non disponible pour ce type de fichier.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.open(getPublicUrl(document.file_path), '_blank')}
          >
            Télécharger pour visualiser
          </Button>
        </div>
      )}
    </div>
  );
};

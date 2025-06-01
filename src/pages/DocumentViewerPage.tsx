
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/document";
import { getSupabasePublicUrl } from "@/utils/documentUtils";
import { DocumentViewerHeader } from "@/components/documents/DocumentViewerHeader";
import { DocumentViewerLoading } from "@/components/documents/DocumentViewerLoading";
import { DocumentViewerError } from "@/components/documents/DocumentViewerError";
import { DocumentDetailsPanel } from "@/components/documents/DocumentDetailsPanel";
import { DocumentPDFViewer } from "@/components/documents/DocumentPDFViewer";

interface DocumentViewerPageProps {
  fileUrl?: string;
}

const DocumentViewerPage = ({ fileUrl: propFileUrl }: DocumentViewerPageProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Récupération des paramètres
  const documentId = searchParams.get('id');
  const fileUrl = propFileUrl || searchParams.get('url') || searchParams.get('fileUrl');

  // Récupération des informations du document depuis la base de données
  const { data: document, isLoading: documentLoading, error: documentError } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      if (!documentId) return null;
      
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          document_categories(name, description)
        `)
        .eq('id', documentId)
        .single();

      if (error) {
        throw error;
      }

      return data as Document;
    },
    enabled: !!documentId,
  });

  // URL du document à afficher
  const documentUrl = document?.file_path 
    ? getSupabasePublicUrl(document.file_path)
    : fileUrl;

  const documentTitle = document?.title || searchParams.get('title') || 'Document PDF';

  useEffect(() => {
    if (documentUrl) {
      setLoading(true);
      setError(null);
      setRetryCount(0);
    }
  }, [documentUrl]);

  const handleLoadSuccess = () => {
    setLoading(false);
    setError(null);
    setRetryCount(0);
    console.log("Document PDF chargé avec succès");
  };

  const handleLoadError = (error: any) => {
    console.error("Erreur de chargement du PDF:", error);
    setLoading(false);
    
    if (retryCount < maxRetries) {
      const nextRetryCount = retryCount + 1;
      setRetryCount(nextRetryCount);
      console.log(`Tentative automatique ${nextRetryCount}/${maxRetries}`);
      
      // Auto-retry après 2 secondes
      setTimeout(() => {
        setLoading(true);
        setError(null);
      }, 2000);
    } else {
      setError("Impossible de charger le document PDF. Vérifiez que l'URL est valide et que le fichier est accessible.");
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setRetryCount(0);
    toast.info("Rechargement du document...");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (documentLoading) {
    return <DocumentViewerLoading />;
  }

  if (documentError || (!documentUrl && !fileUrl)) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <DocumentViewerHeader title={documentTitle} onGoBack={handleGoBack} />
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Document non trouvé</AlertTitle>
            <AlertDescription>
              {documentError 
                ? "Erreur lors de la récupération du document." 
                : "Aucun document ou URL fournie. Veuillez spécifier un paramètre 'id' ou 'url'."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (error) {
    return <DocumentViewerError error={error} onRetry={handleRetry} onGoBack={handleGoBack} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DocumentViewerHeader title={documentTitle} onGoBack={handleGoBack} />

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {document && <DocumentDetailsPanel document={document} />}
        
        {documentUrl && (
          <DocumentPDFViewer
            documentUrl={documentUrl}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={handleLoadError}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentViewerPage;


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
  const maxRetries = 2; // Réduit pour éviter les boucles infinies

  // Récupération des paramètres
  const documentId = searchParams.get('id');
  const fileUrl = propFileUrl || searchParams.get('url') || searchParams.get('fileUrl');

  console.log("🔍 DocumentViewerPage - Paramètres:", {
    documentId,
    fileUrl,
    propFileUrl,
    searchParams: Object.fromEntries(searchParams.entries())
  });

  // Récupération des informations du document depuis la base de données
  const { data: document, isLoading: documentLoading, error: documentError } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      if (!documentId) return null;
      
      console.log("📄 Récupération du document:", documentId);
      
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          document_categories(name, description)
        `)
        .eq('id', documentId)
        .single();

      if (error) {
        console.error("❌ Erreur lors de la récupération du document:", error);
        throw error;
      }

      console.log("✅ Document récupéré:", data);
      return data as Document;
    },
    enabled: !!documentId,
  });

  // URL du document à afficher
  const documentUrl = document?.file_path 
    ? getSupabasePublicUrl(document.file_path)
    : fileUrl;

  const documentTitle = document?.title || searchParams.get('title') || 'Document PDF';

  console.log("🌐 URL finale du document:", {
    documentPath: document?.file_path,
    documentUrl,
    documentTitle
  });

  useEffect(() => {
    if (documentUrl) {
      console.log("🔄 Réinitialisation pour nouvelle URL:", documentUrl);
      setLoading(true);
      setError(null);
      setRetryCount(0);
    }
  }, [documentUrl]);

  const handleLoadSuccess = () => {
    console.log("✅ Document chargé avec succès");
    setLoading(false);
    setError(null);
    setRetryCount(0);
  };

  const handleLoadError = (error: any) => {
    console.error("❌ Erreur de chargement du PDF:", error);
    setLoading(false);
    
    const errorMessage = error?.message || "Erreur inconnue";
    console.log(`🔄 Tentative ${retryCount + 1}/${maxRetries} - Erreur: ${errorMessage}`);
    
    if (retryCount < maxRetries) {
      const nextRetryCount = retryCount + 1;
      setRetryCount(nextRetryCount);
      
      // Auto-retry après 3 secondes avec un délai progressif
      const retryDelay = nextRetryCount * 2000; // 2s, 4s
      console.log(`⏱️ Nouvelle tentative dans ${retryDelay}ms`);
      
      setTimeout(() => {
        console.log(`🔄 Tentative automatique ${nextRetryCount}/${maxRetries}`);
        setLoading(true);
        setError(null);
      }, retryDelay);
    } else {
      console.log("❌ Nombre maximum de tentatives atteint");
      setError(`Impossible de charger le document après ${maxRetries} tentatives. ${errorMessage}`);
    }
  };

  const handleRetry = () => {
    console.log("🔄 Tentative manuelle de rechargement");
    setError(null);
    setLoading(true);
    setRetryCount(0);
    toast.info("Rechargement du document...");
  };

  const handleGoBack = () => {
    console.log("⬅️ Retour à la page précédente");
    navigate(-1);
  };

  if (documentLoading) {
    return <DocumentViewerLoading message="Récupération des informations du document..." />;
  }

  if (documentError || (!documentUrl && !fileUrl)) {
    const errorMsg = documentError 
      ? "Erreur lors de la récupération du document." 
      : "Aucun document ou URL fournie. Veuillez spécifier un paramètre 'id' ou 'url'.";
    
    console.error("❌ Erreur de récupération:", errorMsg);
    
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <DocumentViewerHeader title={documentTitle} onGoBack={handleGoBack} />
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Document non trouvé</AlertTitle>
            <AlertDescription>
              {errorMsg}
              {documentId && (
                <div className="mt-2 text-xs opacity-70">
                  ID du document: {documentId}
                </div>
              )}
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

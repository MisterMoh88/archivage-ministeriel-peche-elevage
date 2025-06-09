
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/document";
import { getSupabasePublicUrl } from "@/utils/documentUtils";
import PDFViewerPage from "@/components/documents/PDFViewerPage";

interface DocumentViewerPageProps {
  fileUrl?: string;
}

const DocumentViewerPage = ({ fileUrl: propFileUrl }: DocumentViewerPageProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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

  const handleGoBack = () => {
    console.log("⬅️ Retour à la page précédente");
    navigate(-1);
  };

  if (documentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-lg text-muted-foreground">
            Récupération des informations du document...
          </p>
        </div>
      </div>
    );
  }

  if (documentError || (!documentUrl && !fileUrl)) {
    const errorMsg = documentError 
      ? "Erreur lors de la récupération du document." 
      : "Aucun document ou URL fournie. Veuillez spécifier un paramètre 'id' ou 'url'.";
    
    console.error("❌ Erreur de récupération:", errorMsg);
    
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
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

  if (!documentUrl) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>URL du document manquante</AlertTitle>
            <AlertDescription>
              Impossible de déterminer l'URL du document à afficher.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <PDFViewerPage 
      fileUrl={documentUrl}
      onClose={handleGoBack}
      documentTitle={documentTitle}
    />
  );
};

export default DocumentViewerPage;

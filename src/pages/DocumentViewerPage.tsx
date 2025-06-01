
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, RefreshCw, Calendar, Hash, Building, FileType } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/document";
import { getSupabasePublicUrl, formatDate, formatFileSize } from "@/utils/documentUtils";

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

  // Configuration du plugin avec toutes les fonctionnalités
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      defaultTabs[0], // Thumbnails
      defaultTabs[1], // Bookmarks
    ],
    toolbarPlugin: {
      searchPlugin: {
        keyword: '',
      },
    },
  });

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
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-ministry-blue" />
            <p className="ml-2 text-muted-foreground">Chargement du document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (documentError || (!documentUrl && !fileUrl)) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Visualisation du document</h1>
            <Button variant="outline" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
          
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
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Visualisation du document</h1>
            <Button variant="outline" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de chargement</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={handleRetry}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* En-tête de la page */}
      <div className="border-b border-border bg-card">
        <div className="max-w-full px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleGoBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Visualisation du document
                </h1>
                {documentTitle && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {documentTitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* Panneau des détails du document */}
        {document && (
          <div className="lg:w-80 bg-card border-r border-border p-4 space-y-4 overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Détails du document</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                  <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Référence:</span>
                  <span className="ml-2">{document.reference_number}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Date:</span>
                  <span className="ml-2">{formatDate(document.document_date)}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <FileType className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Type:</span>
                  <Badge variant="secondary" className="ml-2">{document.document_type}</Badge>
                </div>
                
                {document.document_categories && (
                  <div className="flex items-center text-sm">
                    <FileType className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Catégorie:</span>
                    <Badge className="ml-2">{document.document_categories.name}</Badge>
                  </div>
                )}
                
                {document.issuing_department && (
                  <div className="flex items-center text-sm">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Service:</span>
                    <span className="ml-2">{document.issuing_department}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm">
                  <FileType className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Taille:</span>
                  <span className="ml-2">{formatFileSize(document.file_size)}</span>
                </div>
                
                {document.budget_year && (
                  <div className="bg-ministry-gold/10 p-2 rounded-md text-xs">
                    <p><span className="font-medium">Année budgétaire:</span> {document.budget_year}</p>
                    {document.budget_program && (
                      <p><span className="font-medium">Programme:</span> {document.budget_program}</p>
                    )}
                    {document.market_type && (
                      <p><span className="font-medium">Type de marché:</span> {document.market_type}</p>
                    )}
                  </div>
                )}
                
                {document.description && (
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Description:</span>
                    <p className="text-xs text-muted-foreground">{document.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Conteneur du PDF */}
        <div className="flex-1 relative">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div className="h-full w-full">
              <Viewer
                fileUrl={documentUrl}
                plugins={[defaultLayoutPluginInstance]}
                defaultScale={1}
                theme="light"
                onDocumentLoad={handleLoadSuccess}
                renderError={(error) => {
                  console.error("Erreur de rendu PDF:", error);
                  handleLoadError(error);
                  return (
                    <div className="flex flex-col items-center justify-center h-full p-8">
                      <AlertCircle className="h-16 w-16 text-destructive mb-4" />
                      <h3 className="text-lg font-medium text-destructive mb-2">
                        Erreur de chargement du PDF
                      </h3>
                      <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
                        Le document ne peut pas être affiché. Vérifiez que le fichier est valide et accessible.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={handleRetry}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Réessayer
                      </Button>
                    </div>
                  );
                }}
              />
            </div>
          </Worker>
          
          {/* Indicateur de chargement */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center space-y-4">
                <RefreshCw className="h-8 w-8 animate-spin text-ministry-blue" />
                <p className="text-sm text-muted-foreground">
                  Chargement du document PDF...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerPage;

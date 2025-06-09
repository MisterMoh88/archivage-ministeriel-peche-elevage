
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PDFViewer } from "./PDFViewer";

interface PDFViewerPageProps {
  fileUrl?: string;
  documentTitle?: string;
  onClose?: () => void;
}

const PDFViewerPage = ({ fileUrl: propFileUrl, documentTitle, onClose }: PDFViewerPageProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Récupération de l'URL du fichier depuis les props ou les paramètres URL
  const fileUrl = propFileUrl || searchParams.get("fileUrl") || searchParams.get("url");
  const title = documentTitle || searchParams.get("title") || "Document PDF";

  const handleClose = onClose || (() => navigate(-1));

  console.log("🔍 PDFViewerPage - Paramètres:", {
    propFileUrl,
    fileUrl,
    title,
    searchParams: Object.fromEntries(searchParams.entries())
  });

  if (!fileUrl) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>URL du document manquante</AlertTitle>
            <AlertDescription>
              Aucune URL de document n'a été fournie. Veuillez spécifier un paramètre 'fileUrl', 'url' ou passer l'URL en prop.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <PDFViewer 
        fileUrl={fileUrl}
        documentTitle={title}
        onClose={handleClose}
      />
    </div>
  );
};

export default PDFViewerPage;


import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const PDFViewerPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileUrl = searchParams.get("fileUrl");

  const [fallback, setFallback] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    setIsLoading(true);
    setLoadError(false);
    setFallback(false);
  }, [fileUrl]);

  const handleViewerError = () => {
    toast.warning("Visionneuse PDF par défaut indisponible. Tentative avec Google Docs...");
    setFallback(true);
    setIsLoading(false);
  };

  const handleIframeError = () => {
    toast.error("Impossible d'afficher le document même avec Google Docs");
    setLoadError(true);
    setIsLoading(false);
  };

  const handleSuccess = () => {
    setIsLoading(false);
  };

  if (!fileUrl) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Aucun fichier PDF n’a été fourni.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-muted p-4 flex items-center justify-between border-b">
        <h1 className="text-xl font-semibold">Visionneuse de document</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>Retour</Button>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Chargement du document...</p>
        </div>
      )}

      <div className="flex-1 p-4">
        {!fallback && !loadError && (
          <div className="border rounded-md overflow-hidden h-[80vh]">
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
              <Viewer
                fileUrl={fileUrl}
                plugins={[defaultLayoutPluginInstance]}
                onDocumentLoad={handleSuccess}
                renderError={handleViewerError}
              />
            </Worker>
          </div>
        )}

        {fallback && !loadError && (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            onLoad={handleSuccess}
            onError={handleIframeError}
            className="w-full h-[80vh] border rounded-md"
            title="Document PDF"
          />
        )}

        {loadError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Erreur d'affichage</AlertTitle>
            <AlertDescription>
              Le document n'a pas pu être affiché.{" "}
              <Button
                className="mt-2"
                onClick={() => window.open(fileUrl, "_blank")}
              >
                Télécharger le document
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default PDFViewerPage;

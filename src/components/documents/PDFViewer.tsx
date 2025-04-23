
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PDFViewerProps {
  fileUrl: string | null;
}

export const PDFViewer = ({ fileUrl }: PDFViewerProps) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  if (!fileUrl) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Aucun document PDF à afficher
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="h-[60vh] border rounded-md overflow-hidden bg-background">
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={1}
          theme="light"
        />
      </Worker>
    </div>
  );
};

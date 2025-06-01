
import React from 'react';
import { RefreshCw } from "lucide-react";

interface DocumentViewerLoadingProps {
  message?: string;
}

export const DocumentViewerLoading = ({ message = "Chargement du document..." }: DocumentViewerLoadingProps) => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-ministry-blue" />
          <p className="ml-2 text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
};

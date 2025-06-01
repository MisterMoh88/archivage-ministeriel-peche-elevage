
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface DocumentViewerHeaderProps {
  title: string;
  onGoBack: () => void;
}

export const DocumentViewerHeader = ({ title, onGoBack }: DocumentViewerHeaderProps) => {
  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-full px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Visualisation du document
              </h1>
              {title && (
                <p className="text-sm text-muted-foreground mt-1">
                  {title}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

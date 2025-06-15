
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UploadResult {
  success: boolean;
  fileName: string;
  error?: string;
}

interface UploadResultsProps {
  results: UploadResult[];
}

export const UploadResults = ({ results }: UploadResultsProps) => {
  if (results.length === 0) return null;

  return (
    <Card className="border-ministry-blue/20">
      <CardHeader>
        <CardTitle>Résultats de l'upload</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {results.map((result, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 p-2 rounded ${
                result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <span className="text-sm">
                <strong>{result.fileName}</strong>: {result.success ? 'Succès' : result.error}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

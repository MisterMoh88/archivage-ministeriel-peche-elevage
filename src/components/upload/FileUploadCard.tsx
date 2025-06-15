
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUploadArea } from "@/components/upload/FileUploadArea";
import { UploadResults } from "@/components/upload/UploadResults";
import { FormActions } from "@/components/upload/FormActions";

interface UploadResult {
  success: boolean;
  fileName: string;
  error?: string;
}

interface FileUploadCardProps {
  selectedFiles: File[];
  fileErrors: string[];
  uploadResults: UploadResult[];
  isUploading: boolean;
  isFormValid: boolean;
  onFileChange: (files: File[]) => void;
  onReset: () => void;
}

export const FileUploadCard = ({
  selectedFiles,
  fileErrors,
  uploadResults,
  isUploading,
  isFormValid,
  onFileChange,
  onReset
}: FileUploadCardProps) => {
  return (
    <>
      <Card className="mb-6 border-ministry-blue/20">
        <CardHeader>
          <CardTitle>Téléversement des fichiers</CardTitle>
          <CardDescription>
            Formats acceptés: PDF, DOCX, XLSX, PPTX, JPG, PNG (Max: 20MB chacun, 5 fichiers maximum)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploadArea
            onFileChange={onFileChange}
            errors={fileErrors}
            maxFiles={5}
          />
        </CardContent>
        
        <FormActions
          isUploading={isUploading}
          isFormValid={isFormValid}
          selectedFilesCount={selectedFiles.length}
          onReset={onReset}
        />
      </Card>

      {uploadResults.length > 0 && (
        <UploadResults results={uploadResults} />
      )}
    </>
  );
};

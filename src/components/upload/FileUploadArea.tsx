
import React, { useState } from "react";
import { Check, FileUp, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileUploadAreaProps {
  onFileChange: (files: File[]) => void;
  errors?: string[] | null;
  maxFiles?: number;
}

export const FileUploadArea = ({ onFileChange, errors, maxFiles = 5 }: FileUploadAreaProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      updateFiles(files);
    }
  };

  const updateFiles = (newFiles: File[]) => {
    const totalFiles = selectedFiles.length + newFiles.length;
    
    if (totalFiles > maxFiles) {
      return;
    }

    const updatedFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(updatedFiles);
    onFileChange(updatedFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      updateFiles(files);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFileChange(updatedFiles);
  };

  const removeAllFiles = () => {
    setSelectedFiles([]);
    onFileChange([]);
  };

  const hasErrors = errors && errors.length > 0;

  return (
    <>
      <div 
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-background transition-colors ${isDragging ? 'border-ministry-blue bg-ministry-blue/5' : ''} ${hasErrors ? 'border-red-500' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FileUp className={`h-10 w-10 mb-4 ${hasErrors ? 'text-destructive' : 'text-muted-foreground'}`} />
        <div className="text-center space-y-2">
          <h3 className="font-medium">Glissez-déposez vos fichiers ici</h3>
          <p className="text-sm text-muted-foreground">ou</p>
          <Label
            htmlFor="file-upload"
            className={`${hasErrors ? 'bg-destructive' : 'bg-ministry-blue'} text-white rounded-md py-2 px-4 cursor-pointer hover:opacity-90 transition-colors`}
          >
            Parcourir les fichiers
          </Label>
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png"
            multiple
          />
          <p className="text-xs text-muted-foreground mt-2">
            Maximum {maxFiles} fichiers • PDF, DOCX, XLSX, PPTX, JPG, PNG (Max: 20MB chacun)
          </p>
        </div>
      </div>

      {hasErrors && (
        <div className="mt-2 space-y-2">
          {errors?.map((error, index) => (
            <Alert key={index} variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Fichiers sélectionnés ({selectedFiles.length}/{maxFiles})</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeAllFiles}
              type="button"
            >
              Tout supprimer
            </Button>
          </div>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => {
              const fileError = errors?.[index];
              return (
                <div 
                  key={index}
                  className={`p-3 border rounded-lg flex items-center justify-between ${fileError ? 'bg-destructive/10 border-destructive' : 'bg-green-50 dark:bg-green-900/20'}`}
                >
                  <div className="flex items-center gap-2">
                    {fileError ? (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    ) : (
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                    <div>
                      <span className="text-sm">{file.name}</span>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    type="button"
                  >
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

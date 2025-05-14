
import React, { useState } from "react";
import { Check, FileUp, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileUploadAreaProps {
  onFileChange: (file: File | null) => void;
  error?: string | null;
}

export const FileUploadArea = ({ onFileChange, error }: FileUploadAreaProps) => {
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileSelected(true);
      setFileName(file.name);
      onFileChange(file);
    } else {
      setFileSelected(false);
      setFileName("");
      onFileChange(null);
    }
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setFileSelected(true);
      setFileName(file.name);
      onFileChange(file);
    }
  };

  const handleRemoveFile = () => {
    setFileSelected(false);
    setFileName("");
    onFileChange(null);
  };

  return (
    <>
      <div 
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-background transition-colors ${isDragging ? 'border-ministry-blue bg-ministry-blue/5' : ''} ${error ? 'border-red-500' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FileUp className={`h-10 w-10 mb-4 ${error ? 'text-destructive' : 'text-muted-foreground'}`} />
        <div className="text-center space-y-2">
          <h3 className="font-medium">Glissez-déposez votre fichier ici</h3>
          <p className="text-sm text-muted-foreground">ou</p>
          <Label
            htmlFor="file-upload"
            className={`${error ? 'bg-destructive' : 'bg-ministry-blue'} text-white rounded-md py-2 px-4 cursor-pointer hover:opacity-90 transition-colors`}
          >
            Parcourir les fichiers
          </Label>
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png"
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {fileSelected && (
        <div className={`mt-4 p-3 border rounded-lg flex items-center justify-between ${error ? 'bg-destructive/10' : 'bg-green-50 dark:bg-green-900/20'}`}>
          <div className="flex items-center gap-2">
            {error ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : (
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            )}
            <span className="text-sm">{fileName}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemoveFile}
            type="button"
          >
            <XCircle className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      )}
    </>
  );
};

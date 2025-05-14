
import React, { useState } from "react";
import { Check, FileUp, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FileUploadAreaProps {
  onFileChange: (file: File | null) => void;
}

export const FileUploadArea = ({ onFileChange }: FileUploadAreaProps) => {
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");

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

  const handleRemoveFile = () => {
    setFileSelected(false);
    setFileName("");
    onFileChange(null);
  };

  return (
    <>
      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-background">
        <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
        <div className="text-center space-y-2">
          <h3 className="font-medium">Glissez-déposez votre fichier ici</h3>
          <p className="text-sm text-muted-foreground">ou</p>
          <Label
            htmlFor="file-upload"
            className="bg-ministry-blue text-white rounded-md py-2 px-4 cursor-pointer hover:bg-ministry-darkBlue transition-colors"
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

      {fileSelected && (
        <div className="mt-4 p-3 border rounded-lg flex items-center justify-between bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
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


import React from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isUploading: boolean;
  isFormValid: boolean;
  selectedFilesCount: number;
  onReset: () => void;
}

export const FormActions = ({ 
  isUploading, 
  isFormValid, 
  selectedFilesCount, 
  onReset 
}: FormActionsProps) => {
  return (
    <CardFooter className="flex justify-between">
      <Button
        variant="outline"
        type="button"
        onClick={onReset}
      >
        Annuler
      </Button>
      <Button
        type="submit"
        disabled={isUploading || !isFormValid}
        className="bg-ministry-blue hover:bg-ministry-darkBlue"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Archivage en cours... ({selectedFilesCount} fichier{selectedFilesCount > 1 ? 's' : ''})
          </>
        ) : (
          `Archiver ${selectedFilesCount > 0 ? selectedFilesCount : 'les'} document${selectedFilesCount > 1 ? 's' : ''}`
        )}
      </Button>
    </CardFooter>
  );
};

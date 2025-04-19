
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteDocument } from "@/services/documents/crudService";
import { Loader2 } from "lucide-react";

interface DocumentDeleteConfirmProps {
  documentId: string | null;
  documentTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DocumentDeleteConfirm = ({ documentId, documentTitle, isOpen, onClose, onSuccess }: DocumentDeleteConfirmProps) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!documentId) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteDocument(documentId);
      toast.success("Document supprimé avec succès");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du document");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce document ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le document "{documentTitle}" sera définitivement supprimé
            de la base de données ainsi que des stockages associés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

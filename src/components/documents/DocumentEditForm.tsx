
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Document } from "@/types/document";
import { toast } from "sonner";
import { updateDocument } from "@/services/documents/crudService";
import { Loader2 } from "lucide-react";
import { DocumentFormFields } from "./form/DocumentFormFields";

interface DocumentEditFormProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: { id: string; name: string }[];
}

export const DocumentEditForm = ({ document, isOpen, onClose, onSuccess, categories }: DocumentEditFormProps) => {
  const [formData, setFormData] = useState<Partial<Document>>(document || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (document) {
      setFormData(document);
    }
  }, [document]);

  if (!document) return null;
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.reference_number) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateDocument(document.id, formData);
      toast.success("Document mis à jour avec succès");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour du document");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le document</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations du document {document.reference_number}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <DocumentFormFields 
            formData={formData}
            categories={categories}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
          />

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Mettre à jour"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Document } from "@/types/document";
import { toast } from "sonner";
import { updateDocument } from "@/services/documents/crudService";
import { Loader2 } from "lucide-react";

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

  // Reset form data when document changes
  React.useEffect(() => {
    if (document) {
      setFormData(document);
    }
  }, [document]);

  if (!document) return null;

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du document *</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title || ""} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference_number">Numéro de référence *</Label>
              <Input 
                id="reference_number" 
                name="reference_number" 
                value={formData.reference_number || ""} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document_date">Date du document *</Label>
              <Input 
                id="document_date" 
                name="document_date" 
                type="date" 
                value={formData.document_date ? new Date(formData.document_date).toISOString().split('T')[0] : ""} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document_type">Type de document *</Label>
              <Input 
                id="document_type" 
                name="document_type" 
                value={formData.document_type || ""} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Catégorie *</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => handleSelectChange("category_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuing_department">Service émetteur</Label>
              <Input 
                id="issuing_department" 
                name="issuing_department" 
                value={formData.issuing_department || ""} 
                onChange={handleChange} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget_year">Année budgétaire</Label>
              <Input 
                id="budget_year" 
                name="budget_year" 
                value={formData.budget_year || ""} 
                onChange={handleChange} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget_program">Programme budgétaire</Label>
              <Input 
                id="budget_program" 
                name="budget_program" 
                value={formData.budget_program || ""} 
                onChange={handleChange} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="market_type">Type de marché</Label>
              <Select 
                value={formData.market_type || ""} 
                onValueChange={(value) => handleSelectChange("market_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type de marché" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DC">DC</SelectItem>
                  <SelectItem value="DRPR">DRPR</SelectItem>
                  <SelectItem value="DRPO">DRPO</SelectItem>
                  <SelectItem value="AAO">AAO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description || ""} 
              onChange={handleChange} 
              className="h-20"
            />
          </div>

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

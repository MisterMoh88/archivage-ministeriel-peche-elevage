
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Archive, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ArchiveLocationFormProps {
  documentId: string;
  documentTitle: string;
  issuingDepartment?: string;
  budgetYear?: string;
  existingArchiveCode?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ArchiveLocationForm = ({
  documentId,
  documentTitle,
  issuingDepartment,
  budgetYear,
  existingArchiveCode,
  isOpen,
  onClose,
  onSuccess,
}: ArchiveLocationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    archive_zone: "",
    archive_room: "",
    archive_cabinet: "",
    archive_shelf: "",
    archive_box: "",
    archive_folder: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.archive_zone || !formData.archive_room || !formData.archive_cabinet) {
      toast.error("Veuillez remplir au moins la zone, la salle et l'armoire");
      return;
    }

    try {
      setIsSubmitting(true);

      // Generate archive code via DB function
      const { data: codeData, error: codeError } = await supabase.rpc(
        "generate_archive_code",
        { dept: issuingDepartment || "GENERAL", yr: budgetYear || new Date().getFullYear().toString() }
      );

      if (codeError) throw codeError;

      const archiveCode = existingArchiveCode || codeData;

      const { error } = await supabase
        .from("documents")
        .update({
          archive_zone: formData.archive_zone,
          archive_room: formData.archive_room,
          archive_cabinet: formData.archive_cabinet,
          archive_shelf: formData.archive_shelf,
          archive_box: formData.archive_box,
          archive_folder: formData.archive_folder,
          archive_code: archiveCode,
          status: "archivé" as any,
          last_modified: new Date().toISOString(),
        })
        .eq("id", documentId);

      if (error) throw error;

      toast.success(`Document archivé avec le code : ${archiveCode}`);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erreur lors de l'archivage:", error);
      toast.error(error.message || "Erreur lors de l'archivage du document");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Archiver le document
          </DialogTitle>
          <DialogDescription>
            Localisation physique pour « {documentTitle} »
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="archive_zone">Zone / Site *</Label>
              <Input id="archive_zone" name="archive_zone" value={formData.archive_zone} onChange={handleChange} placeholder="Ex: Zone A" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="archive_room">Salle d'archives *</Label>
              <Input id="archive_room" name="archive_room" value={formData.archive_room} onChange={handleChange} placeholder="Ex: Salle 01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="archive_cabinet">Armoire *</Label>
              <Input id="archive_cabinet" name="archive_cabinet" value={formData.archive_cabinet} onChange={handleChange} placeholder="Ex: ARM-03" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="archive_shelf">Rayon / Étagère</Label>
              <Input id="archive_shelf" name="archive_shelf" value={formData.archive_shelf} onChange={handleChange} placeholder="Ex: Rayon 2" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="archive_box">Boîte</Label>
              <Input id="archive_box" name="archive_box" value={formData.archive_box} onChange={handleChange} placeholder="Ex: BT-015" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="archive_folder">Dossier</Label>
              <Input id="archive_folder" name="archive_folder" value={formData.archive_folder} onChange={handleChange} placeholder="Ex: DOS-007" />
            </div>
          </div>

          {existingArchiveCode && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-muted text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Code existant :</span> {existingArchiveCode}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Archivage...</>
              ) : (
                <><Archive className="mr-2 h-4 w-4" />Archiver</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoFieldsProps {
  errors: Record<string, any>;
}

export const BasicInfoFields = ({ errors }: BasicInfoFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Intitulé du dossier</Label>
          <Input 
            id="title" 
            name="title"
            placeholder="Ex: Arrêté N°2023-1567" 
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && (
            <p className="text-sm text-destructive">Ce champ est requis</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="referenceNumber">Numéro de référence</Label>
          <Input 
            id="referenceNumber" 
            name="referenceNumber"
            placeholder="Ex: REF-2023-0456" 
            className={errors.referenceNumber ? "border-destructive" : ""}
          />
          {errors.referenceNumber && (
            <p className="text-sm text-destructive">Ce champ est requis</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="documentDate">Date du document</Label>
          <Input 
            id="documentDate" 
            name="documentDate"
            type="date" 
            className={errors.documentDate ? "border-destructive" : ""}
          />
          {errors.documentDate && (
            <p className="text-sm text-destructive">Ce champ est requis</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="issuingDepartment">Service émetteur</Label>
          <Input 
            id="issuingDepartment" 
            name="issuingDepartment"
            placeholder="Ex: Direction des Ressources Animales" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Brève description du contenu du document"
          rows={3}
        />
      </div>
    </>
  );
};

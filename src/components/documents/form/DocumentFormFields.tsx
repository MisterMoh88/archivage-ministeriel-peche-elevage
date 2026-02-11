
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Document } from "@/types/document";

interface DocumentFormFieldsProps {
  formData: Partial<Document>;
  categories: { id: string; name: string }[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const DocumentFormFields = ({ formData, categories, handleChange, handleSelectChange }: DocumentFormFieldsProps) => {
  return (
    <div className="space-y-4">
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
          <Label htmlFor="confidentiality_level">Niveau de confidentialité *</Label>
          <Select 
            value={formData.confidentiality_level || "C1"} 
            onValueChange={(value) => handleSelectChange("confidentiality_level", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="C0">C0 – Public</SelectItem>
              <SelectItem value="C1">C1 – Interne</SelectItem>
              <SelectItem value="C2">C2 – Confidentiel</SelectItem>
              <SelectItem value="C3">C3 – Très Confidentiel</SelectItem>
            </SelectContent>
          </Select>
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
    </div>
  );
};

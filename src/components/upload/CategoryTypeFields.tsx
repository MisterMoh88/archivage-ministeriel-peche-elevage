
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategoryTypeFieldsProps {
  categories: Category[];
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  documentTypes: Record<string, string[]>;
  errors: Record<string, any>;
}

export const CategoryTypeFields = ({ categories, setValue, watch, documentTypes, errors }: CategoryTypeFieldsProps) => {
  const selectedCategory = watch("categoryId");
  const selectedType = watch("documentType");

  const handleCategoryChange = (value: string) => {
    setValue("categoryId", value);
    setValue("documentType", "");
  };

  const getDocumentTypeOptions = () => {
    const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);
    if (!selectedCategoryObj) return [];
    
    return documentTypes[selectedCategoryObj.name as keyof typeof documentTypes] || [];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="categoryId">Catégorie de document</Label>
        <Select onValueChange={handleCategoryChange} value={selectedCategory}>
          <SelectTrigger id="categoryId" className={errors.categoryId ? "border-destructive" : ""}>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-sm text-destructive">Ce champ est requis</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="documentType">Type de document</Label>
        <Select 
          onValueChange={(value) => setValue("documentType", value)} 
          value={selectedType}
          disabled={!selectedCategory}
        >
          <SelectTrigger id="documentType" className={errors.documentType ? "border-destructive" : ""}>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            {getDocumentTypeOptions().map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.documentType && (
          <p className="text-sm text-destructive">Ce champ est requis</p>
        )}
      </div>
    </div>
  );
};


import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BasicInfoFields } from "@/components/upload/BasicInfoFields";
import { CategoryTypeFields } from "@/components/upload/CategoryTypeFields";
import { MarketFields } from "@/components/upload/MarketFields";
import { documentTypes } from "@/services/documents/documentTypesService";

interface CategoryType {
  id: string;
  name: string;
  description: string;
}

interface DocumentInfoCardProps {
  categories: CategoryType[];
  control: any;
  errors: any;
  setValue: any;
  watch: any;
  isPublicMarket: boolean;
}

export const DocumentInfoCard = ({
  categories,
  control,
  errors,
  setValue,
  watch,
  isPublicMarket
}: DocumentInfoCardProps) => {
  return (
    <Card className="mb-6 border-ministry-blue/20">
      <CardHeader>
        <CardTitle>Informations des documents</CardTitle>
        <CardDescription>
          Renseignez les informations nécessaires à l'archivage. 
          Pour plusieurs fichiers, des suffixes seront ajoutés automatiquement.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <BasicInfoFields control={control} errors={errors} />
        <CategoryTypeFields
          categories={categories}
          setValue={setValue}
          watch={watch}
          documentTypes={documentTypes}
          errors={errors}
        />
        {isPublicMarket && <MarketFields setValue={setValue} />}
      </CardContent>
    </Card>
  );
};

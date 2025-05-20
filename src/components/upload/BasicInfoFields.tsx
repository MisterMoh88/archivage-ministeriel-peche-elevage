
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  control: any;
  errors: any;
}

export const BasicInfoFields = ({ control, errors }: Props) => {
  return (
    <div className="space-y-4">
      {/* Intitulé du dossier */}
      <div>
        <Label htmlFor="title">Intitulé du dossier *</Label>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Ce champ est requis" }}
          render={({ field }) => (
            <Input id="title" placeholder="Ex : Marché de construction..." {...field} />
          )}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Numéro de référence */}
      <div>
        <Label htmlFor="referenceNumber">Numéro de référence *</Label>
        <Controller
          name="referenceNumber"
          control={control}
          rules={{ required: "Ce champ est requis" }}
          render={({ field }) => (
            <Input id="referenceNumber" placeholder="Ex : REF-2024/001" {...field} />
          )}
        />
        {errors.referenceNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.referenceNumber.message}</p>
        )}
      </div>

      {/* Date du document */}
      <div>
        <Label htmlFor="documentDate">Date du document *</Label>
        <Controller
          name="documentDate"
          control={control}
          rules={{ required: "Ce champ est requis" }}
          render={({ field }) => (
            <Input id="documentDate" type="date" {...field} />
          )}
        />
        {errors.documentDate && (
          <p className="text-red-500 text-sm mt-1">{errors.documentDate.message}</p>
        )}
      </div>
    </div>
  );
};

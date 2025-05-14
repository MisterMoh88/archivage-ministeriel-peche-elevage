
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormSetValue } from "react-hook-form";
import { Separator } from "@/components/ui/separator";

interface MarketFieldsProps {
  setValue: UseFormSetValue<any>;
}

export const MarketFields = ({ setValue }: MarketFieldsProps) => {
  // Types de marchés publics
  const publicMarketTypes = ["DC", "DRPR", "DRPO", "AAO"];

  return (
    <div className="p-4 border rounded-lg bg-ministry-blue/5 mt-4">
      <h3 className="text-sm font-semibold mb-3">
        Informations supplémentaires pour les marchés publics et contrats
      </h3>
      <Separator className="my-3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budgetYear">Exercice Budgétaire</Label>
          <Input id="budgetYear" placeholder="Ex: 2023" name="budgetYear" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budgetProgram">Programme budgétaire</Label>
          <Input id="budgetProgram" placeholder="Ex: 822/1.037" name="budgetProgram" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="marketType">Type de marché</Label>
          <Select onValueChange={(value) => setValue("marketType", value)}>
            <SelectTrigger id="marketType">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {publicMarketTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

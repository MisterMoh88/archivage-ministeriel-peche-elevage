
import React from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface Props {
  control: any;
}

export const ArchiveLocationFields = ({ control }: Props) => {
  return (
    <Card className="mb-6 border-dashed border-muted-foreground/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-4 w-4" />
          Localisation physique
        </CardTitle>
        <CardDescription>
          Optionnel — Renseignez ces champs pour archiver définitivement le document avec sa localisation physique.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="archiveZone">Zone / Site</Label>
            <Controller
              name="archiveZone"
              control={control}
              render={({ field }) => (
                <Input id="archiveZone" placeholder="Ex : Zone A" {...field} />
              )}
            />
          </div>
          <div>
            <Label htmlFor="archiveRoom">Salle d'archives</Label>
            <Controller
              name="archiveRoom"
              control={control}
              render={({ field }) => (
                <Input id="archiveRoom" placeholder="Ex : Salle 01" {...field} />
              )}
            />
          </div>
          <div>
            <Label htmlFor="archiveCabinet">Armoire</Label>
            <Controller
              name="archiveCabinet"
              control={control}
              render={({ field }) => (
                <Input id="archiveCabinet" placeholder="Ex : ARM-03" {...field} />
              )}
            />
          </div>
          <div>
            <Label htmlFor="archiveShelf">Rayon / Étagère</Label>
            <Controller
              name="archiveShelf"
              control={control}
              render={({ field }) => (
                <Input id="archiveShelf" placeholder="Ex : Rayon 2" {...field} />
              )}
            />
          </div>
          <div>
            <Label htmlFor="archiveBox">Boîte</Label>
            <Controller
              name="archiveBox"
              control={control}
              render={({ field }) => (
                <Input id="archiveBox" placeholder="Ex : BT-015" {...field} />
              )}
            />
          </div>
          <div>
            <Label htmlFor="archiveFolder">Dossier</Label>
            <Controller
              name="archiveFolder"
              control={control}
              render={({ field }) => (
                <Input id="archiveFolder" placeholder="Ex : DOS-007" {...field} />
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

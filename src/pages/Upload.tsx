
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Check, FileUp, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Upload() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isPublicMarket, setIsPublicMarket] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");

  // Options de catégories
  const categories = [
    {
      value: "administrative",
      label: "Documents administratifs et réglementaires",
    },
    {
      value: "technical",
      label: "Documents techniques et spécialisés",
    },
    {
      value: "financial",
      label: "Documents financiers et comptables",
    },
    {
      value: "communication",
      label: "Documents de communication et de sensibilisation",
    },
    {
      value: "historical",
      label: "Archives et documentation historique",
    },
  ];

  // Types de documents par catégorie
  const documentTypes = {
    administrative: [
      "Loi",
      "Décret",
      "Arrêté",
      "Décision",
      "Note de service",
      "Circulaire",
      "Procédure",
      "Manuel",
      "Rapport d'activité",
      "Compte rendu",
    ],
    technical: [
      "Étude",
      "Recherche",
      "Guide méthodologique",
      "Données statistiques",
      "Rapport d'enquête",
    ],
    financial: [
      "Budget",
      "État financier",
      "Rapport d'audit",
      "Marché public",
      "Contrat",
    ],
    communication: [
      "Bulletin",
      "Revue spécialisée",
      "Plaquette",
      "Brochure",
      "Acte de conférence",
      "Acte de séminaire",
    ],
    historical: [
      "Document ancien",
      "Correspondance",
      "Dossier administratif ancien",
      "Photographie",
      "Vidéo",
      "Enregistrement audio",
    ],
  };

  // Types de marchés publics
  const publicMarketTypes = ["DC", "DRPR", "DRPO", "AAO"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileSelected(true);
      setFileName(e.target.files[0].name);
    } else {
      setFileSelected(false);
      setFileName("");
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedType("");
    setIsPublicMarket(
      value === "financial" && documentTypes.financial.includes("Marché public")
    );
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setIsPublicMarket(value === "Marché public" || value === "Contrat");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de soumission du formulaire (à implémenter avec backend)
    alert("Document envoyé avec succès!");
  };

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-title">Ajouter un document</h1>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6 border-ministry-blue/20">
            <CardHeader>
              <CardTitle>Informations du document</CardTitle>
              <CardDescription>
                Renseignez les informations nécessaires à l'archivage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Intitulé du dossier</Label>
                  <Input id="title" placeholder="Ex: Arrêté N°2023-1567" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Numéro de référence</Label>
                  <Input id="reference" placeholder="Ex: REF-2023-0456" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="document-date">Date du document</Label>
                  <Input id="document-date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Service émetteur</Label>
                  <Input id="source" placeholder="Ex: Direction des Ressources Animales" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie de document</Label>
                  <Select
                    onValueChange={handleCategoryChange}
                    value={selectedCategory}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document-type">Type de document</Label>
                  <Select
                    onValueChange={handleTypeChange}
                    value={selectedType}
                    disabled={!selectedCategory}
                    required
                  >
                    <SelectTrigger id="document-type">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory &&
                        documentTypes[
                          selectedCategory as keyof typeof documentTypes
                        ].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brève description du contenu du document"
                  rows={3}
                />
              </div>

              {isPublicMarket && (
                <div className="p-4 border rounded-lg bg-ministry-blue/5 mt-4">
                  <h3 className="text-sm font-semibold mb-3">
                    Informations supplémentaires pour les marchés publics et contrats
                  </h3>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fiscal-year">Exercice Budgétaire</Label>
                      <Input id="fiscal-year" placeholder="Ex: 2023" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget-program">Programme budgétaire</Label>
                      <Input id="budget-program" placeholder="Ex: 822/1.037" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="market-type">Type de marché</Label>
                      <Select required>
                        <SelectTrigger id="market-type">
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
              )}
            </CardContent>
          </Card>

          <Card className="mb-6 border-ministry-blue/20">
            <CardHeader>
              <CardTitle>Téléversement du fichier</CardTitle>
              <CardDescription>
                Formats acceptés: PDF, DOCX, XLSX, PPTX, JPG, PNG (Max: 20MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-background">
                <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Glissez-déposez votre fichier ici</h3>
                  <p className="text-sm text-muted-foreground">ou</p>
                  <Label
                    htmlFor="file-upload"
                    className="bg-ministry-blue text-white rounded-md py-2 px-4 cursor-pointer hover:bg-ministry-darkBlue transition-colors"
                  >
                    Parcourir les fichiers
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png"
                    required
                  />
                </div>
              </div>

              {fileSelected && (
                <div className="mt-4 p-3 border rounded-lg flex items-center justify-between bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm">{fileName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFileSelected(false)}
                  >
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Annuler</Button>
              <Button type="submit">Archiver le document</Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}

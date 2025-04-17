
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { Check, FileUp, XCircle, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { uploadDocument, getDocumentCategories } from "@/services/documentService";
import { toast } from "sonner";

interface CategoryType {
  id: string;
  name: string;
  description: string;
}

export default function Upload() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isPublicMarket, setIsPublicMarket] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();

  const selectedCategory = watch("categoryId");
  const selectedType = watch("documentType");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getDocumentCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setIsPublicMarket(selectedType === "Marché public" || selectedType === "Contrat");
  }, [selectedType]);

  // Types de documents par catégorie
  const documentTypes = {
    "Documents administratifs et réglementaires": [
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
    "Documents techniques et spécialisés": [
      "Étude",
      "Recherche",
      "Guide méthodologique",
      "Données statistiques",
      "Rapport d'enquête",
    ],
    "Documents financiers et comptables": [
      "Budget",
      "État financier",
      "Rapport d'audit",
      "Marché public",
      "Contrat",
    ],
    "Documents de communication et de sensibilisation": [
      "Bulletin",
      "Revue spécialisée",
      "Plaquette",
      "Brochure",
      "Acte de conférence",
      "Acte de séminaire",
    ],
    "Archives et documentation historique": [
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
      const file = e.target.files[0];
      setFileSelected(true);
      setFileName(file.name);
      setSelectedFile(file);
    } else {
      setFileSelected(false);
      setFileName("");
      setSelectedFile(null);
    }
  };

  const onSubmit = async (data: any) => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    try {
      setIsUploading(true);
      await uploadDocument({
        ...data,
        file: selectedFile,
      });
      
      toast.success("Document archivé avec succès");
      reset();
      setFileSelected(false);
      setFileName("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
    } finally {
      setIsUploading(false);
    }
  };

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
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-title">Ajouter un document</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
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
                  <Input 
                    id="title" 
                    placeholder="Ex: Arrêté N°2023-1567" 
                    {...register("title", { required: true })}
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
                    placeholder="Ex: REF-2023-0456" 
                    {...register("referenceNumber", { required: true })}
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
                    type="date" 
                    {...register("documentDate", { required: true })}
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
                    placeholder="Ex: Direction des Ressources Animales" 
                    {...register("issuingDepartment")}
                  />
                </div>
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brève description du contenu du document"
                  rows={3}
                  {...register("description")}
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
                      <Label htmlFor="budgetYear">Exercice Budgétaire</Label>
                      <Input id="budgetYear" placeholder="Ex: 2023" {...register("budgetYear")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budgetProgram">Programme budgétaire</Label>
                      <Input id="budgetProgram" placeholder="Ex: 822/1.037" {...register("budgetProgram")} />
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
                    onClick={() => {
                      setFileSelected(false);
                      setFileName("");
                      setSelectedFile(null);
                    }}
                    type="button"
                  >
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => reset()}>Annuler</Button>
              <Button 
                type="submit" 
                disabled={isUploading || !fileSelected}
                className="bg-ministry-blue hover:bg-ministry-darkBlue"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Archivage en cours...
                  </>
                ) : (
                  "Archiver le document"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}

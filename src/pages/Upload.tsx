
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
import { Loader2 } from "lucide-react";
import { uploadDocument } from "@/services/documents/uploadService";
import { getDocumentCategories } from "@/services/documents/categoryService";
import { toast } from "sonner";
import { BasicInfoFields } from "@/components/upload/BasicInfoFields";
import { CategoryTypeFields } from "@/components/upload/CategoryTypeFields";
import { MarketFields } from "@/components/upload/MarketFields";
import { FileUploadArea } from "@/components/upload/FileUploadArea";
import { documentTypes } from "@/services/documents/documentTypesService";

interface CategoryType {
  id: string;
  name: string;
  description: string;
}

export default function Upload() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isPublicMarket, setIsPublicMarket] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();

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
      setSelectedFile(null);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  // Register form fields for react-hook-form
  useEffect(() => {
    register("title", { required: true });
    register("referenceNumber", { required: true });
    register("documentDate", { required: true });
    register("issuingDepartment");
    register("description");
    register("categoryId", { required: true });
    register("documentType", { required: true });
    register("budgetYear");
    register("budgetProgram");
    register("marketType");
  }, [register]);

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
              <BasicInfoFields errors={errors} />
              
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

          <Card className="mb-6 border-ministry-blue/20">
            <CardHeader>
              <CardTitle>Téléversement du fichier</CardTitle>
              <CardDescription>
                Formats acceptés: PDF, DOCX, XLSX, PPTX, JPG, PNG (Max: 20MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadArea onFileChange={handleFileChange} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => reset()}>Annuler</Button>
              <Button 
                type="submit" 
                disabled={isUploading || !selectedFile}
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

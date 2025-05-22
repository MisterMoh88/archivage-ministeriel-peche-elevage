
import { useState, useEffect, useMemo } from "react";
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
import { validateDocumentFile } from "@/services/uploadService"; // 👈 import direct

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
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    mode: "onChange"
  });

  const selectedType = watch("documentType");
  const formValues = watch();

  // Champs requis
  useEffect(() => {
    register("title", { required: "Le titre est requis" });
    register("referenceNumber", { required: "La référence est requise" });
    register("documentDate", { required: "La date du document est requise" });
    register("issuingDepartment");
    register("description");
    register("categoryId", { required: "La catégorie est requise" });
    register("documentType", { required: "Le type de document est requis" });
    register("budgetYear");
    register("budgetProgram");
    register("marketType");
  }, [register]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getDocumentCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
        toast.error("Impossible de charger les catégories de documents");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setIsPublicMarket(selectedType === "Marché public" || selectedType === "Contrat");
  }, [selectedType]);

  const isFormValid = useMemo(() => {
    const requiredFields = {
      title: formValues.title,
      referenceNumber: formValues.referenceNumber,
      documentDate: formValues.documentDate,
      categoryId: formValues.categoryId,
      documentType: formValues.documentType,
    };

    const allFilled = Object.values(requiredFields).every(val => val?.trim() !== "");
    const fileValid = selectedFile && !fileError;

    return allFilled && fileValid;
  }, [formValues, selectedFile, fileError]);

  const onSubmit = async (data: any) => {
    if (!selectedFile) {
      setFileError("Veuillez sélectionner un fichier");
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    const validation = validateDocumentFile(selectedFile);
    if (!validation.valid) {
      setFileError(validation.message);
      toast.error(validation.message);
      return;
    }

    try {
      setIsUploading(true);
      await uploadDocument({ ...data, file: selectedFile });

      toast.success("Document archivé avec succès", {
        description: `Le document "${data.title}" a été ajouté à la catégorie sélectionnée.`,
      });

      reset({
  title: "",
  referenceNumber: "",
  documentDate: "",
  issuingDepartment: "",
  description: "",
  categoryId: "",
  documentType: "",
  budgetYear: "",
  budgetProgram: "",
  marketType: "",
});
      setSelectedFile(null);
      setFileError(null);
      setIsPublicMarket(false);
    } catch (error: any) {
      console.error("Erreur lors de l'upload:", error);
      toast.error(error.message || "Erreur lors de l'archivage du document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (!file) {
      setFileError("Aucun fichier sélectionné");
      return;
    }

    const validation = validateDocumentFile(file);
    if (!validation.valid) {
      setFileError(validation.message);
    } else {
      setFileError(null);
    }
  };

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-title">Ajouter un document</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="mb-6 border-ministry-blue/20">
            <CardHeader>
              <CardTitle>Informations du document</CardTitle>
              <CardDescription>Renseignez les informations nécessaires à l'archivage</CardDescription>
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

          <Card className="mb-6 border-ministry-blue/20">
            <CardHeader>
              <CardTitle>Téléversement du fichier</CardTitle>
              <CardDescription>
                Formats acceptés: PDF, DOCX, XLSX, PPTX, JPG, PNG (Max: 20MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadArea
                onFileChange={handleFileChange}
                error={fileError}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  reset();
                  setSelectedFile(null);
                  setFileError(null);
                }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isUploading || !isFormValid}
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

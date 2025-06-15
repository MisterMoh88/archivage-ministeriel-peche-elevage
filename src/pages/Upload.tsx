
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
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { getDocumentCategories } from "@/services/documents/categoryService";
import { toast } from "sonner";
import { BasicInfoFields } from "@/components/upload/BasicInfoFields";
import { CategoryTypeFields } from "@/components/upload/CategoryTypeFields";
import { MarketFields } from "@/components/upload/MarketFields";
import { FileUploadArea } from "@/components/upload/FileUploadArea";
import { documentTypes } from "@/services/documents/documentTypesService";
import { uploadMultipleDocuments, validateMultipleFiles } from "@/services/documents/multiUploadService";

interface CategoryType {
  id: string;
  name: string;
  description: string;
}

export default function Upload() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isPublicMarket, setIsPublicMarket] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [uploadResults, setUploadResults] = useState<Array<{success: boolean, fileName: string, error?: string}>>([]);

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
    const filesValid = selectedFiles.length > 0 && fileErrors.every(error => !error);

    return allFilled && filesValid;
  }, [formValues, selectedFiles, fileErrors]);

  const onSubmit = async (data: any) => {
    if (selectedFiles.length === 0) {
      toast.error("Veuillez sélectionner au moins un fichier");
      return;
    }

    if (fileErrors.some(error => error)) {
      toast.error("Corrigez les erreurs de fichiers avant de continuer");
      return;
    }

    try {
      setIsUploading(true);
      setUploadResults([]);

      const results = await uploadMultipleDocuments({ 
        ...data, 
        files: selectedFiles 
      });

      setUploadResults(results);

      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;

      if (successCount > 0 && errorCount === 0) {
        toast.success(`${successCount} document${successCount > 1 ? 's' : ''} archivé${successCount > 1 ? 's' : ''} avec succès`);
        
        // Reset form
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
        setSelectedFiles([]);
        setFileErrors([]);
        setIsPublicMarket(false);
        setUploadResults([]);
      } else if (successCount > 0 && errorCount > 0) {
        toast.warning(`${successCount} document${successCount > 1 ? 's' : ''} archivé${successCount > 1 ? 's' : ''}, ${errorCount} erreur${errorCount > 1 ? 's' : ''}`);
      } else {
        toast.error("Aucun document n'a pu être archivé");
      }

    } catch (error: any) {
      console.error("Erreur lors de l'upload:", error);
      toast.error(error.message || "Erreur lors de l'archivage des documents");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (files: File[]) => {
    setSelectedFiles(files);
    const errors = validateMultipleFiles(files);
    setFileErrors(errors);
    setUploadResults([]);
  };

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-title">Ajouter des documents</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
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

          <Card className="mb-6 border-ministry-blue/20">
            <CardHeader>
              <CardTitle>Téléversement des fichiers</CardTitle>
              <CardDescription>
                Formats acceptés: PDF, DOCX, XLSX, PPTX, JPG, PNG (Max: 20MB chacun, 5 fichiers maximum)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadArea
                onFileChange={handleFileChange}
                errors={fileErrors}
                maxFiles={5}
              />
            </CardContent>
            
            {uploadResults.length > 0 && (
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium">Résultats de l'upload:</h4>
                  {uploadResults.map((result, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 p-2 rounded ${
                        result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {result.success ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      <span className="text-sm">
                        <strong>{result.fileName}</strong>: {result.success ? 'Succès' : result.error}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}

            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  reset();
                  setSelectedFiles([]);
                  setFileErrors([]);
                  setUploadResults([]);
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
                    Archivage en cours... ({selectedFiles.length} fichier{selectedFiles.length > 1 ? 's' : ''})
                  </>
                ) : (
                  `Archiver ${selectedFiles.length > 0 ? selectedFiles.length : 'les'} document${selectedFiles.length > 1 ? 's' : ''}`
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}

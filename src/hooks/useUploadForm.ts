
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { getDocumentCategories } from "@/services/documents/categoryService";
import { toast } from "sonner";
import { uploadMultipleDocuments, validateMultipleFiles } from "@/services/documents/multiUploadService";

interface CategoryType {
  id: string;
  name: string;
  description: string;
}

interface UploadResult {
  success: boolean;
  fileName: string;
  error?: string;
}

export const useUploadForm = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isPublicMarket, setIsPublicMarket] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);

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
    register("confidentialityLevel", { required: "Le niveau de confidentialité est requis" });
    register("archiveZone");
    register("archiveRoom");
    register("archiveCabinet");
    register("archiveShelf");
    register("archiveBox");
    register("archiveFolder");
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
      confidentialityLevel: formValues.confidentialityLevel,
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
          confidentialityLevel: "",
          archiveZone: "",
          archiveRoom: "",
          archiveCabinet: "",
          archiveShelf: "",
          archiveBox: "",
          archiveFolder: "",
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

  const resetForm = () => {
    reset();
    setSelectedFiles([]);
    setFileErrors([]);
    setUploadResults([]);
  };

  return {
    categories,
    isPublicMarket,
    isUploading,
    selectedFiles,
    fileErrors,
    uploadResults,
    control,
    errors,
    watch,
    setValue,
    handleSubmit,
    onSubmit,
    handleFileChange,
    resetForm,
    isFormValid
  };
};

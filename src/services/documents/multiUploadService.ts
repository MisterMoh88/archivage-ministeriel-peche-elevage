
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateDocumentFile } from "@/services/uploadService";

interface MultiUploadDocumentProps {
  title: string;
  referenceNumber: string;
  documentDate: string;
  description?: string;
  issuingDepartment?: string;
  categoryId: string;
  documentType: string;
  files: File[];
  budgetYear?: string;
  budgetProgram?: string;
  marketType?: "DC" | "DRPR" | "DRPO" | "AAO";
}

interface UploadResult {
  success: boolean;
  fileName: string;
  error?: string;
  documentId?: string;
}

// Fonction pour assainir le nom du fichier
const sanitizeFileName = (fileName: string): string => {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_.-]/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/[éèêë]/g, "e")
    .replace(/[àâä]/g, "a")
    .replace(/[ùûü]/g, "u")
    .replace(/[îï]/g, "i")
    .replace(/[ôö]/g, "o")
    .replace(/[ç]/g, "c")
    .replace(/[\s°]/g, "_");
};

export const uploadMultipleDocuments = async (
  documentData: MultiUploadDocumentProps
): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Utilisateur non authentifié");
    }

    // Traiter chaque fichier
    for (let i = 0; i < documentData.files.length; i++) {
      const file = documentData.files[i];
      const result: UploadResult = {
        success: false,
        fileName: file.name
      };

      try {
        // Valider le fichier
        const fileValidation = validateDocumentFile(file);
        if (!fileValidation.valid) {
          result.error = fileValidation.message;
          results.push(result);
          continue;
        }

        // Préparer le nom de fichier
        const fileExt = file.name.split('.').pop();
        const originalName = file.name.split('.').slice(0, -1).join('.');
        const sanitizedName = sanitizeFileName(originalName);
        const uniquePrefix = Date.now() + i; // Ajouter l'index pour éviter les doublons
        const fileName = `${uniquePrefix}_${sanitizedName}.${fileExt}`;
        const filePath = `${documentData.categoryId}/${fileName}`;

        console.log(`Upload du fichier ${i + 1}/${documentData.files.length}:`, {
          originalName: file.name,
          sanitizedName: fileName,
          size: file.size
        });

        // Upload du fichier
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Erreur d'upload:", uploadError);
          result.error = `Erreur lors de l'upload: ${uploadError.message}`;
          results.push(result);
          continue;
        }

        // Enregistrer les métadonnées
        const documentTitle = documentData.files.length > 1 
          ? `${documentData.title} - ${i + 1}`
          : documentData.title;

        const { data: docData, error: insertError } = await supabase
          .from('documents')
          .insert({
            title: documentTitle,
            reference_number: `${documentData.referenceNumber}${documentData.files.length > 1 ? `-${i + 1}` : ''}`,
            document_date: documentData.documentDate,
            description: documentData.description,
            issuing_department: documentData.issuingDepartment,
            category_id: documentData.categoryId,
            document_type: documentData.documentType,
            file_path: filePath,
            file_size: file.size,
            file_type: file.type,
            original_filename: file.name,
            budget_year: documentData.budgetYear,
            budget_program: documentData.budgetProgram,
            market_type: documentData.marketType,
            uploaded_by: user.id
          })
          .select()
          .single();

        if (insertError) {
          console.error("Erreur d'insertion:", insertError);
          // Supprimer le fichier uploadé en cas d'erreur
          await supabase.storage.from('documents').remove([filePath]);
          result.error = `Erreur lors de l'enregistrement: ${insertError.message}`;
          results.push(result);
          continue;
        }

        result.success = true;
        result.documentId = docData.id;
        results.push(result);

      } catch (error: any) {
        console.error(`Erreur pour le fichier ${file.name}:`, error);
        result.error = error.message || "Erreur inconnue";
        results.push(result);
      }
    }

    return results;
  } catch (error: any) {
    console.error("Erreur générale lors de l'upload multiple:", error);
    throw error;
  }
};

export const validateMultipleFiles = (files: File[]): string[] => {
  const errors: string[] = [];
  
  files.forEach((file, index) => {
    const validation = validateDocumentFile(file);
    if (!validation.valid) {
      errors[index] = `${file.name}: ${validation.message}`;
    }
  });

  return errors;
};

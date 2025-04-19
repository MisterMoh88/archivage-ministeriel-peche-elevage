
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Document } from "@/types/document";

interface UploadDocumentProps {
  title: string;
  referenceNumber: string;
  documentDate: string;
  description?: string;
  issuingDepartment?: string;
  categoryId: string;
  documentType: string;
  file: File;
  budgetYear?: string;
  budgetProgram?: string;
  marketType?: "DC" | "DRPR" | "DRPO" | "AAO";
}

export const uploadDocument = async (documentData: UploadDocumentProps) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Utilisateur non authentifié");
    }

    // 1. Upload du fichier
    const fileExt = documentData.file.name.split('.').pop();
    const fileName = `${Date.now()}_${documentData.referenceNumber}.${fileExt}`;
    const filePath = `${documentData.categoryId}/${fileName}`;
    
    console.log("Début de l'upload du fichier", {
      bucket: 'documents',
      path: filePath,
      fileSize: documentData.file.size,
      fileType: documentData.file.type
    });
    
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('documents')
      .upload(filePath, documentData.file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Erreur d'upload:", uploadError);
      throw new Error(`Erreur lors de l'upload du fichier: ${uploadError.message}`);
    }

    console.log("Fichier uploadé avec succès:", uploadData);

    // 2. Enregistrer les métadonnées du document
    const { data, error } = await supabase.from('documents').insert({
      title: documentData.title,
      reference_number: documentData.referenceNumber,
      document_date: documentData.documentDate,
      description: documentData.description,
      issuing_department: documentData.issuingDepartment,
      category_id: documentData.categoryId,
      document_type: documentData.documentType,
      file_path: filePath,
      file_size: documentData.file.size,
      file_type: documentData.file.type,
      budget_year: documentData.budgetYear,
      budget_program: documentData.budgetProgram,
      market_type: documentData.marketType,
      uploaded_by: user.id
    }).select().single();

    if (error) {
      console.error("Erreur d'insertion:", error);
      await supabase.storage.from('documents').remove([filePath]);
      throw new Error(`Erreur lors de l'enregistrement du document: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    toast.error(error.message || "Une erreur est survenue lors de l'upload du document");
    throw error;
  }
};

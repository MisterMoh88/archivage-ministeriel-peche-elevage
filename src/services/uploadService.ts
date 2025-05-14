
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

// Fonction pour assainir le nom du fichier en remplaçant les caractères spéciaux
const sanitizeFileName = (fileName: string): string => {
  // Remplacer les espaces et les caractères spéciaux par des underscores
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
    .replace(/[^a-zA-Z0-9_.-]/g, "_") // Remplacer les caractères spéciaux par des underscores
    .replace(/_{2,}/g, "_") // Éviter les underscores multiples
    .replace(/[éèêë]/g, "e") // Remplacer les caractères accentués spécifiques
    .replace(/[àâä]/g, "a")
    .replace(/[ùûü]/g, "u")
    .replace(/[îï]/g, "i")
    .replace(/[ôö]/g, "o")
    .replace(/[ç]/g, "c")
    .replace(/[\s°]/g, "_"); // Remplacer les espaces et le symbole degré
};

// Fonction pour vérifier la taille et le type de fichier
const validateFile = (file: File): { valid: boolean; message?: string } => {
  // Vérifier la taille du fichier (max 20MB)
  const maxSize = 20 * 1024 * 1024; // 20MB en octets
  if (file.size > maxSize) {
    return { 
      valid: false, 
      message: `Le fichier est trop volumineux (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum autorisé: 20MB.` 
    };
  }
  
  // Vérifier le type de fichier
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
  
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'docx', 'xlsx', 'pptx'];
  
  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
    return { 
      valid: false, 
      message: `Type de fichier non autorisé. Types acceptés: PDF, DOCX, XLSX, PPTX, JPG, PNG.` 
    };
  }
  
  return { valid: true };
};

export const uploadDocument = async (documentData: UploadDocumentProps) => {
  try {
    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Utilisateur non authentifié");
    }
    
    // Valider le fichier
    const fileValidation = validateFile(documentData.file);
    if (!fileValidation.valid) {
      throw new Error(fileValidation.message);
    }

    // 1. Upload du fichier
    const fileExt = documentData.file.name.split('.').pop();
    const originalName = documentData.file.name.split('.').slice(0, -1).join('.');
    
    // Utiliser le nom sanitisé pour le fichier
    const sanitizedName = sanitizeFileName(originalName);
    const uniquePrefix = Date.now();
    const fileName = `${uniquePrefix}_${sanitizedName}.${fileExt}`;
    
    // Créer un chemin de fichier sécurisé
    const filePath = `${documentData.categoryId}/${fileName}`;
    
    console.log("Début de l'upload du fichier", {
      bucket: 'documents',
      path: filePath,
      fileSize: documentData.file.size,
      fileType: documentData.file.type,
      originalName: documentData.file.name,
      sanitizedName: fileName
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
      original_filename: documentData.file.name, // Garder le nom original pour référence
      budget_year: documentData.budgetYear,
      budget_program: documentData.budgetProgram,
      market_type: documentData.marketType,
      uploaded_by: user.id
    }).select().single();

    if (error) {
      console.error("Erreur d'insertion:", error);
      // Si l'insertion échoue, supprimer le fichier uploadé
      await supabase.storage.from('documents').remove([filePath]);
      throw new Error(`Erreur lors de l'enregistrement du document: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    console.error("Erreur complète:", error);
    toast.error(error.message || "Une erreur est survenue lors de l'upload du document");
    throw error;
  }
};

// Exposer la fonction de validation pour usage externe (dans les formulaires)
export const validateDocumentFile = validateFile;


import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
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
  marketType?: "DC" | "DRPR" | "DRPO" | "AAO"; // Use enum type directly
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

    // 2. Enregistrer les métadonnées du document dans la base de données
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
      // Supprimer le fichier si l'insertion des métadonnées échoue
      await supabase.storage.from('documents').remove([filePath]);
      throw new Error(`Erreur lors de l'enregistrement du document: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    toast.error(error.message || "Une erreur est survenue lors de l'upload du document");
    throw error;
  }
};

export const getDocumentCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('document_categories')
      .select('*');

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    toast.error(error.message || "Erreur lors de la récupération des catégories");
    throw error;
  }
};

export const getDocuments = async () => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        document_categories(name, description)
      `)
      .order('upload_date', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    toast.error(error.message || "Erreur lors de la récupération des documents");
    throw error;
  }
};

export const updateDocument = async (documentId: string, updates: Partial<Document>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Utilisateur non authentifié");
    }

    // Convert status value if needed to match database enum
    const updatesWithCorrectStatus = { ...updates };
    // No need to modify status as we've updated the type definition

    // Mettre à jour le document
    const { data, error } = await supabase
      .from('documents')
      .update({
        ...updatesWithCorrectStatus,
        modified_by: user.id,
        last_modified: new Date().toISOString()
      })
      .eq('id', documentId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour:", error);
    throw error;
  }
};

export const deleteDocument = async (documentId: string) => {
  try {
    // 1. Récupérer les informations du document pour supprimer le fichier
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', documentId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // 2. Supprimer le document de la base de données
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (deleteError) {
      throw deleteError;
    }

    // 3. Supprimer le fichier associé du stockage
    if (document?.file_path) {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);

      if (storageError) {
        console.error("Erreur lors de la suppression du fichier:", storageError);
        // On ne lève pas d'erreur ici car le document a déjà été supprimé de la base
      }
    }

    return true;
  } catch (error: any) {
    console.error("Erreur lors de la suppression:", error);
    throw error;
  }
};

export const getDocumentHistory = async (documentId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_actions')
      .select(`
        *,
        profiles:user_id (full_name)
      `)
      .eq('document_id', documentId)
      .order('performed_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Format the data to include user fullname
    return data.map(action => ({
      ...action,
      user_fullname: action.profiles?.full_name
    }));
  } catch (error: any) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    throw error;
  }
};

export const getRecentDocuments = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        document_categories(name, description)
      `)
      .order('upload_date', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des documents récents:", error);
    throw error;
  }
};

export const countDocumentsByCategory = async () => {
  try {
    const { data: categories, error: categoriesError } = await supabase
      .from('document_categories')
      .select('id, name');

    if (categoriesError) throw categoriesError;

    // Get all documents with category_id
    const { data: documents, error: documentsError } = await supabase
      .from('documents')
      .select('category_id');

    if (documentsError) throw documentsError;

    // Count documents by category
    const counts = categories.map(category => {
      const count = documents.filter(doc => doc.category_id === category.id).length;
      return {
        id: category.id,
        name: category.name,
        count
      };
    });

    return counts;
  } catch (error: any) {
    console.error("Erreur lors du comptage des documents par catégorie:", error);
    throw error;
  }
};

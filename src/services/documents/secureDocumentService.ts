
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Document } from "@/types/document";

export const createSecureDocument = async (documentData: Partial<Document>, userProfile: any) => {
  try {
    console.log("🔄 Création sécurisée d'un document...", { documentData, userProfile });
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Utilisateur non authentifié");
    }

    // Validation des permissions - Archiviste = Admin local
    if (!userProfile || !['admin', 'admin_local', 'archiviste'].includes(userProfile.role)) {
      throw new Error("Permissions insuffisantes pour créer un document");
    }

    // Pour les admin_local et archivistes, forcer le département
    let finalDocumentData = { ...documentData };
    if (userProfile.role === 'admin_local' || userProfile.role === 'archiviste') {
      finalDocumentData.issuing_department = userProfile.department;
    }

    // Validation : s'assurer qu'un département est défini
    if (!finalDocumentData.issuing_department) {
      throw new Error("Le département émetteur est obligatoire");
    }

    // S'assurer que les champs obligatoires sont présents
    if (!finalDocumentData.category_id || !finalDocumentData.title || !finalDocumentData.document_type) {
      throw new Error("Les champs obligatoires sont manquants");
    }

    const { data, error } = await supabase
      .from('documents')
      .insert({
        title: finalDocumentData.title,
        reference_number: finalDocumentData.reference_number,
        document_date: finalDocumentData.document_date,
        document_type: finalDocumentData.document_type,
        file_path: finalDocumentData.file_path,
        file_type: finalDocumentData.file_type,
        file_size: finalDocumentData.file_size,
        category_id: finalDocumentData.category_id,
        description: finalDocumentData.description,
        issuing_department: finalDocumentData.issuing_department,
        budget_year: finalDocumentData.budget_year,
        budget_program: finalDocumentData.budget_program,
        market_type: finalDocumentData.market_type,
        uploaded_by: user.id,
        upload_date: new Date().toISOString(),
        last_modified: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Erreur lors de la création du document:", error);
      throw error;
    }

    console.log("✅ Document créé avec succès:", data);
    return data;
  } catch (error: any) {
    console.error("❌ Erreur dans createSecureDocument:", error);
    toast.error(error.message || "Erreur lors de la création du document");
    throw error;
  }
};

export const updateSecureDocument = async (documentId: string, updates: Partial<Document>, userProfile: any) => {
  try {
    console.log("🔄 Mise à jour sécurisée d'un document...", { documentId, updates, userProfile });
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Utilisateur non authentifié");
    }

    // Validation des permissions - Archiviste = Admin local
    if (!userProfile || !['admin', 'admin_local', 'archiviste'].includes(userProfile.role)) {
      throw new Error("Permissions insuffisantes pour modifier un document");
    }

    // Récupérer le document existant pour vérifier les permissions
    const { data: existingDoc, error: fetchError } = await supabase
      .from('documents')
      .select('issuing_department')
      .eq('id', documentId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Vérifier que l'admin_local/archiviste peut modifier ce document
    if ((userProfile.role === 'admin_local' || userProfile.role === 'archiviste') && existingDoc.issuing_department !== userProfile.department) {
      throw new Error("Vous ne pouvez modifier que les documents de votre département");
    }

    // Pour les admin_local et archivistes, s'assurer qu'ils ne changent pas le département
    let finalUpdates = { ...updates };
    if (userProfile.role === 'admin_local' || userProfile.role === 'archiviste') {
      // Supprimer issuing_department des mises à jour pour les admin_local/archivistes
      delete finalUpdates.issuing_department;
    }

    const { data, error } = await supabase
      .from('documents')
      .update({
        ...finalUpdates,
        modified_by: user.id,
        last_modified: new Date().toISOString()
      })
      .eq('id', documentId)
      .select()
      .single();

    if (error) {
      console.error("❌ Erreur lors de la mise à jour du document:", error);
      throw error;
    }

    console.log("✅ Document mis à jour avec succès:", data);
    return data;
  } catch (error: any) {
    console.error("❌ Erreur dans updateSecureDocument:", error);
    toast.error(error.message || "Erreur lors de la mise à jour du document");
    throw error;
  }
};

export const deleteSecureDocument = async (documentId: string, userProfile: any) => {
  try {
    console.log("🔄 Suppression sécurisée d'un document...", { documentId, userProfile });
    
    // Validation des permissions - Archiviste = Admin local
    if (!userProfile || !['admin', 'admin_local', 'archiviste'].includes(userProfile.role)) {
      throw new Error("Permissions insuffisantes pour supprimer un document");
    }

    // Pour les admin_local et archivistes, vérifier que le document appartient à leur département
    if (userProfile.role === 'admin_local' || userProfile.role === 'archiviste') {
      const { data: doc, error: fetchError } = await supabase
        .from('documents')
        .select('issuing_department')
        .eq('id', documentId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (doc.issuing_department !== userProfile.department) {
        throw new Error("Vous ne pouvez supprimer que les documents de votre département");
      }
    }

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
      }
    }

    console.log("✅ Document supprimé avec succès");
    return true;
  } catch (error: any) {
    console.error("❌ Erreur dans deleteSecureDocument:", error);
    toast.error(error.message || "Erreur lors de la suppression du document");
    throw error;
  }
};

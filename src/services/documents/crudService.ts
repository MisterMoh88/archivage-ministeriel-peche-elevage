
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Document } from "@/types/document";

export const getDocuments = async () => {
  try {
    console.log("🔄 Début de la récupération des documents...");
    
    // Requête simplifiée sans jointure complexe
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('upload_date', { ascending: false });

    if (error) {
      console.error("❌ Erreur Supabase lors de la récupération des documents:", error);
      throw error;
    }

    console.log("✅ Documents récupérés avec succès:", {
      count: data?.length || 0,
      sampleDocument: data?.[0] || null
    });

    return data || [];
  } catch (error: any) {
    console.error("❌ Erreur dans getDocuments:", error);
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

    const { data, error } = await supabase
      .from('documents')
      .update({
        ...updates,
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
      }
    }

    return true;
  } catch (error: any) {
    console.error("Erreur lors de la suppression:", error);
    throw error;
  }
};

export const getRecentDocuments = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('upload_date', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error("Erreur lors de la récupération des documents récents:", error);
    throw error;
  }
};

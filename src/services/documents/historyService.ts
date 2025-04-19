
import { supabase } from "@/integrations/supabase/client";
import { DocumentHistory } from "@/types/document";

export const getDocumentHistory = async (documentId: string): Promise<DocumentHistory[]> => {
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

    // Transform the data to match DocumentHistory type
    return data.map(action => ({
      id: action.id,
      document_id: action.document_id || "",
      user_id: action.user_id,
      action_type: action.action_type as "upload" | "update" | "delete" | "view",
      performed_at: action.performed_at,
      details: typeof action.details === 'string' ? action.details : {
        notes: action.details?.notes,
        changes: action.details?.changes
      },
      user_fullname: action.profiles?.full_name || 'Unknown User'
    }));

  } catch (error: any) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    throw error;
  }
};

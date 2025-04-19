
import { supabase } from "@/integrations/supabase/client";
import { DocumentHistory } from "@/types/document";

export const getDocumentHistory = async (documentId: string): Promise<DocumentHistory[]> => {
  try {
    const { data, error } = await supabase
      .from('user_actions')
      .select(`
        *,
        profiles(full_name)
      `)
      .eq('document_id', documentId)
      .order('performed_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform the data to match DocumentHistory type
    return data.map(action => {
      // Create a base history object
      const historyItem: DocumentHistory = {
        id: action.id,
        document_id: action.document_id || "",
        user_id: action.user_id,
        action_type: action.action_type as "upload" | "update" | "delete" | "view",
        performed_at: action.performed_at,
        user_fullname: action.profiles?.full_name || 'Utilisateur inconnu'
      };

      // Handle the details field - it could be a string or an object with specific properties
      if (action.details) {
        if (typeof action.details === 'string') {
          historyItem.details = action.details;
        } else if (typeof action.details === 'object') {
          // Check if the object has notes or changes properties
          const detailsObj: { notes?: string; changes?: any } = {};
          
          // Only add properties if they exist
          if ('notes' in action.details && action.details.notes) {
            detailsObj.notes = String(action.details.notes);
          }
          
          if ('changes' in action.details && action.details.changes) {
            detailsObj.changes = action.details.changes;
          }
          
          historyItem.details = detailsObj;
        }
      }

      return historyItem;
    });

  } catch (error: any) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    throw error;
  }
};

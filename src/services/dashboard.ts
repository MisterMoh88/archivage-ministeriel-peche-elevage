
import { supabase } from "@/integrations/supabase/client";

export interface DocumentStats {
  totalDocs: number;
  monthlyUploads: number;
  activeUsers: number;
  todaySearches: number;
}

export const fetchDocumentStats = async (): Promise<DocumentStats> => {
  const { data: totalDocs } = await supabase
    .from('documents')
    .select('count');

  const { data: monthlyUploads } = await supabase
    .from('documents')
    .select('count')
    .gte('upload_date', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

  const { data: activeUsers } = await supabase
    .from('profiles')
    .select('count')
    .eq('status', 'Actif');

  const { data: todaySearches } = await supabase
    .from('user_actions')
    .select('count')
    .eq('action_type', 'search')
    .gte('performed_at', new Date().toISOString().split('T')[0]);

  return {
    totalDocs: totalDocs?.[0]?.count || 0,
    monthlyUploads: monthlyUploads?.[0]?.count || 0,
    activeUsers: activeUsers?.[0]?.count || 0,
    todaySearches: todaySearches?.[0]?.count || 0
  };
};

// Interface for the activity data
export interface Activity {
  id: string;
  action_type: string;
  document_title: string; // Changed from nested document object
  user_name: string; // Changed from nested profile object
  performed_at: string;
}

export const fetchRecentActivity = async (): Promise<Activity[]> => {
  // The join in the original query doesn't work, so we'll fetch the data differently
  const { data } = await supabase
    .from('user_actions')
    .select(`
      id,
      action_type,
      document_id,
      performed_at,
      profiles(full_name)
    `)
    .order('performed_at', { ascending: false })
    .limit(5);

  if (!data) return [];

  // For each action, fetch the document title if a document_id exists
  const activitiesWithDocuments = await Promise.all(
    data.map(async (action) => {
      let documentTitle = "Document inconnu";
      
      if (action.document_id) {
        const { data: docData } = await supabase
          .from('documents')
          .select('title')
          .eq('id', action.document_id)
          .single();
          
        if (docData) {
          documentTitle = docData.title;
        }
      }
      
      return {
        id: action.id,
        action_type: action.action_type,
        document_title: documentTitle,
        user_name: action.profiles?.full_name || 'Utilisateur inconnu',
        performed_at: action.performed_at
      };
    })
  );

  return activitiesWithDocuments;
};

export interface RecentDocument {
  id: string;
  title: string;
  document_type: string;
  document_date: string;
  category_name: string;
}

export const fetchRecentDocuments = async (): Promise<RecentDocument[]> => {
  const { data } = await supabase
    .from('documents')
    .select(`
      id,
      title,
      document_type,
      document_date,
      document_categories(name)
    `)
    .order('upload_date', { ascending: false })
    .limit(5);

  if (!data) return [];

  return data.map(doc => ({
    id: doc.id,
    title: doc.title,
    document_type: doc.document_type,
    document_date: doc.document_date,
    category_name: doc.document_categories?.name || 'Non catégorisé'
  }));
};

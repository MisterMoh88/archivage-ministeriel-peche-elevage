
import { supabase } from "@/integrations/supabase/client";

export const fetchDocumentStats = async () => {
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

export const fetchRecentActivity = async () => {
  const { data } = await supabase
    .from('user_actions')
    .select(`
      *,
      documents!inner(title),
      profiles!inner(full_name)
    `)
    .order('performed_at', { ascending: false })
    .limit(5);

  return data || [];
};

export const fetchRecentDocuments = async () => {
  const { data } = await supabase
    .from('documents')
    .select(`
      *,
      document_categories(name)
    `)
    .order('upload_date', { ascending: false })
    .limit(5);

  return data || [];
};

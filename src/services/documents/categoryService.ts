
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export const countDocumentsByCategory = async () => {
  try {
    const { data: categories, error: categoriesError } = await supabase
      .from('document_categories')
      .select('id, name');

    if (categoriesError) throw categoriesError;

    const { data: documents, error: documentsError } = await supabase
      .from('documents')
      .select('category_id');

    if (documentsError) throw documentsError;

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

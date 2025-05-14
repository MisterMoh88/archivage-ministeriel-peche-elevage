
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Génère une URL publique pour visualiser un document avec gestion du cache
 * @param filePath Chemin du fichier dans le bucket storage
 * @returns URL publique avec paramètre anti-cache
 */
export const getDocumentPreviewUrl = async (filePath: string): Promise<string> => {
  try {
    if (!filePath) {
      throw new Error("Chemin du fichier non spécifié");
    }
    
    const { data, error } = await supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
      
    if (error || !data.publicUrl) {
      throw error || new Error("Impossible d'obtenir l'URL du document");
    }
    
    // Ajouter un paramètre anti-cache avec timestamp
    return `${data.publicUrl}?t=${Date.now()}`;
  } catch (error: any) {
    console.error("Erreur lors de la récupération de l'URL du document:", error);
    throw error;
  }
};

/**
 * Transforme une URL de prévisualisation en URL de téléchargement
 * @param previewUrl URL de prévisualisation
 * @returns URL de téléchargement
 */
export const getDownloadUrlFromPreview = (previewUrl: string): string => {
  // Supprime les paramètres de requête éventuels
  return previewUrl.split('?')[0];
};

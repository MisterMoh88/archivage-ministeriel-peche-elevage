
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
    
    // Vérifier d'abord si le fichier existe réellement dans le bucket
    const { data: fileExists, error: checkError } = await supabase.storage
      .from('documents')
      .list(filePath.split('/').slice(0, -1).join('/'), {
        limit: 100,
        offset: 0,
        search: filePath.split('/').pop() || '',
      });
    
    if (checkError) {
      console.error("Erreur lors de la vérification du fichier:", checkError);
    }
    
    if (!fileExists || fileExists.length === 0) {
      console.warn("Le fichier demandé n'existe pas dans le bucket:", filePath);
      // On continue quand même pour obtenir l'URL, car la vérification 
      // peut échouer dans certains cas même si le fichier existe
    }
    
    const { data, error } = await supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
      
    if (error || !data.publicUrl) {
      console.error("Erreur lors de l'obtention de l'URL:", error);
      throw new Error("Impossible d'obtenir l'URL du document");
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

/**
 * Vérifie si un fichier existe dans le bucket de stockage
 * @param filePath Chemin du fichier dans le bucket
 * @returns true si le fichier existe, false sinon
 */
export const checkFileExists = async (filePath: string): Promise<boolean> => {
  try {
    const folderPath = filePath.split('/').slice(0, -1).join('/');
    const fileName = filePath.split('/').pop() || '';
    
    const { data, error } = await supabase.storage
      .from('documents')
      .list(folderPath, {
        limit: 100,
        search: fileName
      });
    
    if (error) {
      console.error("Erreur lors de la vérification du fichier:", error);
      return false;
    }
    
    return data.some(file => file.name === fileName);
  } catch (error) {
    console.error("Erreur lors de la vérification du fichier:", error);
    return false;
  }
};

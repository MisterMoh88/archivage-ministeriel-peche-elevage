
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Génère une URL publique pour visualiser un document avec gestion du cache et validation
 * @param filePath Chemin du fichier dans le bucket storage
 * @returns URL publique avec paramètre anti-cache
 */
export const getDocumentPreviewUrl = async (filePath: string): Promise<string> => {
  try {
    if (!filePath) {
      throw new Error("Chemin du fichier non spécifié");
    }
    
    console.log("Génération de l'URL de prévisualisation pour:", filePath);
    
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
    
    // Générer l'URL publique
    const { data } = await supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
      
    if (!data.publicUrl) {
      console.error("Impossible d'obtenir l'URL du document");
      throw new Error("Impossible d'obtenir l'URL du document");
    }
    
    // Nettoyer et encoder correctement l'URL
    const cleanUrl = data.publicUrl
      .replace(/\s+/g, '_')  // Remplacer les espaces par des underscores
      .replace(/[<>:"|?*]/g, '_'); // Remplacer les caractères spéciaux
    
    // Ajouter un paramètre anti-cache avec timestamp
    const finalUrl = `${cleanUrl}?t=${Date.now()}`;
    
    console.log("URL générée:", {
      originalPath: filePath,
      publicUrl: data.publicUrl,
      cleanUrl: cleanUrl,
      finalUrl: finalUrl
    });
    
    return finalUrl;
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
    console.log("Vérification de l'existence du fichier:", filePath);
    
    const folderPath = filePath.split('/').slice(0, -1).join('/');
    const fileName = filePath.split('/').pop() || '';
    
    console.log("Recherche dans le dossier:", folderPath, "fichier:", fileName);
    
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
    
    const fileExists = data.some(file => file.name === fileName);
    console.log("Fichier trouvé:", fileExists, "dans la liste:", data.map(f => f.name));
    
    return fileExists;
  } catch (error) {
    console.error("Erreur lors de la vérification du fichier:", error);
    return false;
  }
};

/**
 * Teste l'accessibilité d'une URL de document via une requête HEAD
 * @param url URL du document à tester
 * @returns true si l'URL est accessible, false sinon
 */
export const testDocumentUrl = async (url: string): Promise<boolean> => {
  try {
    console.log("Test d'accessibilité de l'URL:", url);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'cors'
    });
    
    console.log("Réponse du test d'URL:", {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    return response.ok;
  } catch (error) {
    console.error("Erreur lors du test de l'URL:", error);
    return false;
  }
};

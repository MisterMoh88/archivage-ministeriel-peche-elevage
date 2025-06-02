
import React from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FileText, FileImage, FileSpreadsheet, FileArchive, File } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Format file size utility
export const formatFileSize = (bytes: number) => {
  if (!bytes) return "N/A";
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// Get file icon utility
export const getFileIcon = (fileType: string) => {
  const type = fileType?.toLowerCase() || "";
  if (type.includes("pdf")) return <File className="h-4 w-4 text-ministry-blue" />;
  if (type.includes("image") || type.includes("jpg") || type.includes("png")) 
    return <FileImage className="h-4 w-4 text-ministry-blue" />;
  if (type.includes("sheet") || type.includes("excel") || type.includes("xlsx")) 
    return <FileSpreadsheet className="h-4 w-4 text-ministry-blue" />;
  if (type.includes("zip") || type.includes("rar")) 
    return <FileArchive className="h-4 w-4 text-ministry-blue" />;
  return <FileText className="h-4 w-4 text-ministry-blue" />;
};

// Format date utility
export const formatDate = (dateString: string) => {
  try {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy', { locale: fr });
  } catch (error) {
    return dateString || "N/A";
  }
};

// Document actions
export const handleDownload = async (filePath: string, title: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(filePath);
    
    if (error) {
      throw error;
    }
    
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = title || 'document';
    document.body.appendChild(link);
    link.click();
    
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Erreur de téléchargement:", error);
    toast.error("Erreur lors du téléchargement du document");
    return Promise.reject(error);
  }
};

export const handlePreview = async (filePath: string) => {
  try {
    const { data } = await supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    if (!data || !data.publicUrl) {
      throw new Error("Impossible d'obtenir l'URL publique");
    }
    
    window.open(data.publicUrl, '_blank');
  } catch (error) {
    console.error("Erreur de prévisualisation:", error);
    toast.error("Erreur lors de la prévisualisation du document");
  }
};

// Log document view in history
export const logDocumentView = async (documentId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await supabase.from('user_actions').insert({
      user_id: user.id,
      document_id: documentId,
      action_type: 'view',
      details: { action: 'Consultation du document' }
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la consultation:", error);
  }
};

/**
 * Génère une URL publique valide pour un fichier stocké dans Supabase avec diagnostic complet
 */
export const getSupabasePublicUrl = (filePath: string | null | undefined): string | null => {
  if (!filePath || filePath.trim() === "") {
    console.warn("🚨 Chemin de fichier vide ou invalide:", filePath);
    return null;
  }

  try {
    // URL de base du stockage Supabase
    const baseUrl = "https://knvrrwesxppwldomarhn.supabase.co/storage/v1/object/public/documents";
    
    // Nettoie le chemin en supprimant les espaces et caractères spéciaux problématiques
    const cleanPath = filePath.trim()
      .replace(/\s+/g, '_')
      .replace(/[<>:"|?*]/g, '_');
    
    // Encode correctement l'URL en préservant les slashes
    const encodedPath = encodeURIComponent(cleanPath).replace(/%2F/g, '/');
    
    const fullUrl = `${baseUrl}/${encodedPath}`;
    
    console.log("📄 URL générée pour le document:", {
      originalPath: filePath,
      cleanedPath: cleanPath,
      encodedPath: encodedPath,
      fullUrl: fullUrl,
      timestamp: new Date().toISOString()
    });
    
    return fullUrl;
  } catch (error) {
    console.error("❌ Erreur lors de la génération de l'URL publique:", error);
    return null;
  }
};

/**
 * Vérifie si un fichier existe et est accessible via son URL publique avec diagnostic détaillé
 */
export const checkFileAccessibility = async (fileUrl: string): Promise<{accessible: boolean, details: any}> => {
  const diagnostic = {
    url: fileUrl,
    timestamp: new Date().toISOString(),
    accessible: false,
    httpStatus: null,
    responseHeaders: {},
    errorMessage: null,
    corsEnabled: false
  };

  try {
    console.log("🔍 Test d'accessibilité détaillé pour:", fileUrl);
    
    // Test avec HEAD request d'abord
    const headResponse = await fetch(fileUrl, { 
      method: 'HEAD',
      mode: 'cors',
      cache: 'no-cache'
    });
    
    diagnostic.httpStatus = headResponse.status;
    diagnostic.responseHeaders = Object.fromEntries(headResponse.headers.entries());
    diagnostic.corsEnabled = headResponse.headers.get('access-control-allow-origin') !== null;
    diagnostic.accessible = headResponse.ok;
    
    if (!headResponse.ok) {
      diagnostic.errorMessage = `HTTP ${headResponse.status}: ${headResponse.statusText}`;
      
      // Test avec GET si HEAD échoue
      try {
        const getResponse = await fetch(fileUrl, { 
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache'
        });
        diagnostic.accessible = getResponse.ok;
        if (getResponse.ok) {
          diagnostic.errorMessage = "HEAD failed but GET succeeded";
        }
      } catch (getError: any) {
        diagnostic.errorMessage += ` | GET also failed: ${getError.message}`;
      }
    }
    
    console.log("📊 Diagnostic complet d'accessibilité:", diagnostic);
    return { accessible: diagnostic.accessible, details: diagnostic };
    
  } catch (error: any) {
    diagnostic.errorMessage = error.message;
    console.error("❌ Erreur lors du test d'accessibilité:", error);
    return { accessible: false, details: diagnostic };
  }
};

/**
 * Diagnostic complet d'un document avec toutes les vérifications
 */
export const performDocumentDiagnostic = async (filePath: string) => {
  console.log("🔬 Démarrage du diagnostic complet pour:", filePath);
  
  const url = getSupabasePublicUrl(filePath);
  if (!url) {
    console.error("❌ Impossible de générer l'URL pour:", filePath);
    return { success: false, error: "URL generation failed" };
  }
  
  const accessibilityResult = await checkFileAccessibility(url);
  
  // Test d'existence dans le bucket
  let bucketFileExists = false;
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .list(filePath.split('/').slice(0, -1).join('/'), {
        limit: 100,
        search: filePath.split('/').pop() || ''
      });
    
    bucketFileExists = !error && data && data.some(file => file.name === filePath.split('/').pop());
    console.log(`📂 Fichier existant dans le bucket: ${bucketFileExists}`);
  } catch (error) {
    console.error("❌ Erreur lors de la vérification du bucket:", error);
  }
  
  const fullDiagnostic = {
    filePath,
    url,
    bucketFileExists,
    accessibility: accessibilityResult,
    timestamp: new Date().toISOString()
  };
  
  console.log("🔬 Diagnostic complet terminé:", fullDiagnostic);
  return fullDiagnostic;
};

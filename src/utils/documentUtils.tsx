
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
    
    toast.success("Document téléchargé avec succès");
  } catch (error) {
    console.error("Erreur de téléchargement:", error);
    toast.error("Erreur lors du téléchargement du document");
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
    if (!user) return; // Silent fail if not authenticated
    
    await supabase.from('user_actions').insert({
      user_id: user.id,
      document_id: documentId,
      action_type: 'view',
      details: { action: 'Consultation du document' }
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la consultation:", error);
    // Silent fail, don't show toast to user for view logging
  }
};

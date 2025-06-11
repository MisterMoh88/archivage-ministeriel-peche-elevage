
import { Document } from "@/types/document";
import { ArchiveDocumentItem } from "./ArchiveDocumentItem";

interface ArchiveDocumentsListProps {
  documents: Document[];
  isLoading: boolean;
  getCategoryName: (categoryId: string) => string;
  onView: (doc: Document) => void;
  onEdit: (doc: Document) => void;
  onDelete: (doc: Document) => void;
  userProfile?: {
    role: 'admin' | 'admin_local' | 'utilisateur';
    department: string | null;
  } | null;
}

export const ArchiveDocumentsList = ({
  documents,
  isLoading,
  getCategoryName,
  onView,
  onEdit,
  onDelete,
  userProfile,
}: ArchiveDocumentsListProps) => {
  console.log("📋 ArchiveDocumentsList render:", {
    documentsCount: documents.length,
    isLoading,
    sampleDocument: documents[0] || null,
    userRole: userProfile?.role
  });

  // Fonction pour vérifier les permissions d'édition
  const canEditDocument = (document: Document) => {
    if (!userProfile) return false;
    
    if (userProfile.role === 'admin') return true;
    if (userProfile.role === 'admin_local') {
      return document.issuing_department === userProfile.department;
    }
    return false; // Les utilisateurs normaux ne peuvent pas éditer
  };

  // Fonction pour vérifier les permissions de suppression
  const canDeleteDocument = (document: Document) => {
    if (!userProfile) return false;
    
    if (userProfile.role === 'admin') return true;
    if (userProfile.role === 'admin_local') {
      return document.issuing_department === userProfile.department;
    }
    return false; // Les utilisateurs normaux ne peuvent pas supprimer
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-muted-foreground">Chargement des documents...</span>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">Aucun document trouvé</p>
        <p className="text-xs text-muted-foreground mt-2">
          Vérifiez vos filtres ou ajoutez des documents au système
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {documents.map((doc, index) => {
        console.log(`📄 Rendu document ${index + 1}:`, {
          id: doc.id,
          title: doc.title,
          categoryId: doc.category_id,
          department: doc.issuing_department,
          canEdit: canEditDocument(doc),
          canDelete: canDeleteDocument(doc)
        });
        
        return (
          <ArchiveDocumentItem
            key={doc.id}
            document={doc}
            getCategoryName={getCategoryName}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            canEdit={canEditDocument(doc)}
            canDelete={canDeleteDocument(doc)}
          />
        );
      })}
    </div>
  );
};

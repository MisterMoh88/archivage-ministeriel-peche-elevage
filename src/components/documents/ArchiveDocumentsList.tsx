
import { Document } from "@/types/document";
import { ArchiveDocumentItem } from "./ArchiveDocumentItem";

interface ArchiveDocumentsListProps {
  documents: Document[];
  isLoading: boolean;
  getCategoryName: (categoryId: string) => string;
  onView: (doc: Document) => void;
  onEdit: (doc: Document) => void;
  onDelete: (doc: Document) => void;
}

export const ArchiveDocumentsList = ({
  documents,
  isLoading,
  getCategoryName,
  onView,
  onEdit,
  onDelete,
}: ArchiveDocumentsListProps) => {
  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">Chargement des documents...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">Aucun document trouvé</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {documents.map((doc) => (
        <ArchiveDocumentItem
          key={doc.id}
          document={doc}
          getCategoryName={getCategoryName}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

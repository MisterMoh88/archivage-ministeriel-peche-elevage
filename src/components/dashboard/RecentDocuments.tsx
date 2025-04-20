
import { FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Document {
  id: string;
  title: string;
  document_type: string;
  document_date: string;
  document_categories: {
    name: string;
  };
}

interface RecentDocumentsProps {
  documents: Document[];
  isLoading: boolean;
}

export function RecentDocuments({ documents, isLoading }: RecentDocumentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents récents</CardTitle>
        <CardDescription>
          Les 5 derniers documents ajoutés au système
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p>Chargement...</p>
          ) : documents.map((doc) => (
            <div key={doc.id} className="flex items-start gap-4 rounded-lg border p-3">
              <div className="rounded-full p-2 bg-ministry-blue/10">
                <FileText className="h-4 w-4 text-ministry-blue" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{doc.title}</p>
                <div className="flex gap-2 text-xs">
                  <span className="rounded-full bg-ministry-blue/20 px-2 py-0.5 text-ministry-darkBlue">
                    {doc.document_categories?.name}
                  </span>
                  <span className="text-muted-foreground">
                    {doc.document_type} • {new Date(doc.document_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

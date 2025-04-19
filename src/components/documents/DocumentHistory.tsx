
import React from "react";
import { Clock, User } from "lucide-react";
import { DocumentHistory as DocumentHistoryType } from "@/types/document";
import { formatDate } from "@/utils/documentUtils";

interface DocumentHistoryProps {
  history: DocumentHistoryType[] | undefined;
  isLoading: boolean;
}

export const DocumentHistory = ({ history, isLoading }: DocumentHistoryProps) => {
  const getHistoryDetails = (details: any): string | undefined => {
    if (!details) return undefined;
    if (typeof details === 'string') return undefined;
    return details.notes;
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="py-10 text-center">
          <p className="text-muted-foreground">Chargement de l'historique...</p>
        </div>
      ) : history && history.length > 0 ? (
        <div className="space-y-2">
          {history.map((entry, index) => (
            <div key={index} className="flex items-start space-x-2 p-2 rounded-md border">
              <div className="rounded-full bg-primary/10 p-2">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    {entry.action_type === "upload" && "Ajout du document"}
                    {entry.action_type === "update" && "Modification du document"}
                    {entry.action_type === "delete" && "Suppression du document"}
                    {entry.action_type === "view" && "Consultation du document"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(entry.performed_at)}
                  </span>
                </div>
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {entry.user_fullname || "Utilisateur inconnu"}
                  </span>
                </div>
                {getHistoryDetails(entry.details) && (
                  <p className="text-xs mt-1">{getHistoryDetails(entry.details)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <p className="text-muted-foreground">Aucun historique disponible pour ce document.</p>
        </div>
      )}
    </div>
  );
};

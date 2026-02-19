import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Download, Search, Activity, Loader2 } from "lucide-react";

export function ActivityLogs() {
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_actions")
        .select("id, action_type, document_id, performed_at, details, user_id, profiles(full_name)")
        .order("performed_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      // Fetch document titles for entries with document_id
      const docIds = [...new Set(data?.filter(d => d.document_id).map(d => d.document_id) || [])];
      const docMap = new Map<string, string>();
      
      if (docIds.length > 0) {
        const { data: docs } = await supabase
          .from("documents")
          .select("id, title")
          .in("id", docIds);
        docs?.forEach(d => docMap.set(d.id, d.title));
      }

      return (data || []).map(entry => ({
        id: entry.id,
        timestamp: entry.performed_at,
        user: (entry.profiles as any)?.full_name || "Utilisateur inconnu",
        action: entry.action_type,
        resource: entry.document_id ? (docMap.get(entry.document_id) || entry.document_id) : "Système",
        status: "success" as const,
        details: typeof entry.details === 'object' && entry.details 
          ? (entry.details as any).title || JSON.stringify(entry.details).substring(0, 100) 
          : "",
      }));
    },
  });

  const getActionLabel = (action: string) => {
    const actions: Record<string, string> = {
      login: "Connexion",
      logout: "Déconnexion",
      upload: "Upload document",
      view: "Consultation",
      update: "Modification",
      delete: "Suppression",
      search: "Recherche",
      download: "Téléchargement",
    };
    return actions[action] || action;
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchQuery ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const exportLogs = () => {
    const csv = [
      "Horodatage,Utilisateur,Action,Ressource,Détails",
      ...filteredLogs.map(l =>
        `"${format(new Date(l.timestamp), "dd/MM/yyyy HH:mm:ss")}","${l.user}","${getActionLabel(l.action)}","${l.resource}","${l.details || ""}"`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `journaux_activite_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Journaux d'activité
          </CardTitle>
          <CardDescription>
            Historique des actions du système en temps réel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les journaux..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type d'action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les actions</SelectItem>
                <SelectItem value="upload">Uploads</SelectItem>
                <SelectItem value="view">Consultations</SelectItem>
                <SelectItem value="update">Modifications</SelectItem>
                <SelectItem value="delete">Suppressions</SelectItem>
                <SelectItem value="search">Recherches</SelectItem>
                <SelectItem value="download">Téléchargements</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportLogs} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Horodatage</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Ressource</TableHead>
                    <TableHead>Détails</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Aucune activité enregistrée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {format(new Date(log.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: fr })}
                        </TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getActionLabel(log.action)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{log.resource}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                          {log.details}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

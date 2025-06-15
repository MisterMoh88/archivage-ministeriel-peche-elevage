
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Download, Filter, Search, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  status: "success" | "warning" | "error";
  details?: string;
}

export function ActivityLogs() {
  const [date, setDate] = useState<Date>();
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Données d'exemple pour les journaux
  const mockLogs: LogEntry[] = [
    {
      id: "1",
      timestamp: "2025-06-15 15:30:25",
      user: "Admin Système",
      action: "LOGIN",
      resource: "Système",
      ip: "192.168.1.100",
      status: "success",
      details: "Connexion réussie"
    },
    {
      id: "2",
      timestamp: "2025-06-15 15:28:12",
      user: "Marie Traoré",
      action: "DOCUMENT_UPLOAD",
      resource: "Document #1234",
      ip: "192.168.1.101",
      status: "success",
      details: "Upload: rapport_mensuel.pdf"
    },
    {
      id: "3",
      timestamp: "2025-06-15 15:25:45",
      user: "Jean Diallo",
      action: "DOCUMENT_VIEW",
      resource: "Document #1233",
      ip: "192.168.1.102",
      status: "success",
      details: "Consultation document confidentiel"
    },
    {
      id: "4",
      timestamp: "2025-06-15 15:20:10",
      user: "Utilisateur Inconnu",
      action: "LOGIN_FAILED",
      resource: "Système",
      ip: "192.168.1.200",
      status: "error",
      details: "Tentative de connexion avec mot de passe incorrect"
    },
    {
      id: "5",
      timestamp: "2025-06-15 15:15:33",
      user: "Admin Local",
      action: "USER_CREATED",
      resource: "Utilisateur #567",
      ip: "192.168.1.103",
      status: "success",
      details: "Création compte: nouvel.utilisateur@example.com"
    }
  ];

  const getStatusBadge = (status: LogEntry['status']) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Succès</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Erreur</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getActionLabel = (action: string) => {
    const actions: Record<string, string> = {
      LOGIN: "Connexion",
      LOGOUT: "Déconnexion", 
      LOGIN_FAILED: "Échec connexion",
      DOCUMENT_UPLOAD: "Upload document",
      DOCUMENT_VIEW: "Consultation",
      DOCUMENT_EDIT: "Modification",
      DOCUMENT_DELETE: "Suppression",
      USER_CREATED: "Création utilisateur",
      USER_UPDATED: "Modification utilisateur",
      USER_DELETED: "Suppression utilisateur",
      SETTINGS_CHANGED: "Modification paramètres"
    };
    return actions[action] || action;
  };

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = !searchQuery || 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  const exportLogs = () => {
    // Logique d'export des journaux
    alert("Export des journaux en cours...");
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
            Consultez et exportez l'historique des actions du système
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
                <SelectItem value="LOGIN">Connexions</SelectItem>
                <SelectItem value="DOCUMENT_UPLOAD">Uploads</SelectItem>
                <SelectItem value="DOCUMENT_VIEW">Consultations</SelectItem>
                <SelectItem value="DOCUMENT_EDIT">Modifications</SelectItem>
                <SelectItem value="USER_CREATED">Créations utilisateur</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-48 justify-start text-left font-normal", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Button onClick={exportLogs} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Horodatage</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Ressource</TableHead>
                  <TableHead>Adresse IP</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Détails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getActionLabel(log.action)}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.resource}</TableCell>
                    <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucun journal ne correspond aux critères de recherche
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, UserPlus, Trash2, Shield } from "lucide-react";

interface DocumentAccessManagerProps {
  documentId: string;
  documentTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

interface AccessEntry {
  id: string;
  user_id: string;
  can_view: boolean;
  can_download: boolean;
  granted_at: string;
  user_name?: string;
}

interface UserOption {
  id: string;
  full_name: string;
  department: string | null;
}

export const DocumentAccessManager = ({ documentId, documentTitle, isOpen, onClose }: DocumentAccessManagerProps) => {
  const [accessList, setAccessList] = useState<AccessEntry[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAccessList();
      fetchUsers();
    }
  }, [isOpen, documentId]);

  const fetchAccessList = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("document_access")
        .select("*")
        .eq("document_id", documentId);

      if (error) throw error;

      // Fetch user names
      const userIds = data.map((d: any) => d.user_id);
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);

        const enriched = data.map((entry: any) => ({
          ...entry,
          user_name: profiles?.find((p: any) => p.id === entry.user_id)?.full_name || "Utilisateur inconnu"
        }));
        setAccessList(enriched);
      } else {
        setAccessList([]);
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Impossible de charger les accès");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, department")
        .order("full_name");

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const addAccess = async () => {
    if (!selectedUserId) return;
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from("document_access")
        .insert({
          document_id: documentId,
          user_id: selectedUserId,
          can_view: true,
          can_download: false,
          granted_by: user.id,
        });

      if (error) throw error;
      toast.success("Accès ajouté");
      setSelectedUserId("");
      fetchAccessList();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'ajout");
    } finally {
      setIsSaving(false);
    }
  };

  const updateAccess = async (id: string, field: "can_view" | "can_download", value: boolean) => {
    try {
      const { error } = await supabase
        .from("document_access")
        .update({ [field]: value })
        .eq("id", id);

      if (error) throw error;
      setAccessList(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const removeAccess = async (id: string) => {
    try {
      const { error } = await supabase
        .from("document_access")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setAccessList(prev => prev.filter(a => a.id !== id));
      toast.success("Accès retiré");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const availableUsers = users.filter(u => !accessList.some(a => a.user_id === u.id));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestion des accès nominaux
          </DialogTitle>
          <DialogDescription>
            Gérez les accès individuels pour « {documentTitle} »
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un utilisateur" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name || "Sans nom"} {user.department ? `(${user.department})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addAccess} disabled={!selectedUserId || isSaving} size="sm">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4 mr-1" />}
            Ajouter
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : accessList.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">Aucun accès nominal configuré</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Consultation</TableHead>
                <TableHead>Téléchargement</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessList.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.user_name}</TableCell>
                  <TableCell>
                    <Switch
                      checked={entry.can_view}
                      onCheckedChange={(val) => updateAccess(entry.id, "can_view", val)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={entry.can_download}
                      onCheckedChange={(val) => updateAccess(entry.id, "can_download", val)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeAccess(entry.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
};

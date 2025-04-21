
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

interface UserFormValues {
  email: string;
  full_name: string;
  role: UserRole;
  password?: string;
  department?: string;
}

const UserFormSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  full_name: z.string().min(3, "Le nom complet doit contenir au moins 3 caractères"),
  role: z.enum(["admin", "archiviste", "utilisateur"] as const),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").optional(),
  department: z.string().optional(),
});

export function UserManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name");

      if (error) {
        toast.error(`Erreur lors du chargement des utilisateurs: ${error.message}`);
        throw error;
      }

      return profiles || [];
    },
  });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      email: "",
      full_name: "",
      role: "utilisateur",
      department: "",
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      // Création de l'utilisateur dans auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: values.email,
        password: values.password,
        email_confirm: true,
        user_metadata: {
          full_name: values.full_name,
        },
      });

      if (authError) {
        throw authError;
      }

      // Mise à jour du profil avec les rôles et autres infos
      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: values.full_name,
            role: values.role,
            department: values.department,
            status: "Actif",
          })
          .eq("id", authData.user.id);

        if (profileError) {
          throw profileError;
        }
      }

      return authData;
    },
    onSuccess: () => {
      toast.success("Utilisateur créé avec succès");
      form.reset();
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      toast.error(`Erreur lors de la création de l'utilisateur: ${error.message}`);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      if (!editingUser) return;

      // Mise à jour des propriétés du profil
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: values.full_name,
          role: values.role,
          department: values.department,
        })
        .eq("id", editingUser.id);

      if (profileError) {
        throw profileError;
      }

      // Si un nouveau mot de passe est fourni, mise à jour du mot de passe
      if (values.password) {
        const { error: authError } = await supabase.auth.admin.updateUserById(
          editingUser.id,
          { password: values.password }
        );

        if (authError) {
          throw authError;
        }
      }

      return { success: true };
    },
    onSuccess: () => {
      toast.success("Utilisateur mis à jour avec succès");
      form.reset();
      setIsDialogOpen(false);
      setEditingUser(null);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour de l'utilisateur: ${error.message}`);
    },
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: async (user: any) => {
      const newStatus = user.status === "Actif" ? "Inactif" : "Actif";
      
      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      return { id: user.id, newStatus };
    },
    onSuccess: (data) => {
      toast.success(`Statut de l'utilisateur mis à jour: ${data.newStatus}`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      toast.error(`Erreur lors du changement de statut: ${error.message}`);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Utilisateur supprimé avec succès");
      setIsDeleteDialogOpen(false);
      setDeletingUser(null);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression de l'utilisateur: ${error.message}`);
    },
  });

  const handleOpenDialog = (user?: any) => {
    if (user) {
      // Mode édition
      setEditingUser(user);
      form.reset({
        email: user.email || "",
        full_name: user.full_name || "",
        role: user.role,
        department: user.department || "",
      });
    } else {
      // Mode création
      setEditingUser(null);
      form.reset({
        email: "",
        full_name: "",
        role: "utilisateur",
        department: "",
        password: "",
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (values: UserFormValues) => {
    if (editingUser) {
      updateUserMutation.mutate(values);
    } else {
      createUserMutation.mutate(values);
    }
  };

  const handleOpenDeleteDialog = (user: any) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteUser = () => {
    if (deletingUser) {
      deleteUserMutation.mutate(deletingUser.id);
    }
  };

  const handleToggleStatus = (user: any) => {
    toggleUserStatusMutation.mutate(user);
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "default";
      case "archiviste":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des utilisateurs</h2>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Nouvel utilisateur</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ministry-blue"></div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom complet</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name || "Non renseigné"}</TableCell>
                    <TableCell>{user.email || "Non renseigné"}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role as UserRole)}>
                        {user.role === "admin" 
                          ? "Administrateur" 
                          : user.role === "archiviste" 
                            ? "Archiviste" 
                            : "Utilisateur"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.department || "Non renseigné"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            user.status === "Actif" ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                        {user.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleStatus(user)}
                          title={user.status === "Actif" ? "Désactiver" : "Activer"}
                        >
                          {user.status === "Actif" ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenDialog(user)}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleOpenDeleteDialog(user)}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialogue de création/édition d'utilisateur */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Modifiez les informations de l'utilisateur ci-dessous."
                : "Remplissez les informations pour créer un nouvel utilisateur."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom et prénom" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse e-mail</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="exemple@domaine.com" 
                        disabled={!!editingUser} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {editingUser ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="password" 
                        placeholder={editingUser ? "Laisser vide pour ne pas changer" : "Mot de passe"} 
                        required={!editingUser}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="archiviste">Archiviste</SelectItem>
                        <SelectItem value="utilisateur">Utilisateur</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Département</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Département ou service" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={createUserMutation.isPending || updateUserMutation.isPending}
                >
                  {(createUserMutation.isPending || updateUserMutation.isPending) ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Enregistrement...
                    </>
                  ) : (
                    editingUser ? "Mettre à jour" : "Créer l'utilisateur"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

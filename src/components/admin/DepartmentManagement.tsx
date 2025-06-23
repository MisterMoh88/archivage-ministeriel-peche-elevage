
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, Edit, Trash2, Building } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Department {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

interface DepartmentFormValues {
  name: string;
  description?: string;
}

const DepartmentFormSchema = z.object({
  name: z.string().min(2, "Le nom du département doit contenir au moins 2 caractères"),
  description: z.string().optional(),
});

export function DepartmentManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("name");

      if (error) {
        toast.error(`Erreur lors du chargement des départements: ${error.message}`);
        throw error;
      }

      return data as Department[];
    },
  });

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(DepartmentFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createDepartmentMutation = useMutation({
    mutationFn: async (values: DepartmentFormValues) => {
      const { data, error } = await supabase
        .from("departments")
        .insert({
          name: values.name,
          description: values.description,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Département créé avec succès");
      form.reset();
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error: any) => {
      toast.error(`Erreur lors de la création du département: ${error.message}`);
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: async (values: DepartmentFormValues) => {
      if (!editingDepartment) return;

      const { data, error } = await supabase
        .from("departments")
        .update({
          name: values.name,
          description: values.description,
        })
        .eq("id", editingDepartment.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Département mis à jour avec succès");
      form.reset();
      setIsDialogOpen(false);
      setEditingDepartment(null);
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error: any) => {
      toast.error(`Erreur lors de la mise à jour du département: ${error.message}`);
    },
  });

  const toggleDepartmentStatusMutation = useMutation({
    mutationFn: async (department: Department) => {
      const { data, error } = await supabase
        .from("departments")
        .update({ is_active: !department.is_active })
        .eq("id", department.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success(`Département ${data.is_active ? 'activé' : 'désactivé'} avec succès`);
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error: any) => {
      toast.error(`Erreur lors du changement de statut: ${error.message}`);
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: async (departmentId: string) => {
      const { error } = await supabase
        .from("departments")
        .delete()
        .eq("id", departmentId);
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Département supprimé avec succès");
      setIsDeleteDialogOpen(false);
      setDeletingDepartment(null);
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error: any) => {
      toast.error(`Erreur lors de la suppression du département: ${error.message}`);
    },
  });

  const handleOpenDialog = (department?: Department) => {
    if (department) {
      setEditingDepartment(department);
      form.reset({
        name: department.name,
        description: department.description || "",
      });
    } else {
      setEditingDepartment(null);
      form.reset({
        name: "",
        description: "",
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (values: DepartmentFormValues) => {
    if (editingDepartment) {
      updateDepartmentMutation.mutate(values);
    } else {
      createDepartmentMutation.mutate(values);
    }
  };

  const handleOpenDeleteDialog = (department: Department) => {
    setDeletingDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDepartment = () => {
    if (deletingDepartment) {
      deleteDepartmentMutation.mutate(deletingDepartment.id);
    }
  };

  const handleToggleStatus = (department: Department) => {
    toggleDepartmentStatusMutation.mutate(department);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des départements</h2>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Nouveau département</span>
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
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Aucun département trouvé
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        {department.name}
                      </div>
                    </TableCell>
                    <TableCell>{department.description || "Aucune description"}</TableCell>
                    <TableCell>
                      <Badge variant={department.is_active ? "default" : "secondary"}>
                        {department.is_active ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(department.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleStatus(department)}
                          title={department.is_active ? "Désactiver" : "Activer"}
                        >
                          {department.is_active ? "🔴" : "🟢"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenDialog(department)}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleOpenDeleteDialog(department)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingDepartment ? "Modifier le département" : "Nouveau département"}
            </DialogTitle>
            <DialogDescription>
              {editingDepartment
                ? "Modifiez les informations du département ci-dessous."
                : "Remplissez les informations pour créer un nouveau département."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du département</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom du département" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Description du département (optionnel)" />
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
                  disabled={createDepartmentMutation.isPending || updateDepartmentMutation.isPending}
                >
                  {(createDepartmentMutation.isPending || updateDepartmentMutation.isPending) ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Enregistrement...
                    </>
                  ) : (
                    editingDepartment ? "Mettre à jour" : "Créer le département"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce département ? Cette action est irréversible.
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
              onClick={handleDeleteDepartment}
              disabled={deleteDepartmentMutation.isPending}
            >
              {deleteDepartmentMutation.isPending ? (
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

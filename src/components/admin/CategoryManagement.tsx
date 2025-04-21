
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, Edit, Trash2, Settings } from "lucide-react";
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
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Check, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const CategoryFormSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().optional(),
});

interface CategoryFormValues {
  name: string;
  description?: string;
}

interface CategoryWithCount {
  id: string;
  name: string;
  description: string | null;
  documentCount: number;
}

export function CategoryManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [drawerCategory, setDrawerCategory] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formFields, setFormFields] = useState<{id: string, name: string, required: boolean}[]>([]);
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      // Récupérer les catégories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("document_categories")
        .select("*")
        .order("name");

      if (categoriesError) {
        toast.error(`Erreur lors du chargement des catégories: ${categoriesError.message}`);
        throw categoriesError;
      }

      // Compter les documents par catégorie
      const categoriesWithCounts: CategoryWithCount[] = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const { count, error: countError } = await supabase
            .from("documents")
            .select("*", { count: "exact", head: true })
            .eq("category_id", category.id);

          if (countError) {
            console.error(`Erreur lors du comptage des documents: ${countError.message}`);
            return {
              ...category,
              documentCount: 0,
            };
          }

          return {
            ...category,
            documentCount: count || 0,
          };
        })
      );

      return categoriesWithCounts || [];
    },
  });

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      const { data, error } = await supabase
        .from("document_categories")
        .insert([
          {
            name: values.name,
            description: values.description,
            created_by: (await supabase.auth.getUser()).data.user?.id,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Catégorie créée avec succès");
      form.reset();
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (error) => {
      toast.error(`Erreur lors de la création de la catégorie: ${error.message}`);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      if (!editingCategory) return;

      const { data, error } = await supabase
        .from("document_categories")
        .update({
          name: values.name,
          description: values.description,
        })
        .eq("id", editingCategory.id)
        .select();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Catégorie mise à jour avec succès");
      form.reset();
      setIsDialogOpen(false);
      setEditingCategory(null);
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour de la catégorie: ${error.message}`);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase
        .from("document_categories")
        .delete()
        .eq("id", categoryId);

      if (error) {
        throw error;
      }

      return { success: true };
    },
    onSuccess: () => {
      toast.success("Catégorie supprimée avec succès");
      setIsDeleteDialogOpen(false);
      setDeletingCategory(null);
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression de la catégorie: ${error.message}`);
    },
  });

  const handleOpenDialog = (category?: any) => {
    if (category) {
      // Mode édition
      setEditingCategory(category);
      form.reset({
        name: category.name,
        description: category.description || "",
      });
    } else {
      // Mode création
      setEditingCategory(null);
      form.reset({
        name: "",
        description: "",
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (values: CategoryFormValues) => {
    if (editingCategory) {
      updateCategoryMutation.mutate(values);
    } else {
      createCategoryMutation.mutate(values);
    }
  };

  const handleOpenDeleteDialog = (category: any) => {
    setDeletingCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCategory = () => {
    if (deletingCategory) {
      deleteCategoryMutation.mutate(deletingCategory.id);
    }
  };

  const handleOpenDrawer = (category: any) => {
    setDrawerCategory(category);
    // Simuler le chargement des champs de formulaire pour cette catégorie
    // Dans une vraie implémentation, ces champs seraient stockés dans la base de données
    setFormFields([
      { id: "1", name: "Référence", required: true },
      { id: "2", name: "Date du document", required: true },
      { id: "3", name: "Service émetteur", required: false },
      { id: "4", name: "Mots-clés", required: false },
      { id: "5", name: "Budget", required: category.name.includes("financier") }
    ]);
    setIsDrawerOpen(true);
  };

  const toggleFieldRequired = (fieldId: string) => {
    setFormFields(formFields.map(field => 
      field.id === fieldId ? { ...field, required: !field.required } : field
    ));
    // Dans une vraie implémentation, on sauvegarderait ce changement en base
    toast.success("Champ mis à jour");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des catégories de documents</h2>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Nouvelle catégorie</span>
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
                <TableHead>Nom de la catégorie</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Aucune catégorie trouvée
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {category.description || "Aucune description"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{category.documentCount}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenDrawer(category)}
                          title="Configurer les champs"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenDialog(category)}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleOpenDeleteDialog(category)}
                          title="Supprimer"
                          disabled={category.documentCount > 0}
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

      {/* Dialogue de création/édition de catégorie */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Modifiez les informations de la catégorie ci-dessous."
                : "Remplissez les informations pour créer une nouvelle catégorie."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la catégorie</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom de la catégorie" />
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
                      <Textarea 
                        {...field} 
                        placeholder="Description de la catégorie"
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Décrivez brièvement l'usage et le contenu de cette catégorie
                    </FormDescription>
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
                  disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                >
                  {(createCategoryMutation.isPending || updateCategoryMutation.isPending) ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Enregistrement...
                    </>
                  ) : (
                    editingCategory ? "Mettre à jour" : "Créer la catégorie"
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
              Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.
              {deletingCategory && deletingCategory.documentCount > 0 && (
                <div className="mt-2 text-destructive">
                  Impossible de supprimer cette catégorie car elle contient des documents.
                  Veuillez d'abord supprimer ou déplacer les documents associés.
                </div>
              )}
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
              onClick={handleDeleteCategory}
              disabled={deleteCategoryMutation.isPending || (deletingCategory && deletingCategory.documentCount > 0)}
            >
              {deleteCategoryMutation.isPending ? (
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

      {/* Drawer pour la configuration des champs */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-4xl">
            <DrawerHeader>
              <DrawerTitle>Configuration des champs pour: {drawerCategory?.name}</DrawerTitle>
              <DrawerDescription>
                Configurez les champs requis pour cette catégorie de documents.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Champs de formulaire</h3>
                  <div className="space-y-3">
                    {formFields.map((field) => (
                      <div key={field.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{field.name}</span>
                          <Badge variant={field.required ? "default" : "outline"}>
                            {field.required ? "Requis" : "Optionnel"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`required-${field.id}`}
                            checked={field.required}
                            onCheckedChange={() => toggleFieldRequired(field.id)}
                          />
                          <Label htmlFor={`required-${field.id}`}>
                            {field.required ? "Requis" : "Optionnel"}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={() => setIsDrawerOpen(false)}>
                Fermer
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

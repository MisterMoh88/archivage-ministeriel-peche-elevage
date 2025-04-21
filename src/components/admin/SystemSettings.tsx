import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const generalSettingsSchema = z.object({
  systemName: z.string().min(2, "Le nom du système doit contenir au moins 2 caractères"),
  language: z.enum(["fr", "en"]),
  dateFormat: z.enum(["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]),
  timezone: z.string(),
  itemsPerPage: z.coerce.number().min(5).max(100),
});

const retentionSettingsSchema = z.object({
  defaultRetentionPeriod: z.coerce.number().min(1),
  notifyBeforeExpiration: z.boolean(),
  daysBeforeNotification: z.coerce.number().min(1),
  autoArchiveExpired: z.boolean(),
});

const featuresSettingsSchema = z.object({
  enableDownloads: z.boolean(),
  enablePrinting: z.boolean(),
  enableSharing: z.boolean(),
  enableVersioning: z.boolean(),
  enableAuditLog: z.boolean(),
  enableFullTextSearch: z.boolean(),
});

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
type RetentionSettingsValues = z.infer<typeof retentionSettingsSchema>;
type FeaturesSettingsValues = z.infer<typeof featuresSettingsSchema>;

export function SystemSettings() {
  const [accentColor, setAccentColor] = useState("blue");
  
  const generalForm = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      systemName: "Archives du Ministère de l'Élevage et de la Pêche",
      language: "fr",
      dateFormat: "DD/MM/YYYY",
      timezone: "Africa/Bamako",
      itemsPerPage: 20,
    },
  });

  const retentionForm = useForm<RetentionSettingsValues>({
    resolver: zodResolver(retentionSettingsSchema),
    defaultValues: {
      defaultRetentionPeriod: 5,
      notifyBeforeExpiration: true,
      daysBeforeNotification: 30,
      autoArchiveExpired: false,
    },
  });

  const featuresForm = useForm<FeaturesSettingsValues>({
    resolver: zodResolver(featuresSettingsSchema),
    defaultValues: {
      enableDownloads: true,
      enablePrinting: true,
      enableSharing: true,
      enableVersioning: true,
      enableAuditLog: true,
      enableFullTextSearch: true,
    },
  });

  const onGeneralSubmit = (data: GeneralSettingsValues) => {
    console.log("Paramètres généraux mis à jour:", data);
    toast.success("Paramètres généraux mis à jour avec succès");
  };

  const onRetentionSubmit = (data: RetentionSettingsValues) => {
    console.log("Paramètres de conservation mis à jour:", data);
    toast.success("Paramètres de conservation mis à jour avec succès");
  };

  const onFeaturesSubmit = (data: FeaturesSettingsValues) => {
    console.log("Paramètres de fonctionnalités mis à jour:", data);
    toast.success("Paramètres de fonctionnalités mis à jour avec succès");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Paramètres du système</h2>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="retention">Conservation</TabsTrigger>
          <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres généraux du système d'archives.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
                  <FormField
                    control={generalForm.control}
                    name="systemName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du système</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Ce nom apparaîtra dans l'en-tête et les rapports.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={generalForm.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Langue</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une langue" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="en">Anglais</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Langue principale de l'interface utilisateur.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="dateFormat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Format de date</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un format" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="DD/MM/YYYY">JJ/MM/AAAA</SelectItem>
                              <SelectItem value="MM/DD/YYYY">MM/JJ/AAAA</SelectItem>
                              <SelectItem value="YYYY-MM-DD">AAAA-MM-JJ</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Format d'affichage des dates dans l'application.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={generalForm.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fuseau horaire</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un fuseau horaire" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Africa/Bamako">Bamako (GMT+0)</SelectItem>
                              <SelectItem value="Europe/Paris">Paris (GMT+1/+2)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Fuseau horaire utilisé pour l'horodatage.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="itemsPerPage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Éléments par page</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Nombre d'éléments à afficher par page dans les listes.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Enregistrer les modifications</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="retention">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de conservation des archives</CardTitle>
              <CardDescription>
                Configurez les règles de conservation et de gestion du cycle de vie des documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...retentionForm}>
                <form onSubmit={retentionForm.handleSubmit(onRetentionSubmit)} className="space-y-6">
                  <FormField
                    control={retentionForm.control}
                    name="defaultRetentionPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Période de conservation par défaut (années)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Durée par défaut pendant laquelle les documents sont conservés avant archivage.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={retentionForm.control}
                    name="notifyBeforeExpiration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Notification d'expiration</FormLabel>
                          <FormDescription>
                            Envoyer des notifications avant l'expiration des documents
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {retentionForm.watch("notifyBeforeExpiration") && (
                    <FormField
                      control={retentionForm.control}
                      name="daysBeforeNotification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jours avant notification</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Nombre de jours avant l'expiration pour envoyer une notification.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={retentionForm.control}
                    name="autoArchiveExpired"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Archivage automatique</FormLabel>
                          <FormDescription>
                            Archiver automatiquement les documents expirés
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Enregistrer les modifications</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités du système</CardTitle>
              <CardDescription>
                Activez ou désactivez les fonctionnalités du système d'archives.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...featuresForm}>
                <form onSubmit={featuresForm.handleSubmit(onFeaturesSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={featuresForm.control}
                      name="enableDownloads"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Téléchargements</FormLabel>
                            <FormDescription>
                              Permettre le téléchargement des documents
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={featuresForm.control}
                      name="enablePrinting"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Impression</FormLabel>
                            <FormDescription>
                              Permettre l'impression des documents
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={featuresForm.control}
                      name="enableSharing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Partage</FormLabel>
                            <FormDescription>
                              Permettre le partage des documents
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={featuresForm.control}
                      name="enableVersioning"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Versionnement</FormLabel>
                            <FormDescription>
                              Conserver l'historique des versions des documents
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={featuresForm.control}
                      name="enableAuditLog"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Journal d'audit</FormLabel>
                            <FormDescription>
                              Enregistrer toutes les actions sur les documents
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={featuresForm.control}
                      name="enableFullTextSearch"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Recherche plein texte</FormLabel>
                            <FormDescription>
                              Permettre la recherche dans le contenu des documents
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Enregistrer les modifications</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Personnalisation de l'apparence</CardTitle>
              <CardDescription>
                Modifiez l'aspect visuel de l'application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Thème et couleurs</h3>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Couleur d'accentuation</Label>
                      <RadioGroup
                        defaultValue={accentColor}
                        onValueChange={setAccentColor}
                        className="flex flex-wrap gap-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="blue"
                            id="blue"
                            className="border-ministry-blue"
                          />
                          <Label
                            htmlFor="blue"
                            className="cursor-pointer flex items-center gap-1"
                          >
                            <div className="w-4 h-4 rounded-full bg-ministry-blue"></div>
                            <span>Bleu (défaut)</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="green"
                            id="green"
                            className="border-green-600"
                          />
                          <Label
                            htmlFor="green"
                            className="cursor-pointer flex items-center gap-1"
                          >
                            <div className="w-4 h-4 rounded-full bg-green-600"></div>
                            <span>Vert</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="purple"
                            id="purple"
                            className="border-purple-600"
                          />
                          <Label
                            htmlFor="purple"
                            className="cursor-pointer flex items-center gap-1"
                          >
                            <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                            <span>Violet</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="amber"
                            id="amber"
                            className="border-amber-600"
                          />
                          <Label
                            htmlFor="amber"
                            className="cursor-pointer flex items-center gap-1"
                          >
                            <div className="w-4 h-4 rounded-full bg-amber-600"></div>
                            <span>Ambre</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Mode d'interface</Label>
                      <RadioGroup defaultValue="light">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="light" id="light-mode" />
                          <Label htmlFor="light-mode">Clair</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dark" id="dark-mode" />
                          <Label htmlFor="dark-mode">Sombre</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="system" id="system-mode" />
                          <Label htmlFor="system-mode">Système (automatique)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Logo du système</Label>
                      <div className="flex flex-col gap-2">
                        <div className="border rounded-lg p-4 flex items-center justify-center">
                          <img
                            src="/lovable-uploads/a0142a7c-c258-4bbc-bc33-eb26a36b0e8d.png"
                            alt="Logo actuel"
                            className="h-16 w-16"
                          />
                        </div>
                        <Button variant="outline" className="w-full">
                          Changer le logo
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Mise en page</Label>
                      <div className="flex items-center space-x-2">
                        <Switch id="compact-sidebar" defaultChecked />
                        <Label htmlFor="compact-sidebar">
                          Barre latérale compacte
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Aperçu</h3>
                <Separator />

                <div className="border rounded-lg p-4 bg-white dark:bg-gray-900">
                  <div className="text-center space-y-4">
                    <p>Prévisualisation des changements</p>
                    <div className="flex justify-center gap-4">
                      <Button>Bouton principal</Button>
                      <Button variant="outline">Bouton secondaire</Button>
                      <Button variant="destructive">Supprimer</Button>
                    </div>
                    <div className="flex justify-center gap-2 mt-2">
                      <Badge>Badge 1</Badge>
                      <Badge variant="outline">Badge 2</Badge>
                      <Badge variant="secondary">Badge 3</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Réinitialiser</Button>
              <Button onClick={() => toast.success("Paramètres d'apparence enregistrés")}>
                Enregistrer les modifications
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

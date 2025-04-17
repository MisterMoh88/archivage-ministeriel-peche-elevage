
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Users,
  FileText,
  Palette,
  LayoutDashboard,
  Shield,
  Activity,
  Plus,
  Edit,
  Trash,
  Check,
  X,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Badge } from "@/components/ui/badge";

export default function Admin() {
  // État pour le thème de l'application
  const [primaryColor, setPrimaryColor] = useState("blue");
  const [interfaceMode, setInterfaceMode] = useState("light");
  const [sidebarCompact, setSidebarCompact] = useState(false);

  // Données fictives pour les utilisateurs
  const users = [
    {
      id: 1,
      name: "Amadou Diallo",
      email: "a.diallo@elevage-peche.gouv.ml",
      role: "Administrateur",
      department: "Direction Générale",
      lastActive: "Aujourd'hui, 09:45",
      status: "Actif",
    },
    {
      id: 2,
      name: "Fatima Touré",
      email: "f.toure@elevage-peche.gouv.ml",
      role: "Archiviste",
      department: "Service Documentation",
      lastActive: "Aujourd'hui, 08:20",
      status: "Actif",
    },
    {
      id: 3,
      name: "Ibrahim Camara",
      email: "i.camara@elevage-peche.gouv.ml",
      role: "Utilisateur",
      department: "Direction de la Pêche",
      lastActive: "Hier, 16:33",
      status: "Actif",
    },
    {
      id: 4,
      name: "Aïssata Koné",
      email: "a.kone@elevage-peche.gouv.ml",
      role: "Archiviste",
      department: "Service Archives",
      lastActive: "15/04/2023, 11:05",
      status: "Inactif",
    },
    {
      id: 5,
      name: "Moussa Coulibaly",
      email: "m.coulibaly@elevage-peche.gouv.ml",
      role: "Utilisateur",
      department: "Direction de l'Élevage",
      lastActive: "14/04/2023, 14:22",
      status: "Actif",
    },
  ];

  // Données fictives pour les catégories de documents
  const documentCategories = [
    {
      id: 1,
      name: "Documents administratifs et réglementaires",
      documentCount: 578,
      requiredFields: ["Intitulé", "Référence", "Date", "Service émetteur"],
      status: "Actif",
    },
    {
      id: 2,
      name: "Documents techniques et spécialisés",
      documentCount: 342,
      requiredFields: ["Intitulé", "Référence", "Date", "Auteur", "Mots-clés"],
      status: "Actif",
    },
    {
      id: 3,
      name: "Documents financiers et comptables",
      documentCount: 289,
      requiredFields: [
        "Intitulé",
        "Référence",
        "Date",
        "Service émetteur",
        "Exercice",
      ],
      status: "Actif",
    },
    {
      id: 4,
      name: "Documents de communication et de sensibilisation",
      documentCount: 156,
      requiredFields: ["Intitulé", "Date", "Public cible", "Format"],
      status: "Actif",
    },
    {
      id: 5,
      name: "Archives et documentation historique",
      documentCount: 91,
      requiredFields: ["Intitulé", "Date", "Source", "Conservation"],
      status: "Actif",
    },
  ];

  return (
    <div className="page-container">
      <h1 className="section-title">Administration du système</h1>

      <Tabs defaultValue="interface" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:w-[800px]">
          <TabsTrigger value="interface" className="flex gap-2 items-center">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Interface</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex gap-2 items-center">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Catégories</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex gap-2 items-center">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex gap-2 items-center">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Tableau de bord</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex gap-2 items-center">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex gap-2 items-center">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Journaux</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Interface */}
        <TabsContent value="interface">
          <Card>
            <CardHeader>
              <CardTitle>Personnalisation de l'interface</CardTitle>
              <CardDescription>
                Modifiez l'apparence et le comportement de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Thème et couleurs</h3>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Couleur principale</Label>
                      <RadioGroup
                        defaultValue="blue"
                        onValueChange={setPrimaryColor}
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
                      <RadioGroup
                        defaultValue="light"
                        onValueChange={setInterfaceMode}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="light" id="light" />
                          <Label htmlFor="light">Clair</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dark" id="dark" />
                          <Label htmlFor="dark">Sombre</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="system" id="system" />
                          <Label htmlFor="system">Système (automatique)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Mise en page</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="compact-sidebar"
                          checked={sidebarCompact}
                          onCheckedChange={setSidebarCompact}
                        />
                        <Label htmlFor="compact-sidebar">
                          Barre latérale compacte
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Taille de police</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue placeholder="Taille de police" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Petite</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="large">Grande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Animations</Label>
                      <div className="flex items-center space-x-2">
                        <Switch id="animations" defaultChecked />
                        <Label htmlFor="animations">
                          Activer les animations
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
                    <p>Aperçu du thème actuel</p>
                    <div className="flex justify-center gap-4">
                      <Button>Bouton principal</Button>
                      <Button variant="outline">Bouton secondaire</Button>
                      <Button variant="destructive">Supprimer</Button>
                      <ThemeToggle />
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
              <Button>Enregistrer les modifications</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Onglet Catégories */}
        <TabsContent value="categories">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Gestion des catégories de documents</CardTitle>
                <CardDescription>
                  Gérez les catégories et leurs champs requis
                </CardDescription>
              </div>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Nouvelle catégorie</span>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom de la catégorie</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Champs requis</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>{category.documentCount}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {category.requiredFields.map((field, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            category.status === "Actif"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {category.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Utilisateurs */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>
                  Gérez les utilisateurs et leurs permissions
                </CardDescription>
              </div>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Nouvel utilisateur</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-64">
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    className="pl-8"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="archivist">Archiviste</SelectItem>
                    <SelectItem value="user">Utilisateur simple</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Dernière activité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "Administrateur"
                              ? "default"
                              : user.role === "Archiviste"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span
                            className={`h-2 w-2 rounded-full mr-2 ${
                              user.status === "Actif"
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          ></span>
                          {user.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglets Dashboard, Security, Logs (ajoutés de manière similaire) */}
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Configuration du tableau de bord</CardTitle>
              <CardDescription>
                Personnalisez les widgets et statistiques affichés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Check className="h-5 w-5 text-ministry-blue" />
                    Widgets actifs
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    {["Statistiques", "Activité récente", "Documents récents", "Utilisateurs actifs"].map(
                      (widget) => (
                        <div
                          key={widget}
                          className="flex items-center justify-between p-2 border rounded-md"
                        >
                          <span>{widget}</span>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Plus className="h-5 w-5 text-ministry-blue" />
                    Widgets disponibles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      "Calendrier des échéances",
                      "Rapports personnalisés",
                      "Graphiques analytiques",
                      "Alertes système",
                    ].map((widget) => (
                      <div
                        key={widget}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <span>{widget}</span>
                        <Button variant="outline" size="sm">
                          Ajouter
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Réinitialiser</Button>
              <Button>Enregistrer la configuration</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

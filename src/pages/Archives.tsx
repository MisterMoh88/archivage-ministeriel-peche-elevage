
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Archive,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Filter,
  MoreVertical,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Archives() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");

  // Données fictives pour la démonstration
  const documents = [
    {
      id: "DOC-2023-0001",
      title: "Arrêté ministériel N°2023-1567",
      category: "Documents administratifs",
      type: "Arrêté",
      date: "23/04/2023",
      source: "Cabinet du Ministre",
      reference: "ARR-2023-1567",
      fileType: "PDF",
      fileSize: "2.4 MB",
      author: "Amadou Diallo",
    },
    {
      id: "DOC-2023-0002",
      title: "Rapport d'étude sur l'aquaculture au Mali",
      category: "Documents techniques",
      type: "Rapport",
      date: "15/04/2023",
      source: "Direction Nationale de la Pêche",
      reference: "RAP-2023-0089",
      fileType: "PDF",
      fileSize: "8.7 MB",
      author: "Dr. Moussa Coulibaly",
    },
    {
      id: "DOC-2023-0003",
      title: "Budget prévisionnel 2024 - Secteur Élevage",
      category: "Documents financiers",
      type: "Budget",
      date: "10/04/2023",
      source: "Direction Administrative et Financière",
      reference: "BUD-2024-0001",
      fileType: "XLSX",
      fileSize: "1.2 MB",
      author: "Fatima Touré",
    },
    {
      id: "DOC-2023-0004",
      title: "Campagne de vaccination du bétail 2023",
      category: "Documents de communication",
      type: "Brochure",
      date: "05/04/2023",
      source: "Service Communication",
      reference: "COM-2023-0045",
      fileType: "PDF",
      fileSize: "4.5 MB",
      author: "Ibrahim Camara",
    },
    {
      id: "DOC-2023-0005",
      title: "Correspondance historique - Création du Ministère (1995)",
      category: "Archives historiques",
      type: "Correspondance",
      date: "01/04/2023",
      source: "Archives Nationales",
      reference: "HIST-1995-0012",
      fileType: "PDF",
      fileSize: "3.1 MB",
      author: "Service des Archives",
    },
    {
      id: "DOC-2023-0006",
      title: "Contrat de fourniture d'équipements vétérinaires",
      category: "Documents financiers",
      type: "Marché public",
      date: "28/03/2023",
      source: "Direction des Marchés Publics",
      reference: "MP-2023-0078",
      fileType: "PDF",
      fileSize: "6.2 MB",
      author: "Amadou Keita",
      budgetProgram: "822/1.037",
      marketType: "AAO",
    },
  ];

  return (
    <div className="page-container">
      <h1 className="section-title">Archives documentaires</h1>

      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher dans les archives..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4 mr-1" />
                Filtrer
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Date</DropdownMenuItem>
              <DropdownMenuItem>Catégorie</DropdownMenuItem>
              <DropdownMenuItem>Type de document</DropdownMenuItem>
              <DropdownMenuItem>Service émetteur</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="administrative">Administratifs</TabsTrigger>
          <TabsTrigger value="technical">Techniques</TabsTrigger>
          <TabsTrigger value="financial">Financiers</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="historical">Historiques</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="rounded-md border">
            <div className="py-3 px-4 bg-muted/50 flex items-center justify-between">
              <h2 className="text-sm font-medium">Liste des documents ({documents.length})</h2>
              <div className="flex items-center gap-2">
                <Select defaultValue="newest">
                  <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Plus récents</SelectItem>
                    <SelectItem value="oldest">Plus anciens</SelectItem>
                    <SelectItem value="a-z">A-Z</SelectItem>
                    <SelectItem value="z-a">Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="divide-y">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 flex items-start gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="rounded-md bg-ministry-blue/10 p-2 mt-1">
                    <FileText className="h-6 w-6 text-ministry-blue" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{doc.title}</h3>
                      <span className="text-xs text-muted-foreground">
                        {doc.date}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline">{doc.category}</Badge>
                      <Badge variant="secondary">{doc.type}</Badge>
                      <span className="text-muted-foreground">
                        Réf: {doc.reference}
                      </span>
                      <span className="text-muted-foreground">
                        Source: {doc.source}
                      </span>
                    </div>
                    {doc.type === "Marché public" && (
                      <div className="bg-ministry-gold/10 p-2 rounded-md mt-2 text-xs">
                        <p>
                          <span className="font-medium">
                            Programme budgétaire:
                          </span>{" "}
                          {doc.budgetProgram}
                        </p>
                        <p>
                          <span className="font-medium">Type de marché:</span>{" "}
                          {doc.marketType}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Détails</DropdownMenuItem>
                        <DropdownMenuItem>Historique</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Les autres TabsContent seraient similaires à "all" mais avec filtrage */}
        <TabsContent value="administrative" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents administratifs et réglementaires</CardTitle>
              <CardDescription>
                Lois, décrets, arrêtés, décisions, notes de service, circulaires, procédures, 
                manuels, rapports d'activités, comptes rendus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="divide-y">
                  {documents
                    .filter((doc) => doc.category === "Documents administratifs")
                    .map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 flex items-start gap-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="rounded-md bg-ministry-blue/10 p-2 mt-1">
                          <FileText className="h-6 w-6 text-ministry-blue" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{doc.title}</h3>
                            <span className="text-xs text-muted-foreground">
                              {doc.date}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <Badge variant="outline">{doc.category}</Badge>
                            <Badge variant="secondary">{doc.type}</Badge>
                            <span className="text-muted-foreground">
                              Réf: {doc.reference}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Détails</DropdownMenuItem>
                              <DropdownMenuItem>Historique</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Modifier</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contenus similaires pour les autres onglets */}
      </Tabs>
    </div>
  );
}

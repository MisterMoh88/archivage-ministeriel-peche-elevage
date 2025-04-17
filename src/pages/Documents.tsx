
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FileText,
  Eye,
  Download,
  MoreVertical,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default function Documents() {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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
      budgetProgram: "822/1.037",
      marketType: "AAO",
    },
  ];

  // Fonction pour trier les documents
  const sortedDocuments = [...documents].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const direction = sortDirection === "asc" ? 1 : -1;
    
    if (sortColumn === "title") {
      return a.title.localeCompare(b.title) * direction;
    } else if (sortColumn === "date") {
      return new Date(a.date.split('/').reverse().join('-')).getTime() - 
             new Date(b.date.split('/').reverse().join('-')).getTime() * direction;
    } else if (sortColumn === "type") {
      return a.type.localeCompare(b.type) * direction;
    } else if (sortColumn === "reference") {
      return a.reference.localeCompare(b.reference) * direction;
    }
    
    return 0;
  });

  // Filtrage par catégorie
  const filteredDocuments = selectedCategory === "all" 
    ? sortedDocuments 
    : sortedDocuments.filter(doc => {
        const category = doc.category.toLowerCase().replace(/\s+/g, '-');
        return category === selectedCategory;
      });

  // Fonction pour gérer le tri
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="page-container">
      <h1 className="section-title">Documents</h1>

      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des documents..."
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4 mr-1" />
                Filtrer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Date</DropdownMenuItem>
              <DropdownMenuItem>Type de document</DropdownMenuItem>
              <DropdownMenuItem>Service émetteur</DropdownMenuItem>
              <DropdownMenuItem>Format de fichier</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs 
        defaultValue="all" 
        className="space-y-4"
        value={selectedCategory}
        onValueChange={setSelectedCategory}
      >
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="documents-administratifs">Administratifs</TabsTrigger>
          <TabsTrigger value="documents-techniques">Techniques</TabsTrigger>
          <TabsTrigger value="documents-financiers">Financiers</TabsTrigger>
          <TabsTrigger value="documents-de-communication">Communication</TabsTrigger>
          <TabsTrigger value="archives-historiques">Historiques</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">
                Liste des documents ({filteredDocuments.length})
              </CardTitle>
              <CardDescription>
                Consultez et gérez les documents archivés
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]">
                      <Checkbox />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center gap-1">
                        Titre
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center gap-1">
                        Type
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("reference")}
                    >
                      <div className="flex items-center gap-1">
                        Référence
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium">{doc.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell>{doc.reference}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-ministry-blue" />
                          <span className="text-xs">{doc.fileType}</span>
                          <span className="text-xs text-muted-foreground">({doc.fileSize})</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

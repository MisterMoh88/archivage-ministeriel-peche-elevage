
import { useState, useEffect } from "react";
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
  FileImage,
  FileSpreadsheet,
  FileArchive,
  Eye,
  Download,
  MoreVertical,
  Search,
  Filter,
  ArrowUpDown,
  Loader2,
  File,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getDocuments, getDocumentCategories } from "@/services/documentService";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

// Interface pour les documents
interface Document {
  id: string;
  title: string;
  reference_number: string;
  document_date: string;
  document_type: string;
  file_path: string;
  file_type: string;
  file_size: number;
  document_categories: {
    name: string;
    description: string;
  };
  category_id: string;
}

export default function Documents() {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  // Récupération des documents
  const { data: documents, isLoading, error, refetch } = useQuery({
    queryKey: ["documents"],
    queryFn: getDocuments,
  });

  // Récupération des catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getDocumentCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fonction pour obtenir l'icône de fichier en fonction du type
  const getFileIcon = (fileType: string) => {
    const type = fileType?.toLowerCase() || "";
    if (type.includes("pdf")) return <File className="h-4 w-4 text-ministry-blue" />;
    if (type.includes("image") || type.includes("jpg") || type.includes("png")) 
      return <FileImage className="h-4 w-4 text-ministry-blue" />;
    if (type.includes("sheet") || type.includes("excel") || type.includes("xlsx")) 
      return <FileSpreadsheet className="h-4 w-4 text-ministry-blue" />;
    if (type.includes("zip") || type.includes("rar")) 
      return <FileArchive className="h-4 w-4 text-ministry-blue" />;
    return <FileText className="h-4 w-4 text-ministry-blue" />;
  };

  // Formatage de la taille du fichier
  const formatFileSize = (bytes: number) => {
    if (!bytes) return "N/A";
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Formatage de la date
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      return dateString || "N/A";
    }
  };

  // Téléchargement du document
  const handleDownload = async (filePath: string, title: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(filePath);
      
      if (error) {
        throw error;
      }
      
      // Créer un URL pour le fichier téléchargé
      const url = URL.createObjectURL(data);
      
      // Créer un lien temporaire pour le téléchargement
      const link = document.createElement('a');
      link.href = url;
      link.download = title || 'document';
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success("Document téléchargé avec succès");
    } catch (error) {
      console.error("Erreur de téléchargement:", error);
      toast.error("Erreur lors du téléchargement du document");
    }
  };

  // Fonction pour la prévisualisation des documents
  const handlePreview = async (filePath: string) => {
    try {
      const { data } = await supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      if (!data || !data.publicUrl) {
        throw new Error("Impossible d'obtenir l'URL publique");
      }
      
      // Ouvrir l'URL dans un nouvel onglet
      window.open(data.publicUrl, '_blank');
    } catch (error) {
      console.error("Erreur de prévisualisation:", error);
      toast.error("Erreur lors de la prévisualisation du document");
    }
  };

  // Filtrer et trier les documents
  const filteredAndSortedDocuments = () => {
    if (!documents) return [];
    
    let filtered = [...documents];
    
    // Filtrage par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.reference_number.toLowerCase().includes(query) ||
        doc.document_type.toLowerCase().includes(query)
      );
    }
    
    // Filtrage par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter(doc => doc.category_id === selectedCategory);
    }
    
    // Tri des documents
    if (sortColumn) {
      filtered.sort((a, b) => {
        const direction = sortDirection === "asc" ? 1 : -1;
        
        switch (sortColumn) {
          case "title":
            return a.title.localeCompare(b.title) * direction;
          case "date":
            return new Date(a.document_date).getTime() - 
                  new Date(b.document_date).getTime() * direction;
          case "type":
            return a.document_type.localeCompare(b.document_type) * direction;
          case "reference":
            return a.reference_number.localeCompare(b.reference_number) * direction;
          default:
            return 0;
        }
      });
    }
    
    return filtered;
  };

  // Gérer le tri
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  if (error) {
    return (
      <div className="page-container">
        <div className="text-center py-10">
          <h2 className="text-xl text-destructive mb-2">
            Erreur lors du chargement des documents
          </h2>
          <p className="text-muted-foreground mb-4">
            Une erreur est survenue lors de la récupération des documents.
          </p>
          <Button onClick={() => refetch()}>Réessayer</Button>
        </div>
      </div>
    );
  }

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
          {categories.map(category => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">
                Liste des documents ({isLoading ? '...' : filteredAndSortedDocuments().length})
              </CardTitle>
              <CardDescription>
                Consultez et gérez les documents archivés
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center p-10">
                  <Loader2 className="h-8 w-8 animate-spin text-ministry-blue" />
                  <span className="ml-2">Chargement des documents...</span>
                </div>
              ) : (
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
                    {filteredAndSortedDocuments().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10">
                          <p className="text-muted-foreground">Aucun document trouvé</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAndSortedDocuments().map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-medium">{doc.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{doc.document_categories?.name || "Non catégorisé"}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{doc.document_type}</Badge>
                          </TableCell>
                          <TableCell>{formatDate(doc.document_date)}</TableCell>
                          <TableCell>{doc.reference_number}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getFileIcon(doc.file_type)}
                              <span className="text-xs">{doc.file_type?.split('/')[1]?.toUpperCase() || "DOC"}</span>
                              <span className="text-xs text-muted-foreground">({formatFileSize(doc.file_size)})</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handlePreview(doc.file_path)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDownload(doc.file_path, doc.title)}
                              >
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
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

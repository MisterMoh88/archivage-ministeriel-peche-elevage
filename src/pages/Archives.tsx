
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronDown,
  Download,
  Eye,
  Filter,
  MoreVertical,
  Search,
  SlidersHorizontal,
  FileText,
  FilePen,
  Trash2,
  History
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getDocuments, getDocumentCategories } from "@/services/documentService";
import { formatDate, formatFileSize, getFileIcon, handleDownload } from "@/utils/documentUtils";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import { DocumentEditForm } from "@/components/documents/DocumentEditForm";
import { DocumentDeleteConfirm } from "@/components/documents/DocumentDeleteConfirm";

export default function Archives() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("newest");
  
  // States for document actions
  const [viewDocument, setViewDocument] = useState<any>(null);
  const [editDocument, setEditDocument] = useState<any>(null);
  const [deleteDocument, setDeleteDocument] = useState<any>(null);

  // Fetch documents and categories
  const { data: documents, isLoading, error, refetch } = useQuery({
    queryKey: ["archives-documents"],
    queryFn: getDocuments,
  });

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

  // Filter and sort documents
  const filteredAndSortedDocuments = () => {
    if (!documents) return [];
    
    let filtered = [...documents];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.reference_number.toLowerCase().includes(query) ||
        doc.document_type.toLowerCase().includes(query) ||
        (doc.issuing_department && doc.issuing_department.toLowerCase().includes(query))
      );
    }
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(doc => doc.category_id === selectedCategory);
    }
    
    // Sort documents
    switch (selectedSort) {
      case "newest":
        filtered.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime());
        break;
      case "a-z":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    
    return filtered;
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Non catégorisé";
  };

  const handleDocumentChange = () => {
    refetch();
  };
  
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
          <div className="rounded-md border">
            <div className="py-3 px-4 bg-muted/50 flex items-center justify-between">
              <h2 className="text-sm font-medium">
                Liste des documents ({filteredAndSortedDocuments().length})
              </h2>
              <div className="flex items-center gap-2">
                <Select 
                  defaultValue="newest"
                  value={selectedSort}
                  onValueChange={setSelectedSort}
                >
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
              {isLoading ? (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">Chargement des documents...</p>
                </div>
              ) : filteredAndSortedDocuments().length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">Aucun document trouvé</p>
                </div>
              ) : (
                filteredAndSortedDocuments().map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 flex items-start gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="rounded-md bg-ministry-blue/10 p-2 mt-1">
                      {getFileIcon(doc.file_type) || <FileText className="h-6 w-6 text-ministry-blue" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{doc.title}</h3>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(doc.document_date)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant="outline">{getCategoryName(doc.category_id)}</Badge>
                        <Badge variant="secondary">{doc.document_type}</Badge>
                        <span className="text-muted-foreground">
                          Réf: {doc.reference_number}
                        </span>
                        {doc.issuing_department && (
                          <span className="text-muted-foreground">
                            Source: {doc.issuing_department}
                          </span>
                        )}
                      </div>
                      {doc.budget_program && (
                        <div className="bg-ministry-gold/10 p-2 rounded-md mt-2 text-xs">
                          {doc.budget_year && (
                            <p>
                              <span className="font-medium">
                                Année budgétaire:
                              </span>{" "}
                              {doc.budget_year}
                            </p>
                          )}
                          <p>
                            <span className="font-medium">
                              Programme budgétaire:
                            </span>{" "}
                            {doc.budget_program}
                          </p>
                          {doc.market_type && (
                            <p>
                              <span className="font-medium">Type de marché:</span>{" "}
                              {doc.market_type}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setViewDocument(doc)}
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
                          <DropdownMenuItem onClick={() => setViewDocument(doc)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Détails
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditDocument(doc)}>
                            <FilePen className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteDocument(doc)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Document details viewer */}
      <DocumentViewer 
        document={viewDocument}
        isOpen={!!viewDocument}
        onClose={() => setViewDocument(null)}
      />

      {/* Document edit form */}
      <DocumentEditForm 
        document={editDocument}
        isOpen={!!editDocument}
        onClose={() => setEditDocument(null)}
        onSuccess={handleDocumentChange}
        categories={categories}
      />

      {/* Document delete confirmation */}
      {deleteDocument && (
        <DocumentDeleteConfirm 
          documentId={deleteDocument.id}
          documentTitle={deleteDocument.title}
          isOpen={!!deleteDocument}
          onClose={() => setDeleteDocument(null)}
          onSuccess={handleDocumentChange}
        />
      )}
    </div>
  );
}

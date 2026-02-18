
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Search as SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "@/services/documents/crudService";
import { getDocumentCategories } from "@/services/documents/categoryService";
import { useSecureDocumentFilters } from "@/hooks/useSecureDocumentFilters";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import { Document } from "@/types/document";
import { formatDate } from "@/utils/documentUtils";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [viewDocument, setViewDocument] = useState<Document | null>(null);

  // Fetch documents - always loaded so search is instant
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["search-documents"],
    queryFn: getDocuments,
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["document-categories"],
    queryFn: getDocumentCategories,
  });

  // Apply filters to documents
  const filteredDocuments = useSecureDocumentFilters({
    documents,
    searchQuery,
    selectedCategory: selectedCategory || "all",
    selectedSort: "newest",
  });

  // Additional filtering based on date range
  const searchResults = filteredDocuments.filter(doc => {
    if (dateFrom && doc.document_date < dateFrom) return false;
    if (dateTo && doc.document_date > dateTo) return false;
    return true;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Non catégorisé";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPerformed(true);
  };

  return (
    <div className="page-container">
      <h1 className="section-title">Recherche multicritères</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 border-ministry-blue/20">
          <CardHeader>
            <CardTitle>Critères de recherche</CardTitle>
            <CardDescription>
              Affinez votre recherche avec plusieurs critères
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="search-query">Mots-clés</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search-query"
                    placeholder="Rechercher..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="category">Catégorie</Label>
                <Select 
                  onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
                  value={selectedCategory || "all"}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Période</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="date-from" className="text-xs">
                      Du
                    </Label>
                    <Input
                      id="date-from"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date-to" className="text-xs">
                      Au
                    </Label>
                    <Input
                      id="date-to"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Options avancées</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="market-only" />
                    <Label
                      htmlFor="market-only"
                      className="text-sm font-normal"
                    >
                      Uniquement les marchés publics
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="budget-program" />
                    <Label
                      htmlFor="budget-program"
                      className="text-sm font-normal"
                    >
                      Par programme budgétaire
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="full-text" />
                    <Label htmlFor="full-text" className="text-sm font-normal">
                      Recherche en texte intégral
                    </Label>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Rechercher
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-ministry-blue/20">
          <CardHeader>
            <CardTitle>Résultats de recherche</CardTitle>
            <CardDescription>
              {searchPerformed
                ? `${searchResults.length} documents trouvés`
                : "Utilisez les critères à gauche pour lancer une recherche"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!searchPerformed ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <SearchIcon className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-1">
                  Aucune recherche effectuée
                </h3>
                <p className="text-sm">
                  Spécifiez vos critères et lancez une recherche pour voir les
                  résultats
                </p>
              </div>
            ) : documentsLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-muted-foreground">Recherche en cours...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-1">
                  Aucun document trouvé
                </h3>
                <p className="text-sm">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex gap-4 p-4 border rounded-lg hover:bg-muted/20 transition-colors"
                  >
                    <div className="rounded-md bg-ministry-blue/10 p-2 mt-1">
                      <FileText className="h-6 w-6 text-ministry-blue" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{result.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs">
                        <Badge variant="secondary">{result.document_type}</Badge>
                        <span className="text-muted-foreground">
                          {formatDate(result.document_date)}
                        </span>
                        <span className="text-muted-foreground">
                          Réf: {result.reference_number}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {getCategoryName(result.category_id)} • {result.issuing_department || "Département non spécifié"}
                      </p>
                      {result.budget_program && (
                        <div className="bg-ministry-gold/10 p-2 rounded-md mt-2 text-xs">
                          <p>
                            <span className="font-medium">
                              Programme budgétaire:
                            </span>{" "}
                            {result.budget_program}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setViewDocument(result)}
                      >
                        Consulter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Document viewer */}
      {viewDocument && (
        <DocumentViewer 
          document={viewDocument}
          isOpen={!!viewDocument}
          onClose={() => setViewDocument(null)}
        />
      )}
    </div>
  );
}

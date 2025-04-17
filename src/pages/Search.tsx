
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

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Catégories de documents
  const categories = [
    "Documents administratifs et réglementaires",
    "Documents techniques et spécialisés",
    "Documents financiers et comptables",
    "Documents de communication et de sensibilisation",
    "Archives et documentation historique",
  ];

  // Données fictives pour démontrer la recherche
  const searchResults = [
    {
      id: "DOC-2023-0001",
      title: "Arrêté ministériel N°2023-1567",
      category: "Documents administratifs et réglementaires",
      type: "Arrêté",
      date: "23/04/2023",
      source: "Cabinet du Ministre",
      reference: "ARR-2023-1567",
      relevance: 98,
    },
    {
      id: "DOC-2023-0006",
      title: "Contrat de fourniture d'équipements vétérinaires",
      category: "Documents financiers et comptables",
      type: "Marché public",
      date: "28/03/2023",
      source: "Direction des Marchés Publics",
      reference: "MP-2023-0078",
      relevance: 85,
      budgetProgram: "822/1.037",
    },
    {
      id: "DOC-2022-0128",
      title: "Procédure d'inspection sanitaire des produits de la pêche",
      category: "Documents techniques et spécialisés",
      type: "Procédure",
      date: "15/11/2022",
      source: "Direction Nationale de la Pêche",
      reference: "PROC-2022-0034",
      relevance: 72,
    },
    {
      id: "DOC-2022-0097",
      title: "Rapport d'étude sur les maladies bovines - Région de Sikasso",
      category: "Documents techniques et spécialisés",
      type: "Rapport",
      date: "03/09/2022",
      source: "Direction Nationale des Services Vétérinaires",
      reference: "RAP-2022-0097",
      relevance: 65,
    },
    {
      id: "DOC-2022-0015",
      title: "Budget du programme d'appui à l'élevage bovin",
      category: "Documents financiers et comptables",
      type: "Budget",
      date: "15/01/2022",
      source: "Direction Administrative et Financière",
      reference: "BUD-2022-0015",
      relevance: 60,
      budgetProgram: "822/2.090",
    },
  ];

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
                  onValueChange={(value) => setSelectedCategory(value)}
                  value={selectedCategory || ""}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
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
                        <Badge variant="outline" className="ml-2">
                          {result.relevance}%
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs">
                        <Badge variant="secondary">{result.type}</Badge>
                        <span className="text-muted-foreground">
                          {result.date}
                        </span>
                        <span className="text-muted-foreground">
                          Réf: {result.reference}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {result.category} • {result.source}
                      </p>
                      {result.budgetProgram && (
                        <div className="bg-ministry-gold/10 p-2 rounded-md mt-2 text-xs">
                          <p>
                            <span className="font-medium">
                              Programme budgétaire:
                            </span>{" "}
                            {result.budgetProgram}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
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
    </div>
  );
}

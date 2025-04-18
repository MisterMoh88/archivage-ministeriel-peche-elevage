
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Filter, Search, SlidersHorizontal, ChevronDown } from "lucide-react";

interface ArchivesSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const ArchivesSearchBar = ({ searchQuery, onSearchChange }: ArchivesSearchBarProps) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher dans les archives..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
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
  );
};

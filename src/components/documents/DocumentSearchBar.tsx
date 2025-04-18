
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const DocumentSearchBar = ({
  searchQuery,
  onSearchChange,
}: DocumentSearchBarProps) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher des documents..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
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
  );
};

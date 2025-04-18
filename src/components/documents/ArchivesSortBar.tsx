
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ArchivesSortBarProps {
  documentCount: number;
  selectedSort: string;
  onSortChange: (value: string) => void;
}

export const ArchivesSortBar = ({ documentCount, selectedSort, onSortChange }: ArchivesSortBarProps) => {
  return (
    <div className="py-3 px-4 bg-muted/50 flex items-center justify-between">
      <h2 className="text-sm font-medium">
        Liste des documents ({documentCount})
      </h2>
      <div className="flex items-center gap-2">
        <Select 
          value={selectedSort}
          onValueChange={onSortChange}
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
  );
};

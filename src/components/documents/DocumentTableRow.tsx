
import { Document } from "@/types/document";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Download, MoreVertical } from "lucide-react";
import { formatDate, formatFileSize, getFileIcon, handleDownload, handlePreview } from "@/utils/documentUtils";

interface DocumentTableRowProps {
  document: Document;
}

export const DocumentTableRow = ({ document }: DocumentTableRowProps) => {
  return (
    <TableRow key={document.id}>
      <TableCell>
        <Checkbox />
      </TableCell>
      <TableCell className="font-medium">{document.title}</TableCell>
      <TableCell>
        <Badge variant="outline">{document.document_categories?.name || "Non catégorisé"}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{document.document_type}</Badge>
      </TableCell>
      <TableCell>{formatDate(document.document_date)}</TableCell>
      <TableCell>{document.reference_number}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {getFileIcon(document.file_type)}
          <span className="text-xs">{document.file_type?.split('/')[1]?.toUpperCase() || "DOC"}</span>
          <span className="text-xs text-muted-foreground">({formatFileSize(document.file_size)})</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handlePreview(document.file_path)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleDownload(document.file_path, document.title)}
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
  );
};

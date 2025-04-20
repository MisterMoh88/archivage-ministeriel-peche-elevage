
import { User, Eye, UserCog, MoreVertical, ShieldCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserData {
  id: string;
  full_name: string | null;
  department: string | null;
  phone: string | null;
  role: "admin" | "archiviste" | "utilisateur";
  status: string | null;
  last_active: string | null;
}

interface UserTableProps {
  users: UserData[];
  isLoading: boolean;
}

export function UserTable({ users, isLoading }: UserTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Département</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Dernière activité</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                Chargement...
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                Aucun utilisateur trouvé
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-ministry-blue/10 p-2">
                      <User className="h-5 w-5 text-ministry-blue" />
                    </div>
                    <div>
                      <div className="font-medium">{user.full_name}</div>
                      <div className="text-sm text-muted-foreground">{user.department}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "admin"
                        ? "default"
                        : user.role === "archiviste"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {user.phone || "Non renseigné"}
                  </div>
                </TableCell>
                <TableCell>
                  {user.last_active ? new Date(user.last_active).toLocaleString() : "Jamais"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span
                      className={`mr-2 h-2 w-2 rounded-full ${
                        user.status === "Actif" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>
                    {user.status}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <UserCog className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir profil</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          <span>Changer les permissions</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive flex items-center gap-2">
                          <UserX className="h-4 w-4" />
                          <span>Désactiver</span>
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
    </div>
  );
}

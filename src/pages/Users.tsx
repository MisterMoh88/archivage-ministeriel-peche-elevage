
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  Search,
  MoreVertical,
  Plus,
  UserPlus,
  Filter,
  Mail,
  Phone,
  ShieldCheck,
  UserX,
  Eye,
  UserCog,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");

  // Données fictives pour la démonstration
  const users = [
    {
      id: 1,
      name: "Amadou Diallo",
      email: "a.diallo@elevage-peche.gouv.ml",
      role: "Administrateur",
      department: "Direction Générale",
      phone: "+223 76 12 34 56",
      lastActive: "Aujourd'hui, 09:45",
      status: "Actif",
    },
    {
      id: 2,
      name: "Fatima Touré",
      email: "f.toure@elevage-peche.gouv.ml",
      role: "Archiviste",
      department: "Service Documentation",
      phone: "+223 76 23 45 67",
      lastActive: "Aujourd'hui, 08:20",
      status: "Actif",
    },
    {
      id: 3,
      name: "Ibrahim Camara",
      email: "i.camara@elevage-peche.gouv.ml",
      role: "Utilisateur",
      department: "Direction de la Pêche",
      phone: "+223 76 34 56 78",
      lastActive: "Hier, 16:33",
      status: "Actif",
    },
    {
      id: 4,
      name: "Aïssata Koné",
      email: "a.kone@elevage-peche.gouv.ml",
      role: "Archiviste",
      department: "Service Archives",
      phone: "+223 76 45 67 89",
      lastActive: "15/04/2023, 11:05",
      status: "Inactif",
    },
    {
      id: 5,
      name: "Moussa Coulibaly",
      email: "m.coulibaly@elevage-peche.gouv.ml",
      role: "Utilisateur",
      department: "Direction de l'Élevage",
      phone: "+223 76 56 78 90",
      lastActive: "14/04/2023, 14:22",
      status: "Actif",
    },
    {
      id: 6,
      name: "Fatoumata Sidibé",
      email: "f.sidibe@elevage-peche.gouv.ml",
      role: "Utilisateur",
      department: "Service Administratif",
      phone: "+223 76 67 89 01",
      lastActive: "12/04/2023, 10:15",
      status: "Actif",
    },
    {
      id: 7,
      name: "Oumar Konaté",
      email: "o.konate@elevage-peche.gouv.ml",
      role: "Administrateur",
      department: "Service Informatique",
      phone: "+223 76 78 90 12",
      lastActive: "10/04/2023, 16:40",
      status: "Actif",
    },
  ];

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="section-title mb-0">Gestion des utilisateurs</h1>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span>Nouvel utilisateur</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            Gérez les utilisateurs du système d'archivage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Filtrer par rôle</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Tous les rôles</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Administrateurs</DropdownMenuItem>
                  <DropdownMenuItem>Archivistes</DropdownMenuItem>
                  <DropdownMenuItem>Utilisateurs</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

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
                {users
                  .filter(
                    (user) =>
                      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      user.department.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-ministry-blue/10 p-2">
                            <User className="h-5 w-5 text-ministry-blue" />
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "Administrateur"
                              ? "default"
                              : user.role === "Archiviste"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>Email</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{user.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.lastActive}</TableCell>
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
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

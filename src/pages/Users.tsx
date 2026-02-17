
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserPlus, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { UserTable } from "@/components/users/UserTable";
import { supabase } from "@/integrations/supabase/client";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*');
      return data || [];
    }
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

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
                  <DropdownMenuItem onClick={() => setRoleFilter(null)}>
                    Tous les rôles
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setRoleFilter('admin')}>
                    Super Administrateurs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('admin_local')}>
                    Admin Département
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('archiviste')}>
                    Archivistes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('auditeur')}>
                    Auditeurs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('utilisateur')}>
                    Utilisateurs
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <UserTable users={filteredUsers} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}

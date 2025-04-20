
import { FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
  id: string;
  action_type: string;
  documents: { title: string };
  profiles: { full_name: string };
  performed_at: string;
}

interface RecentActivityProps {
  activities: Activity[];
  isLoading: boolean;
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
        <CardDescription>
          Les 5 dernières actions effectuées dans le système
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p>Chargement...</p>
          ) : activities.map((item) => (
            <div key={item.id} className="flex items-start gap-4 rounded-lg border p-3">
              <div className="rounded-full p-2 bg-ministry-blue/10">
                <FileText className="h-4 w-4 text-ministry-blue" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {item.action_type}: {item.documents.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Par {item.profiles.full_name} • {new Date(item.performed_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Save, RotateCcw } from "lucide-react";

export function DashboardSettings() {
  const [settings, setSettings] = useState({
    showWelcomeMessage: true,
    autoRefreshInterval: 5,
    showRecentDocuments: true,
    documentsLimit: 10,
    showStatistics: true,
    enableQuickActions: true,
    defaultTimeRange: "30",
  });

  const handleSave = () => {
    // Ici on sauvegarderait les paramètres en base
    toast.success("Paramètres du tableau de bord sauvegardés");
  };

  const handleReset = () => {
    setSettings({
      showWelcomeMessage: true,
      autoRefreshInterval: 5,
      showRecentDocuments: true,
      documentsLimit: 10,
      showStatistics: true,
      enableQuickActions: true,
      defaultTimeRange: "30",
    });
    toast.info("Paramètres remis par défaut");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration du tableau de bord</CardTitle>
          <CardDescription>
            Personnalisez l'apparence et le comportement du tableau de bord principal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Message de bienvenue</Label>
              <p className="text-sm text-muted-foreground">
                Afficher un message de bienvenue sur le tableau de bord
              </p>
            </div>
            <Switch
              checked={settings.showWelcomeMessage}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, showWelcomeMessage: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Documents récents</Label>
              <p className="text-sm text-muted-foreground">
                Afficher la liste des documents récents
              </p>
            </div>
            <Switch
              checked={settings.showRecentDocuments}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, showRecentDocuments: checked })
              }
            />
          </div>

          {settings.showRecentDocuments && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="documentsLimit">Nombre de documents à afficher</Label>
              <Input
                id="documentsLimit"
                type="number"
                min="5"
                max="50"
                value={settings.documentsLimit}
                onChange={(e) =>
                  setSettings({ ...settings, documentsLimit: parseInt(e.target.value) })
                }
                className="w-24"
              />
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Statistiques</Label>
              <p className="text-sm text-muted-foreground">
                Afficher les cartes de statistiques
              </p>
            </div>
            <Switch
              checked={settings.showStatistics}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, showStatistics: checked })
              }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="autoRefresh">Actualisation automatique (minutes)</Label>
            <Input
              id="autoRefresh"
              type="number"
              min="1"
              max="60"
              value={settings.autoRefreshInterval}
              onChange={(e) =>
                setSettings({ ...settings, autoRefreshInterval: parseInt(e.target.value) })
              }
              className="w-24"
            />
            <p className="text-sm text-muted-foreground">
              0 pour désactiver l'actualisation automatique
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Sauvegarder
            </Button>
            <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Remettre par défaut
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Settings, 
  Save, 
  Database, 
  Server, 
  AlertTriangle, 
  RotateCcw,
  HardDrive,
  Zap
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function AdvancedSettings() {
  const [settings, setSettings] = useState({
    maxFileSize: 50, // MB
    allowedFileTypes: "pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,png",
    storageQuota: 1000, // GB
    backupInterval: 24, // heures
    enableAutoBackup: true,
    debugMode: false,
    maintenanceMode: false,
    customCSS: "",
    emailNotifications: true,
    systemEmail: "admin@archives-mep.ml",
  });

  const [systemInfo] = useState({
    version: "1.2.3",
    dbSize: "2.4 GB",
    storageUsed: "156 GB",
    uptime: "15 jours, 8 heures",
    lastBackup: "2025-06-15 02:00:00",
  });

  const handleSave = () => {
    toast.success("Paramètres avancés sauvegardés");
  };

  const handleMaintenanceToggle = (enabled: boolean) => {
    setSettings({ ...settings, maintenanceMode: enabled });
    if (enabled) {
      toast.warning("Mode maintenance activé - Les utilisateurs ne pourront plus accéder au système");
    } else {
      toast.success("Mode maintenance désactivé");
    }
  };

  const handleBackupNow = () => {
    toast.info("Sauvegarde manuelle lancée...");
    // Logique de sauvegarde
  };

  const handleClearCache = () => {
    toast.success("Cache système vidé");
  };

  const handleReindexDatabase = () => {
    toast.info("Réindexation de la base de données en cours...");
  };

  return (
    <div className="space-y-6">
      {/* Informations système */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Informations système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{systemInfo.version}</div>
              <div className="text-sm text-muted-foreground">Version</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{systemInfo.dbSize}</div>
              <div className="text-sm text-muted-foreground">Base de données</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{systemInfo.storageUsed}</div>
              <div className="text-sm text-muted-foreground">Stockage utilisé</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{systemInfo.uptime}</div>
              <div className="text-sm text-muted-foreground">Temps de fonctionnement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {new Date(systemInfo.lastBackup).toLocaleDateString()}
              </div>
              <div className="text-sm text-muted-foreground">Dernière sauvegarde</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration avancée */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration avancée
          </CardTitle>
          <CardDescription>
            Paramètres techniques et de maintenance du système
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Taille maximale des fichiers (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                min="1"
                max="500"
                value={settings.maxFileSize}
                onChange={(e) =>
                  setSettings({ ...settings, maxFileSize: parseInt(e.target.value) })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storageQuota">Quota de stockage (GB)</Label>
              <Input
                id="storageQuota"
                type="number"
                min="100"
                max="10000"
                value={settings.storageQuota}
                onChange={(e) =>
                  setSettings({ ...settings, storageQuota: parseInt(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowedFileTypes">Types de fichiers autorisés</Label>
            <Input
              id="allowedFileTypes"
              value={settings.allowedFileTypes}
              onChange={(e) =>
                setSettings({ ...settings, allowedFileTypes: e.target.value })
              }
              placeholder="pdf,doc,docx,xls,xlsx..."
            />
            <p className="text-sm text-muted-foreground">
              Extensions séparées par des virgules
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Sauvegarde et maintenance
            </h4>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sauvegarde automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Sauvegarder automatiquement la base de données
                </p>
              </div>
              <Switch
                checked={settings.enableAutoBackup}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableAutoBackup: checked })
                }
              />
            </div>

            {settings.enableAutoBackup && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="backupInterval">Intervalle de sauvegarde (heures)</Label>
                <Input
                  id="backupInterval"
                  type="number"
                  min="1"
                  max="168"
                  value={settings.backupInterval}
                  onChange={(e) =>
                    setSettings({ ...settings, backupInterval: parseInt(e.target.value) })
                  }
                  className="w-24"
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleBackupNow} variant="outline" className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Sauvegarder maintenant
              </Button>
              
              <Button onClick={handleClearCache} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Vider le cache
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Réindexer la DB
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Réindexer la base de données</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette opération peut prendre du temps et ralentir temporairement le système. 
                      Êtes-vous sûr de vouloir continuer ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReindexDatabase}>
                      Confirmer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Mode maintenance
                </Label>
                <p className="text-sm text-muted-foreground">
                  Bloquer l'accès au système pour les utilisateurs
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={handleMaintenanceToggle}
                />
                {settings.maintenanceMode && (
                  <Badge variant="destructive">Activé</Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mode debug</Label>
                <p className="text-sm text-muted-foreground">
                  Activer les logs détaillés pour le débogage
                </p>
              </div>
              <Switch
                checked={settings.debugMode}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, debugMode: checked })
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="customCSS">CSS personnalisé</Label>
            <Textarea
              id="customCSS"
              value={settings.customCSS}
              onChange={(e) =>
                setSettings({ ...settings, customCSS: e.target.value })
              }
              placeholder="/* Ajoutez votre CSS personnalisé ici */"
              className="font-mono text-sm"
              rows={6}
            />
          </div>

          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Sauvegarder les paramètres
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

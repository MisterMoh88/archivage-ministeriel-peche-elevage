
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, Save, AlertTriangle, Key, Clock } from "lucide-react";

export function SecuritySettings() {
  const [settings, setSettings] = useState({
    sessionTimeout: 120,
    maxLoginAttempts: 3,
    passwordExpiry: 90,
    twoFactorRequired: false,
    auditLog: true,
    ipWhitelist: "",
    fileUploadScan: true,
    downloadTracking: true,
  });

  const handleSave = () => {
    toast.success("Paramètres de sécurité sauvegardés");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Paramètres de sécurité
          </CardTitle>
          <CardDescription>
            Configurez les mesures de sécurité et d'authentification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              min="5"
              max="480"
              value={settings.sessionTimeout}
              onChange={(e) =>
                setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })
              }
              className="w-32"
            />
            <p className="text-sm text-muted-foreground">
              Durée avant déconnexion automatique pour inactivité
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="maxLoginAttempts">Tentatives de connexion maximum</Label>
            <Input
              id="maxLoginAttempts"
              type="number"
              min="1"
              max="10"
              value={settings.maxLoginAttempts}
              onChange={(e) =>
                setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })
              }
              className="w-24"
            />
            <p className="text-sm text-muted-foreground">
              Nombre d'échecs avant blocage temporaire du compte
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="passwordExpiry">Expiration des mots de passe (jours)</Label>
            <Input
              id="passwordExpiry"
              type="number"
              min="30"
              max="365"
              value={settings.passwordExpiry}
              onChange={(e) =>
                setSettings({ ...settings, passwordExpiry: parseInt(e.target.value) })
              }
              className="w-32"
            />
            <p className="text-sm text-muted-foreground">
              Fréquence de renouvellement obligatoire des mots de passe
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Authentification à deux facteurs
              </Label>
              <p className="text-sm text-muted-foreground">
                Exiger une vérification supplémentaire lors de la connexion
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.twoFactorRequired}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, twoFactorRequired: checked })
                }
              />
              {settings.twoFactorRequired && (
                <Badge variant="secondary">Activé</Badge>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Journal d'audit</Label>
              <p className="text-sm text-muted-foreground">
                Enregistrer toutes les actions des utilisateurs
              </p>
            </div>
            <Switch
              checked={settings.auditLog}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, auditLog: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Scan antivirus des fichiers</Label>
              <p className="text-sm text-muted-foreground">
                Analyser automatiquement les fichiers téléchargés
              </p>
            </div>
            <Switch
              checked={settings.fileUploadScan}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, fileUploadScan: checked })
              }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="ipWhitelist">Liste blanche d'adresses IP</Label>
            <Input
              id="ipWhitelist"
              placeholder="192.168.1.0/24, 10.0.0.1"
              value={settings.ipWhitelist}
              onChange={(e) =>
                setSettings({ ...settings, ipWhitelist: e.target.value })
              }
            />
            <p className="text-sm text-muted-foreground">
              Adresses IP autorisées (séparées par des virgules)
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Attention
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  La modification des paramètres de sécurité peut affecter l'accès des utilisateurs. 
                  Testez soigneusement avant d'appliquer en production.
                </p>
              </div>
            </div>
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

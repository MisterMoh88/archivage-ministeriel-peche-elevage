
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, CheckCircle, XCircle } from 'lucide-react';

export const PDFSpecifications = () => {
  return (
    <div className="space-y-4 p-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Spécifications techniques - Visionneuse PDF</AlertTitle>
        <AlertDescription>
          <div className="mt-2 space-y-3">
            <div>
              <h4 className="font-medium mb-2">Formats PDF supportés :</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  PDF standard (versions 1.0 à 2.0)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  PDF/A (archivage à long terme)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  PDF issus de scans (images intégrées)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  PDF avec formulaires interactifs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  PDF multipage
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Recommandations techniques :</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <Info className="h-3 w-3 text-blue-600" />
                  Taille recommandée : moins de 50MB pour une performance optimale
                </li>
                <li className="flex items-center gap-2">
                  <Info className="h-3 w-3 text-blue-600" />
                  Résolution des scans : 300 DPI minimum pour une bonne lisibilité
                </li>
                <li className="flex items-center gap-2">
                  <Info className="h-3 w-3 text-blue-600" />
                  Format d'image dans PDF : JPEG ou PNG compressé
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Limitations :</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <XCircle className="h-3 w-3 text-red-600" />
                  PDF protégés par mot de passe (nécessitent déchiffrement)
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-3 w-3 text-red-600" />
                  PDF corrompus ou endommagés
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-3 w-3 text-red-600" />
                  Fichiers de plus de 100MB (limitation navigateur)
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Méthodes de fallback :</h4>
              <ol className="space-y-1 text-sm list-decimal list-inside">
                <li>Visionneuse PDF.js intégrée (méthode principale)</li>
                <li>Google Docs Viewer (fallback automatique)</li>
                <li>Téléchargement direct (solution de secours)</li>
                <li>Ouverture dans nouvel onglet (solution finale)</li>
              </ol>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

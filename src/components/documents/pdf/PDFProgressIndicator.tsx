
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Clock, CheckCircle } from 'lucide-react';

interface PDFProgressIndicatorProps {
  progress: number;
  connectionSpeed: 'fast' | 'slow' | 'unknown';
  cacheHit: boolean;
  loadTime?: number;
  currentPage?: number;
  totalPages?: number;
  isComplete?: boolean;
}

export const PDFProgressIndicator = ({
  progress,
  connectionSpeed,
  cacheHit,
  loadTime,
  currentPage,
  totalPages,
  isComplete = false
}: PDFProgressIndicatorProps) => {
  const getSpeedIcon = () => {
    switch (connectionSpeed) {
      case 'fast':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'slow':
        return <WifiOff className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSpeedLabel = () => {
    switch (connectionSpeed) {
      case 'fast':
        return 'Connexion rapide';
      case 'slow':
        return 'Connexion lente';
      default:
        return 'Test de connexion...';
    }
  };

  return (
    <div className="p-4 bg-background border rounded-lg space-y-4">
      {/* En-tête avec état */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
          )}
          <h3 className="font-medium">
            {isComplete ? 'Document chargé' : 'Chargement du document'}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {cacheHit && (
            <Badge variant="secondary" className="text-xs">
              Cache
            </Badge>
          )}
          
          <div className="flex items-center gap-1">
            {getSpeedIcon()}
            <span className="text-xs text-muted-foreground">
              {getSpeedLabel()}
            </span>
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progression</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Informations détaillées */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          {currentPage && totalPages && (
            <span>Page {currentPage} / {totalPages}</span>
          )}
          
          {loadTime && (
            <span>
              {loadTime < 1000 
                ? `${Math.round(loadTime)}ms` 
                : `${(loadTime / 1000).toFixed(1)}s`
              }
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {connectionSpeed === 'slow' && (
            <span className="text-amber-600">
              Connexion lente détectée
            </span>
          )}
        </div>
      </div>

      {/* Conseils pour connexion lente */}
      {connectionSpeed === 'slow' && !isComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded p-3">
          <p className="text-xs text-amber-800">
            <strong>Conseil :</strong> En cas de connexion lente, vous pouvez télécharger 
            le document pour une consultation hors ligne plus fluide.
          </p>
        </div>
      )}
    </div>
  );
};

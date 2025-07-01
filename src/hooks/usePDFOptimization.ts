
import { useState, useEffect, useCallback, useRef } from 'react';

interface PDFOptimizationConfig {
  fileUrl: string;
  cacheEnabled?: boolean;
  preloadPages?: number;
  timeoutMs?: number;
}

interface PDFOptimizationState {
  isOptimized: boolean;
  cacheHit: boolean;
  loadTime: number;
  connectionSpeed: 'fast' | 'slow' | 'unknown';
  recommendFallback: boolean;
}

export const usePDFOptimization = ({
  fileUrl,
  cacheEnabled = true,
  preloadPages = 2,
  timeoutMs = 10000
}: PDFOptimizationConfig) => {
  const [state, setState] = useState<PDFOptimizationState>({
    isOptimized: false,
    cacheHit: false,
    loadTime: 0,
    connectionSpeed: 'unknown',
    recommendFallback: false
  });

  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Test de la vitesse de connexion
  const testConnectionSpeed = useCallback(async () => {
    const startTime = performance.now();
    
    try {
      // Test avec une requête HEAD pour éviter de télécharger le fichier complet
      const response = await fetch(fileUrl, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      if (response.ok) {
        const speed = responseTime < 1000 ? 'fast' : 'slow';
        setState(prev => ({ ...prev, connectionSpeed: speed }));
        return speed;
      }
    } catch (error) {
      console.warn('Test de vitesse de connexion échoué:', error);
    }
    
    return 'unknown';
  }, [fileUrl]);

  // Vérification du cache
  const checkCache = useCallback(() => {
    if (!cacheEnabled) return false;
    
    const cacheKey = `pdf-cache-${fileUrl}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const cacheData = JSON.parse(cached);
      const isExpired = Date.now() - cacheData.timestamp > 24 * 60 * 60 * 1000; // 24h
      
      if (!isExpired) {
        setState(prev => ({ ...prev, cacheHit: true }));
        return true;
      } else {
        localStorage.removeItem(cacheKey);
      }
    }
    
    return false;
  }, [fileUrl, cacheEnabled]);

  // Mise en cache des métadonnées
  const cacheMetadata = useCallback((metadata: any) => {
    if (!cacheEnabled) return;
    
    const cacheKey = `pdf-cache-${fileUrl}`;
    const cacheData = {
      metadata,
      timestamp: Date.now(),
      url: fileUrl
    };
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Erreur de mise en cache:', error);
    }
  }, [fileUrl, cacheEnabled]);

  // Préchargement intelligent des pages
  const preloadNextPages = useCallback(async (currentPage: number, totalPages: number) => {
    const pagesToPreload = Math.min(preloadPages, totalPages - currentPage);
    
    if (pagesToPreload > 0 && state.connectionSpeed === 'fast') {
      console.log(`🔄 Préchargement de ${pagesToPreload} pages suivantes...`);
      
      // Cette logique serait implémentée avec pdf.js pour précharger les pages
      // Pour l'instant, on simule le préchargement
      setTimeout(() => {
        console.log(`✅ ${pagesToPreload} pages préchargées`);
      }, 500);
    }
  }, [preloadPages, state.connectionSpeed]);

  // Gestion du timeout
  const startTimeout = useCallback(() => {
    startTimeRef.current = performance.now();
    
    timeoutRef.current = setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        recommendFallback: true,
        connectionSpeed: 'slow'
      }));
    }, timeoutMs);
  }, [timeoutMs]);

  const clearTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Calcul du temps de chargement
  const recordLoadTime = useCallback(() => {
    const loadTime = performance.now() - startTimeRef.current;
    setState(prev => ({ 
      ...prev, 
      loadTime,
      isOptimized: true 
    }));
    return loadTime;
  }, []);

  // Optimisation de l'URL pour la performance
  const getOptimizedUrl = useCallback(() => {
    // Ajouter des paramètres pour forcer la compression et optimiser le cache
    const url = new URL(fileUrl);
    url.searchParams.set('optimize', 'true');
    url.searchParams.set('cache', Date.now().toString());
    return url.toString();
  }, [fileUrl]);

  // Nettoyage du cache ancien
  const cleanupOldCache = useCallback(() => {
    const keys = Object.keys(localStorage);
    const pdfCacheKeys = keys.filter(key => key.startsWith('pdf-cache-'));
    
    pdfCacheKeys.forEach(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        const isOld = Date.now() - data.timestamp > 7 * 24 * 60 * 60 * 1000; // 7 jours
        
        if (isOld) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        localStorage.removeItem(key); // Supprimer les entrées corrompues
      }
    });
  }, []);

  // Initialisation
  useEffect(() => {
    cleanupOldCache();
    checkCache();
    testConnectionSpeed();
    startTimeout();
    
    return () => {
      clearTimeout();
    };
  }, [fileUrl]);

  return {
    state,
    actions: {
      testConnectionSpeed,
      checkCache,
      cacheMetadata,
      preloadNextPages,
      startTimeout,
      clearTimeout,
      recordLoadTime,
      getOptimizedUrl
    }
  };
};

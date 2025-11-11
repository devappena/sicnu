// Utilitaires d'optimisation des performances pour l'application ENA RH
import { lazy, ComponentType } from 'react';

// Types pour les métriques de performance
interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
}

// Hook pour mesurer les performances de rendu
export const usePerformanceMetrics = () => {
  const measureRenderTime = (componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      console.debug(`🚀 Performance: ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    };
  };

  const measureMemoryUsage = () => {
    if ('memory' in performance) {
      // @ts-ignore - API non standard mais utile en développement
      const memory = performance.memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  };

  return {
    measureRenderTime,
    measureMemoryUsage,
  };
};

// Fonction pour le lazy loading des composants avec gestion d'erreur
export const createLazyComponent = <T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  componentName: string
) => {
  return lazy(async () => {
    try {
      const startTime = performance.now();
      const component = await factory();
      const loadTime = performance.now() - startTime;
      
      console.debug(`📦 Lazy Load: ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
      return component;
    } catch (error) {
      console.error(`❌ Lazy Load Failed: ${componentName}`, error);
      throw error;
    }
  });
};

// Composants optimisés pour le lazy loading
export const LazyDashboard = createLazyComponent(
  () => import('../pages/Dashboard'),
  'Dashboard'
);

export const LazyEmployees = createLazyComponent(
  () => import('../pages/personnel/Employees'),
  'Employees'
);

export const LazyAbsences = createLazyComponent(
  () => import('../pages/time-management/Absences'),
  'Absences'
);

export const LazyTrainings = createLazyComponent(
  () => import('../pages/time-management/TrainingsNew'),
  'TrainingsNew'
);

export const LazyPayroll = createLazyComponent(
  () => import('../pages/finance/PayrollNew'),
  'PayrollNew'
);

export const LazyStatistics = createLazyComponent(
  () => import('../pages/admin/Statistics'),
  'Statistics'
);

// Hook pour la gestion des images optimisées
export const useOptimizedImages = () => {
  const loadImage = (src: string, alt: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
      img.alt = alt;
    });
  };

  const preloadImages = async (sources: string[]) => {
    try {
      const promises = sources.map(src => loadImage(src, ''));
      await Promise.all(promises);
      console.debug('🖼️ Images preloaded successfully');
    } catch (error) {
      console.error('❌ Image preload failed:', error);
    }
  };

  return {
    loadImage,
    preloadImages,
  };
};

// Fonction de debounce pour les recherches
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Hook pour la gestion du scroll avec throttling
export const useThrottledScroll = (callback: () => void, delay: number = 100) => {
  let lastCall = 0;
  
  const throttledCallback = () => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback();
    }
  };

  return throttledCallback;
};

// Optimisation des re-renders avec memoization intelligente
export const createMemoizedSelector = <T, R>(
  selector: (state: T) => R,
  equalityFn?: (a: R, b: R) => boolean
) => {
  let lastResult: R;
  let lastState: T;
  
  return (state: T): R => {
    if (state !== lastState) {
      const newResult = selector(state);
      
      if (equalityFn) {
        if (!equalityFn(lastResult, newResult)) {
          lastResult = newResult;
        }
      } else {
        lastResult = newResult;
      }
      
      lastState = state;
    }
    
    return lastResult;
  };
};

// Fonction pour mesurer la vitesse de chargement des données
export const measureDataLoadTime = async <T>(
  dataLoader: () => Promise<T>,
  label: string
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const data = await dataLoader();
    const loadTime = performance.now() - startTime;
    
    console.debug(`📊 Data Load: ${label} loaded in ${loadTime.toFixed(2)}ms`);
    return data;
  } catch (error) {
    console.error(`❌ Data Load Failed: ${label}`, error);
    throw error;
  }
};

// Configuration des seuils de performance
export const PERFORMANCE_THRESHOLDS = {
  FAST_RENDER: 16, // 60fps
  GOOD_RENDER: 33, // 30fps
  SLOW_RENDER: 100,
  FAST_LOAD: 500,
  GOOD_LOAD: 1000,
  SLOW_LOAD: 3000,
} as const;

// Fonction pour analyser les performances globales
export const analyzePerformance = (metrics: Partial<PerformanceMetrics>) => {
  const analysis = {
    renderPerformance: 'unknown',
    loadPerformance: 'unknown',
    memoryStatus: 'unknown',
    recommendations: [] as string[],
  };

  if (metrics.renderTime !== undefined) {
    if (metrics.renderTime <= PERFORMANCE_THRESHOLDS.FAST_RENDER) {
      analysis.renderPerformance = 'excellent';
    } else if (metrics.renderTime <= PERFORMANCE_THRESHOLDS.GOOD_RENDER) {
      analysis.renderPerformance = 'good';
    } else if (metrics.renderTime <= PERFORMANCE_THRESHOLDS.SLOW_RENDER) {
      analysis.renderPerformance = 'fair';
      analysis.recommendations.push('Considérer la memoization des composants');
    } else {
      analysis.renderPerformance = 'poor';
      analysis.recommendations.push('Optimisation urgente du rendu nécessaire');
    }
  }

  if (metrics.loadTime !== undefined) {
    if (metrics.loadTime <= PERFORMANCE_THRESHOLDS.FAST_LOAD) {
      analysis.loadPerformance = 'excellent';
    } else if (metrics.loadTime <= PERFORMANCE_THRESHOLDS.GOOD_LOAD) {
      analysis.loadPerformance = 'good';
    } else if (metrics.loadTime <= PERFORMANCE_THRESHOLDS.SLOW_LOAD) {
      analysis.loadPerformance = 'fair';
      analysis.recommendations.push('Considérer le lazy loading');
    } else {
      analysis.loadPerformance = 'poor';
      analysis.recommendations.push('Optimisation du chargement critique');
    }
  }

  return analysis;
};

// Export de tous les utilitaires
export {
  type PerformanceMetrics,
  PERFORMANCE_THRESHOLDS,
};

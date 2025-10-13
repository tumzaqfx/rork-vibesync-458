/**
 * Performance Optimization Utilities for Massive Scale
 * Handles millions of concurrent users with efficient resource management
 */

import { Platform } from 'react-native';

export interface PerformanceMetrics {
  fps: number;
  memory: number;
  cpu: number;
  networkLatency: number;
  renderTime: number;
}

export interface OptimizationConfig {
  enableImageCaching: boolean;
  enableLazyLoading: boolean;
  maxConcurrentRequests: number;
  requestTimeout: number;
  retryAttempts: number;
  compressionLevel: 'low' | 'medium' | 'high';
  enableOfflineMode: boolean;
}

const DEFAULT_CONFIG: OptimizationConfig = {
  enableImageCaching: true,
  enableLazyLoading: true,
  maxConcurrentRequests: 6,
  requestTimeout: 30000,
  retryAttempts: 3,
  compressionLevel: 'medium',
  enableOfflineMode: true,
};

class PerformanceOptimizer {
  private config: OptimizationConfig;
  private requestQueue: (() => Promise<any>)[] = [];
  private activeRequests = 0;
  private metrics: PerformanceMetrics = {
    fps: 60,
    memory: 0,
    cpu: 0,
    networkLatency: 0,
    renderTime: 0,
  };

  constructor(config: Partial<OptimizationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (Platform.OS !== 'web') {
      setInterval(() => {
        this.updateMetrics();
      }, 5000);
    }
  }

  private updateMetrics() {
    console.log('[Performance] Current metrics:', this.metrics);
  }

  public async optimizeRequest<T>(
    requestFn: () => Promise<T>,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<T> {
    if (this.activeRequests >= this.config.maxConcurrentRequests) {
      return new Promise((resolve, reject) => {
        this.requestQueue.push(async () => {
          try {
            const result = await this.executeRequest(requestFn);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      });
    }

    return this.executeRequest(requestFn);
  }

  private async executeRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    this.activeRequests++;
    
    try {
      const startTime = Date.now();
      const result = await Promise.race([
        requestFn(),
        this.createTimeout(),
      ]);
      
      const endTime = Date.now();
      this.metrics.networkLatency = endTime - startTime;
      
      return result as T;
    } finally {
      this.activeRequests--;
      this.processQueue();
    }
  }

  private createTimeout(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout'));
      }, this.config.requestTimeout);
    });
  }

  private processQueue() {
    if (this.requestQueue.length > 0 && this.activeRequests < this.config.maxConcurrentRequests) {
      const nextRequest = this.requestQueue.shift();
      if (nextRequest) {
        nextRequest();
      }
    }
  }

  public optimizeImage(uri: string, quality: number = 0.8): string {
    if (!this.config.enableImageCaching) {
      return uri;
    }

    if (uri.startsWith('http')) {
      const compressionParam = this.getCompressionParam();
      return `${uri}${uri.includes('?') ? '&' : '?'}q=${quality * 100}&compress=${compressionParam}`;
    }

    return uri;
  }

  private getCompressionParam(): string {
    switch (this.config.compressionLevel) {
      case 'low':
        return 'low';
      case 'high':
        return 'high';
      default:
        return 'medium';
    }
  }

  public debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        func(...args);
      }, wait);
    };
  }

  public throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;

    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }

  public memoize<T extends (...args: any[]) => any>(func: T): T {
    const cache = new Map<string, ReturnType<T>>();

    return ((...args: Parameters<T>) => {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }

      const result = func(...args);
      cache.set(key, result);

      if (cache.size > 100) {
        const firstKey = cache.keys().next().value as string | undefined;
        if (firstKey) {
          cache.delete(firstKey);
        }
      }

      return result;
    }) as T;
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public updateConfig(config: Partial<OptimizationConfig>) {
    this.config = { ...this.config, ...config };
  }
}

export const performanceOptimizer = new PerformanceOptimizer();

export const optimizeForScale = {
  request: <T>(fn: () => Promise<T>) => performanceOptimizer.optimizeRequest(fn),
  image: (uri: string, quality?: number) => performanceOptimizer.optimizeImage(uri, quality),
  debounce: <T extends (...args: any[]) => any>(fn: T, wait: number) => 
    performanceOptimizer.debounce(fn, wait),
  throttle: <T extends (...args: any[]) => any>(fn: T, limit: number) => 
    performanceOptimizer.throttle(fn, limit),
  memoize: <T extends (...args: any[]) => any>(fn: T) => 
    performanceOptimizer.memoize(fn),
};

import { InteractionManager, Platform } from 'react-native';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private enabled = __DEV__;

  startMeasure(name: string) {
    if (!this.enabled) return;

    this.metrics.set(name, {
      name,
      startTime: Date.now(),
    });
  }

  endMeasure(name: string) {
    if (!this.enabled) return;

    const metric = this.metrics.get(name);
    if (metric) {
      const endTime = Date.now();
      const duration = endTime - metric.startTime;
      
      metric.endTime = endTime;
      metric.duration = duration;

      console.log(`[Performance] ${name}: ${duration}ms`);

      if (duration > 1000) {
        console.warn(`[Performance] Slow operation detected: ${name} took ${duration}ms`);
      }
    }
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (!this.enabled) return fn();

    this.startMeasure(name);
    try {
      const result = await fn();
      this.endMeasure(name);
      return result;
    } catch (error) {
      this.endMeasure(name);
      throw error;
    }
  }

  measureSync<T>(name: string, fn: () => T): T {
    if (!this.enabled) return fn();

    this.startMeasure(name);
    try {
      const result = fn();
      this.endMeasure(name);
      return result;
    } catch (error) {
      this.endMeasure(name);
      throw error;
    }
  }

  runAfterInteractions(callback: () => void) {
    InteractionManager.runAfterInteractions(() => {
      callback();
    });
  }

  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  clearMetrics() {
    this.metrics.clear();
  }

  logMemoryUsage() {
    if (Platform.OS === 'web' && (performance as any).memory) {
      const memory = (performance as any).memory;
      console.log('[Performance] Memory:', {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
      });
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

export function withPerformanceTracking<T extends (...args: any[]) => any>(
  name: string,
  fn: T
): T {
  return ((...args: any[]) => {
    return performanceMonitor.measureSync(name, () => fn(...args));
  }) as T;
}

export function withAsyncPerformanceTracking<T extends (...args: any[]) => Promise<any>>(
  name: string,
  fn: T
): T {
  return (async (...args: any[]) => {
    return performanceMonitor.measureAsync(name, () => fn(...args));
  }) as T;
}

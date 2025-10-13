import { Platform } from 'react-native';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface MemoryInfo {
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;
}

export class PerformanceMonitor {
  private static metrics: Map<string, PerformanceMetric> = new Map();
  private static readonly MAX_METRICS = 100;

  static startMeasure(name: string, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      startTime: Date.now(),
      metadata,
    };
    
    this.metrics.set(name, metric);
    console.log(`[Performance] Started measuring: ${name}`);
  }

  static endMeasure(name: string): number | null {
    const metric = this.metrics.get(name);
    
    if (!metric) {
      console.warn(`[Performance] No metric found for: ${name}`);
      return null;
    }

    metric.endTime = Date.now();
    metric.duration = metric.endTime - metric.startTime;

    console.log(`[Performance] ${name}: ${metric.duration}ms`, metric.metadata);

    if (this.metrics.size > this.MAX_METRICS) {
      const firstKey = this.metrics.keys().next().value;
      if (firstKey) {
        this.metrics.delete(firstKey);
      }
    }

    return metric.duration;
  }

  static getMetric(name: string): PerformanceMetric | undefined {
    const metric = this.metrics.get(name);
    if (metric) {
      this.metrics.delete(name);
    }
    return metric;
  }

  static getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  static clearMetrics(): void {
    this.metrics.clear();
    console.log('[Performance] Metrics cleared');
  }

  static async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.startMeasure(name, metadata);
    try {
      const result = await fn();
      this.endMeasure(name);
      return result;
    } catch (error) {
      this.endMeasure(name);
      throw error;
    }
  }

  static measure<T>(
    name: string,
    fn: () => T,
    metadata?: Record<string, any>
  ): T {
    this.startMeasure(name, metadata);
    try {
      const result = fn();
      this.endMeasure(name);
      return result;
    } catch (error) {
      this.endMeasure(name);
      throw error;
    }
  }

  static getMemoryInfo(): MemoryInfo | null {
    if (Platform.OS === 'web' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  static logMemoryUsage(): void {
    const memory = this.getMemoryInfo();
    if (memory) {
      const usedMB = (memory.usedJSHeapSize || 0) / 1024 / 1024;
      const totalMB = (memory.totalJSHeapSize || 0) / 1024 / 1024;
      console.log(`[Memory] Used: ${usedMB.toFixed(2)}MB / Total: ${totalMB.toFixed(2)}MB`);
    }
  }

  static getAverageMetric(name: string): number | null {
    const metrics = Array.from(this.metrics.values()).filter(m => m.name === name && m.duration);
    
    if (metrics.length === 0) return null;

    const sum = metrics.reduce((acc, m) => acc + (m.duration || 0), 0);
    return sum / metrics.length;
  }
}

export class ErrorTracker {
  private static errors: {
    message: string;
    stack?: string;
    timestamp: number;
    context?: Record<string, any>;
  }[] = [];
  private static readonly MAX_ERRORS = 50;

  static trackError(error: Error, context?: Record<string, any>): void {
    const errorLog = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      context,
    };

    this.errors.push(errorLog);

    if (this.errors.length > this.MAX_ERRORS) {
      this.errors.shift();
    }

    console.error('[Error Tracked]', errorLog);
  }

  static getErrors(): typeof ErrorTracker.errors {
    return [...this.errors];
  }

  static clearErrors(): void {
    this.errors = [];
    console.log('[Error Tracker] Errors cleared');
  }

  static getErrorCount(): number {
    return this.errors.length;
  }

  static getRecentErrors(count: number = 10): typeof ErrorTracker.errors {
    return this.errors.slice(-count);
  }
}

export class AppHealthMonitor {
  private static healthChecks: Map<string, boolean> = new Map();
  private static lastCheckTime: number = Date.now();

  static registerHealthCheck(name: string, isHealthy: boolean): void {
    this.healthChecks.set(name, isHealthy);
    this.lastCheckTime = Date.now();
    
    if (!isHealthy) {
      console.warn(`[Health Check] ${name} is unhealthy`);
    }
  }

  static getHealthStatus(): {
    isHealthy: boolean;
    checks: Record<string, boolean>;
    lastCheck: number;
  } {
    const checks: Record<string, boolean> = {};
    let isHealthy = true;

    this.healthChecks.forEach((status, name) => {
      checks[name] = status;
      if (!status) isHealthy = false;
    });

    return {
      isHealthy,
      checks,
      lastCheck: this.lastCheckTime,
    };
  }

  static async runHealthChecks(): Promise<void> {
    console.log('[Health Check] Running system health checks...');

    try {
      this.registerHealthCheck('memory', true);
      
      const memory = PerformanceMonitor.getMemoryInfo();
      if (memory && memory.usedJSHeapSize && memory.jsHeapSizeLimit) {
        const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        this.registerHealthCheck('memory', usagePercent < 90);
      }

      const errorCount = ErrorTracker.getErrorCount();
      this.registerHealthCheck('errors', errorCount < 10);

      this.registerHealthCheck('performance', true);

      console.log('[Health Check] Completed', this.getHealthStatus());
    } catch (error) {
      console.error('[Health Check] Failed to run health checks', error);
    }
  }
}

export function withPerformanceTracking<T extends (...args: any[]) => any>(
  fn: T,
  name?: string
): T {
  return ((...args: any[]) => {
    const metricName = name || fn.name || 'anonymous';
    return PerformanceMonitor.measure(metricName, () => fn(...args));
  }) as T;
}

export function withAsyncPerformanceTracking<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  name?: string
): T {
  return (async (...args: any[]) => {
    const metricName = name || fn.name || 'anonymous';
    return await PerformanceMonitor.measureAsync(metricName, () => fn(...args));
  }) as T;
}

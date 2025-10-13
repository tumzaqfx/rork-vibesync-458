import { InteractionManager, Platform } from 'react-native';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceTracker {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private enabled: boolean = __DEV__;

  start(name: string, metadata?: Record<string, any>): void {
    if (!this.enabled) return;

    this.metrics.set(name, {
      name,
      startTime: Date.now(),
      metadata,
    });
  }

  end(name: string): number | null {
    if (!this.enabled) return null;

    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`[PerformanceTracker] Metric "${name}" not found`);
      return null;
    }

    const endTime = Date.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    console.log(
      `[Performance] ${name}: ${duration}ms`,
      metric.metadata ? metric.metadata : ''
    );

    return duration;
  }

  measure(name: string, fn: () => void): void {
    this.start(name);
    fn();
    this.end(name);
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  measureInteraction(name: string, fn: () => void): void {
    if (Platform.OS === 'web') {
      this.measure(name, fn);
      return;
    }

    this.start(name);
    InteractionManager.runAfterInteractions(() => {
      fn();
      this.end(name);
    });
  }

  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  clear(): void {
    this.metrics.clear();
  }

  getAverageDuration(namePattern: string): number {
    const matchingMetrics = Array.from(this.metrics.values()).filter(
      m => m.name.includes(namePattern) && m.duration !== undefined
    );

    if (matchingMetrics.length === 0) return 0;

    const totalDuration = matchingMetrics.reduce(
      (sum, m) => sum + (m.duration || 0),
      0
    );

    return totalDuration / matchingMetrics.length;
  }

  logSummary(): void {
    if (!this.enabled) return;

    const metrics = this.getAllMetrics();
    const completed = metrics.filter(m => m.duration !== undefined);

    console.log('\n[Performance Summary]');
    console.log(`Total metrics: ${metrics.length}`);
    console.log(`Completed: ${completed.length}`);

    if (completed.length > 0) {
      const sorted = completed.sort((a, b) => (b.duration || 0) - (a.duration || 0));
      console.log('\nTop 10 slowest operations:');
      sorted.slice(0, 10).forEach((m, i) => {
        console.log(`${i + 1}. ${m.name}: ${m.duration}ms`);
      });
    }
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }
}

export const performanceTracker = new PerformanceTracker();

export function withPerformanceTracking<T extends (...args: any[]) => any>(
  name: string,
  fn: T
): T {
  return ((...args: any[]) => {
    performanceTracker.start(name);
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.finally(() => performanceTracker.end(name));
      }
      performanceTracker.end(name);
      return result;
    } catch (error) {
      performanceTracker.end(name);
      throw error;
    }
  }) as T;
}

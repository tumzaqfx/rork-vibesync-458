import { ConnectionMonitor } from './network';
import { AppHealthMonitor, PerformanceMonitor } from './performance';
import { OfflineCache, OfflineQueue } from './offline-cache';
import { Analytics } from './analytics';
import { CrashReporter } from './crash-reporter';
import { AdvancedCache } from './advanced-cache';
import { PushNotificationManager } from './push-notifications';
import { BackendHealthCheck } from './backend-health';

export class AppInitializer {
  private static isInitialized = false;

  static async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('[App] Already initialized');
      return;
    }

    console.log('[App] Initializing VibeSync...');
    
    try {
      PerformanceMonitor.startMeasure('app_initialization');

      ConnectionMonitor.initialize();
      console.log('[App] Network monitoring initialized');

      await AdvancedCache.initialize();
      console.log('[App] Advanced cache initialized');

      await Analytics.initialize();
      console.log('[App] Analytics initialized');

      await CrashReporter.initialize();
      console.log('[App] Crash reporter initialized');

      try {
        const pushToken = await PushNotificationManager.initialize();
        if (pushToken) {
          console.log('[App] Push notifications initialized with token');
        } else {
          console.log('[App] Push notifications skipped (Expo Go or not available)');
        }
      } catch (pushError) {
        console.warn('[App] Push notification initialization failed:', pushError);
      }

      await this.cleanupExpiredData();

      try {
        await Promise.race([
          AppHealthMonitor.runHealthChecks(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Health check timeout')), 5000))
        ]);
      } catch (healthError) {
        console.warn('[App] Health check failed or timed out (backend may be offline):', healthError);
      }

      try {
        BackendHealthCheck.startMonitoring(30000);
        console.log('[App] Backend health monitoring started');

        BackendHealthCheck.onHealthChange((isHealthy) => {
          if (isHealthy) {
            console.log('[App] ✅ Backend connection restored');
          } else {
            console.warn('[App] ⚠️  Backend connection lost');
          }
        });
      } catch (monitorError) {
        console.warn('[App] Backend monitoring setup failed:', monitorError);
      }

      this.setupPeriodicHealthChecks();

      this.setupOfflineQueueProcessor();

      PerformanceMonitor.endMeasure('app_initialization');
      
      this.isInitialized = true;
      console.log('[App] VibeSync initialized successfully');
    } catch (error) {
      console.error('[App] Initialization error:', error);
      this.isInitialized = true;
      console.log('[App] Continuing despite initialization errors...');
    }
  }

  private static async cleanupExpiredData(): Promise<void> {
    try {
      const cleanedCount = await OfflineCache.cleanExpired();
      const advancedCleanedCount = await AdvancedCache.cleanExpired();
      console.log(`[App] Cleaned ${cleanedCount + advancedCleanedCount} expired cache entries`);
    } catch (error) {
      console.error('[App] Error cleaning expired data:', error);
    }
  }

  private static setupPeriodicHealthChecks(): void {
    setInterval(async () => {
      await AppHealthMonitor.runHealthChecks();
      PerformanceMonitor.logMemoryUsage();
    }, 5 * 60 * 1000);
    
    console.log('[App] Periodic health checks scheduled');
  }

  private static setupOfflineQueueProcessor(): void {
    ConnectionMonitor.subscribe(async (isOnline) => {
      if (isOnline) {
        console.log('[App] Connection restored, processing offline queue');
        
        const queueSize = await OfflineQueue.size();
        if (queueSize > 0) {
          await OfflineQueue.processQueue(async (action) => {
            console.log('[App] Processing queued action:', action.type);
            return true;
          });
        }
      }
    });
  }

  static getInitializationStatus(): boolean {
    return this.isInitialized;
  }
}

export async function initializeApp(): Promise<void> {
  await AppInitializer.initialize();
}

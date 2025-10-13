import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface CrashReport {
  id: string;
  timestamp: string;
  error: {
    message: string;
    stack?: string;
    name: string;
  };
  context: {
    userId?: string;
    sessionId?: string;
    screen?: string;
    action?: string;
    [key: string]: any;
  };
  device: {
    platform: string;
    version: string;
    model?: string;
  };
  app: {
    version: string;
    buildNumber?: string;
  };
}

const STORAGE_KEY = '@vibesync_crash_reports';
const MAX_STORED_REPORTS = 50;

export class CrashReporter {
  private static reports: CrashReport[] = [];
  private static isInitialized = false;

  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.loadReports();
      this.setupGlobalErrorHandler();
      this.isInitialized = true;
      console.log('[CrashReporter] Initialized');
    } catch (error) {
      console.error('[CrashReporter] Initialization error:', error);
    }
  }

  private static setupGlobalErrorHandler(): void {
    if (Platform.OS === 'web') {
      console.log('[CrashReporter] Skipping global error handler on web');
      return;
    }

    try {
      const ErrorUtils = require('react-native').ErrorUtils;
      if (!ErrorUtils || typeof ErrorUtils.getGlobalHandler !== 'function') {
        console.warn('[CrashReporter] ErrorUtils not available');
        return;
      }

      const originalHandler = ErrorUtils.getGlobalHandler();

      ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
        console.error('[CrashReporter] Global error caught:', error, 'Fatal:', isFatal);
        
        this.reportCrash(error, {
          isFatal,
          source: 'global_handler',
        });

        if (originalHandler) {
          originalHandler(error, isFatal);
        }
      });
    } catch (error) {
      console.warn('[CrashReporter] Could not setup global error handler:', error);
    }
  }

  static async reportCrash(error: Error, context?: Record<string, any>): Promise<void> {
    try {
      const report: CrashReport = {
        id: `crash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        context: context || {},
        device: {
          platform: Platform.OS,
          version: Platform.Version.toString(),
        },
        app: {
          version: '1.0.0',
        },
      };

      this.reports.push(report);

      if (this.reports.length > MAX_STORED_REPORTS) {
        this.reports = this.reports.slice(-MAX_STORED_REPORTS);
      }

      await this.saveReports();
      console.log('[CrashReporter] Crash reported:', report.id);
    } catch (err) {
      console.error('[CrashReporter] Error reporting crash:', err);
    }
  }

  static async reportError(error: Error, severity: 'low' | 'medium' | 'high' | 'critical', context?: Record<string, any>): Promise<void> {
    await this.reportCrash(error, {
      ...context,
      severity,
      type: 'handled_error',
    });
  }

  static async reportWarning(message: string, context?: Record<string, any>): Promise<void> {
    const error = new Error(message);
    await this.reportError(error, 'low', {
      ...context,
      type: 'warning',
    });
  }

  private static async loadReports(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.reports = JSON.parse(stored);
        console.log('[CrashReporter] Loaded', this.reports.length, 'reports');
      }
    } catch (error) {
      console.error('[CrashReporter] Error loading reports:', error);
    }
  }

  private static async saveReports(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.reports));
    } catch (error) {
      console.error('[CrashReporter] Error saving reports:', error);
    }
  }

  static async getReports(): Promise<CrashReport[]> {
    return [...this.reports];
  }

  static async clearReports(): Promise<void> {
    try {
      this.reports = [];
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('[CrashReporter] Reports cleared');
    } catch (error) {
      console.error('[CrashReporter] Error clearing reports:', error);
    }
  }

  static async sendReports(): Promise<boolean> {
    if (this.reports.length === 0) {
      console.log('[CrashReporter] No reports to send');
      return true;
    }

    try {
      console.log('[CrashReporter] Sending', this.reports.length, 'reports');
      
      await this.clearReports();
      return true;
    } catch (error) {
      console.error('[CrashReporter] Error sending reports:', error);
      return false;
    }
  }
}

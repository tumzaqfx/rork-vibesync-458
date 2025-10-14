import { Platform } from 'react-native';

export class BackendHealthCheck {
  private static getBackendUrl() {
    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';
    
    if (Platform.OS === 'web') {
      console.log('[BackendHealth] Web: Using backend URL:', backendUrl);
      return backendUrl;
    }
    
    if (backendUrl.includes('localhost')) {
      const localIp = '10.0.2.2';
      const port = backendUrl.split(':')[2] || '3000';
      const androidUrl = `http://${localIp}:${port}`;
      console.log('[BackendHealth] Native: Converting localhost to Android emulator URL:', androidUrl);
      return androidUrl;
    }
    
    console.log('[BackendHealth] Native: Using backend URL:', backendUrl);
    return backendUrl;
  }
  private static backendUrl = BackendHealthCheck.getBackendUrl();
  private static healthCheckCache: { isHealthy: boolean; timestamp: number } | null = null;
  private static CACHE_DURATION = 30000;
  private static FAILED_CHECK_CACHE_DURATION = 5000;
  private static monitoringInterval: ReturnType<typeof setInterval> | null = null;
  private static healthChangeListeners: ((isHealthy: boolean) => void)[] = [];
  private static lastHealthStatus: boolean | null = null;
  private static isCheckingHealth = false;

  static async isBackendRunning(): Promise<boolean> {
    if (!this.backendUrl) {
      console.warn('[BackendHealth] No backend URL configured');
      return false;
    }

    if (this.backendUrl === 'http://localhost:3000') {
      console.log('[BackendHealth] Using local backend URL:', this.backendUrl);
    }

    const now = Date.now();
    if (this.healthCheckCache) {
      const cacheDuration = this.healthCheckCache.isHealthy 
        ? this.CACHE_DURATION 
        : this.FAILED_CHECK_CACHE_DURATION;
      
      if (now - this.healthCheckCache.timestamp < cacheDuration) {
        return this.healthCheckCache.isHealthy;
      }
    }

    if (this.isCheckingHealth) {
      console.log('[BackendHealth] Health check already in progress, returning cached status');
      return this.healthCheckCache?.isHealthy ?? false;
    }

    this.isCheckingHealth = true;

    const healthEndpoints = ['/health', '/api/health'];
    
    for (const endpoint of healthEndpoints) {
      try {
        const url = `${this.backendUrl}${endpoint}`;
        console.log('[BackendHealth] Checking backend health at:', url);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: Platform.OS === 'web' ? 'cors' : undefined,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const isHealthy = data.status === 'ok';
          this.healthCheckCache = { isHealthy, timestamp: now };
          this.isCheckingHealth = false;
          
          console.log('[BackendHealth] ✅ Backend health check passed:', data);
          return isHealthy;
        } else {
          console.log(`[BackendHealth] ❌ Health check returned status ${response.status}`);
        }
      } catch (error: any) {
        const errorMsg = error?.message || String(error);
        console.log(`[BackendHealth] ❌ Health check failed for ${endpoint}:`, errorMsg);
        
        if (errorMsg.includes('Network request failed')) {
          console.log('[BackendHealth] 💡 Tip: Make sure backend is running on', this.backendUrl);
          if (Platform.OS === 'web' && this.backendUrl.includes('localhost')) {
            console.log('[BackendHealth] 💡 Web Tip: Consider using tunnel URL instead of localhost');
          }
        }
        continue;
      }
    }

    console.log('[BackendHealth] All health check endpoints failed');
    this.healthCheckCache = { isHealthy: false, timestamp: now };
    this.isCheckingHealth = false;
    return false;
  }

  static clearCache(): void {
    this.healthCheckCache = null;
  }

  static startMonitoring(intervalMs: number = 30000): void {
    if (this.monitoringInterval) {
      console.log('[BackendHealth] Monitoring already started');
      return;
    }

    console.log('[BackendHealth] Starting health monitoring with interval:', intervalMs);
    
    this.monitoringInterval = setInterval(async () => {
      const isHealthy = await this.isBackendRunning();
      
      if (this.lastHealthStatus !== null && this.lastHealthStatus !== isHealthy) {
        this.notifyHealthChange(isHealthy);
      }
      
      this.lastHealthStatus = isHealthy;
    }, intervalMs);

    this.isBackendRunning().then((isHealthy) => {
      this.lastHealthStatus = isHealthy;
    });
  }

  static stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('[BackendHealth] Monitoring stopped');
    }
  }

  static onHealthChange(callback: (isHealthy: boolean) => void): () => void {
    this.healthChangeListeners.push(callback);
    
    return () => {
      const index = this.healthChangeListeners.indexOf(callback);
      if (index > -1) {
        this.healthChangeListeners.splice(index, 1);
      }
    };
  }

  private static notifyHealthChange(isHealthy: boolean): void {
    this.healthChangeListeners.forEach((listener) => {
      try {
        listener(isHealthy);
      } catch (error) {
        console.error('[BackendHealth] Error in health change listener:', error);
      }
    });
  }

  static getCurrentHealthStatus(): boolean | null {
    return this.lastHealthStatus;
  }
}

import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheConfig {
  ttl?: number;
  maxSize?: number;
  prefix?: string;
}

export class OfflineCache {
  private static readonly DEFAULT_TTL = 1000 * 60 * 60;
  private static readonly DEFAULT_MAX_SIZE = 100;
  private static readonly CACHE_PREFIX = 'cache_';

  static async set<T>(
    key: string,
    data: T,
    config: CacheConfig = {}
  ): Promise<void> {
    try {
      const {
        ttl = this.DEFAULT_TTL,
        prefix = this.CACHE_PREFIX,
      } = config;

      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
      };

      const cacheKey = `${prefix}${key}`;
      await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));
      
      console.log(`[Cache] Set: ${key}`);
    } catch (error) {
      console.error('[Cache] Error setting cache:', error);
    }
  }

  static async get<T>(
    key: string,
    config: CacheConfig = {}
  ): Promise<T | null> {
    try {
      const { prefix = this.CACHE_PREFIX } = config;
      const cacheKey = `${prefix}${key}`;
      
      const cached = await AsyncStorage.getItem(cacheKey);
      if (!cached) {
        console.log(`[Cache] Miss: ${key}`);
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(cached);

      if (Date.now() > entry.expiresAt) {
        console.log(`[Cache] Expired: ${key}`);
        await this.remove(key, config);
        return null;
      }

      console.log(`[Cache] Hit: ${key}`);
      return entry.data;
    } catch (error) {
      console.error('[Cache] Error getting cache:', error);
      return null;
    }
  }

  static async remove(key: string, config: CacheConfig = {}): Promise<void> {
    try {
      const { prefix = this.CACHE_PREFIX } = config;
      const cacheKey = `${prefix}${key}`;
      await AsyncStorage.removeItem(cacheKey);
      console.log(`[Cache] Removed: ${key}`);
    } catch (error) {
      console.error('[Cache] Error removing cache:', error);
    }
  }

  static async clear(config: CacheConfig = {}): Promise<void> {
    try {
      const { prefix = this.CACHE_PREFIX } = config;
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(prefix));
      
      await AsyncStorage.multiRemove(cacheKeys);
      console.log(`[Cache] Cleared ${cacheKeys.length} entries`);
    } catch (error) {
      console.error('[Cache] Error clearing cache:', error);
    }
  }

  static async has(key: string, config: CacheConfig = {}): Promise<boolean> {
    const data = await this.get(key, config);
    return data !== null;
  }

  static async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    config: CacheConfig = {}
  ): Promise<T> {
    const cached = await this.get<T>(key, config);
    
    if (cached !== null) {
      return cached;
    }

    console.log(`[Cache] Fetching fresh data for: ${key}`);
    const data = await fetchFn();
    await this.set(key, data, config);
    
    return data;
  }

  static async getAllKeys(config: CacheConfig = {}): Promise<string[]> {
    try {
      const { prefix = this.CACHE_PREFIX } = config;
      const keys = await AsyncStorage.getAllKeys();
      return keys
        .filter(key => key.startsWith(prefix))
        .map(key => key.replace(prefix, ''));
    } catch (error) {
      console.error('[Cache] Error getting all keys:', error);
      return [];
    }
  }

  static async getCacheSize(): Promise<number> {
    try {
      const keys = await this.getAllKeys();
      return keys.length;
    } catch (error) {
      console.error('[Cache] Error getting cache size:', error);
      return 0;
    }
  }

  static async cleanExpired(config: CacheConfig = {}): Promise<number> {
    try {
      const { prefix = this.CACHE_PREFIX } = config;
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(prefix));
      
      let cleanedCount = 0;

      for (const cacheKey of cacheKeys) {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const entry: CacheEntry<any> = JSON.parse(cached);
          if (Date.now() > entry.expiresAt) {
            await AsyncStorage.removeItem(cacheKey);
            cleanedCount++;
          }
        }
      }

      console.log(`[Cache] Cleaned ${cleanedCount} expired entries`);
      return cleanedCount;
    } catch (error) {
      console.error('[Cache] Error cleaning expired cache:', error);
      return 0;
    }
  }
}

export class OfflineQueue {
  private static readonly QUEUE_KEY = 'offline_queue';

  static async enqueue(action: {
    type: string;
    payload: any;
    timestamp: number;
  }): Promise<void> {
    try {
      const queue = await this.getQueue();
      queue.push(action);
      await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
      console.log('[Offline Queue] Enqueued action:', action.type);
    } catch (error) {
      console.error('[Offline Queue] Error enqueuing:', error);
    }
  }

  static async dequeue(): Promise<any | null> {
    try {
      const queue = await this.getQueue();
      if (queue.length === 0) return null;

      const action = queue.shift();
      await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
      console.log('[Offline Queue] Dequeued action:', action?.type);
      
      return action;
    } catch (error) {
      console.error('[Offline Queue] Error dequeuing:', error);
      return null;
    }
  }

  static async getQueue(): Promise<any[]> {
    try {
      const queueJson = await AsyncStorage.getItem(this.QUEUE_KEY);
      return queueJson ? JSON.parse(queueJson) : [];
    } catch (error) {
      console.error('[Offline Queue] Error getting queue:', error);
      return [];
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.QUEUE_KEY);
      console.log('[Offline Queue] Cleared');
    } catch (error) {
      console.error('[Offline Queue] Error clearing:', error);
    }
  }

  static async size(): Promise<number> {
    const queue = await this.getQueue();
    return queue.length;
  }

  static async processQueue(
    processor: (action: any) => Promise<boolean>
  ): Promise<number> {
    try {
      const queue = await this.getQueue();
      let processedCount = 0;

      for (const action of queue) {
        try {
          const success = await processor(action);
          if (success) {
            await this.dequeue();
            processedCount++;
          } else {
            break;
          }
        } catch (error) {
          console.error('[Offline Queue] Error processing action:', error);
          break;
        }
      }

      console.log(`[Offline Queue] Processed ${processedCount} actions`);
      return processedCount;
    } catch (error) {
      console.error('[Offline Queue] Error processing queue:', error);
      return 0;
    }
  }
}

export class DataSyncManager {
  private static isSyncing: boolean = false;
  private static lastSyncTime: number = 0;

  static async sync(
    syncFn: () => Promise<void>,
    forceSync: boolean = false
  ): Promise<boolean> {
    if (this.isSyncing && !forceSync) {
      console.log('[Sync] Already syncing, skipping');
      return false;
    }

    try {
      this.isSyncing = true;
      console.log('[Sync] Starting sync...');

      await syncFn();

      this.lastSyncTime = Date.now();
      console.log('[Sync] Completed successfully');
      
      return true;
    } catch (error) {
      console.error('[Sync] Error during sync:', error);
      return false;
    } finally {
      this.isSyncing = false;
    }
  }

  static getLastSyncTime(): number {
    return this.lastSyncTime;
  }

  static isSyncInProgress(): boolean {
    return this.isSyncing;
  }

  static async syncWithRetry(
    syncFn: () => Promise<void>,
    maxRetries: number = 3
  ): Promise<boolean> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const success = await this.sync(syncFn);
      if (success) return true;

      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`[Sync] Retry ${attempt + 1} in ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.error('[Sync] Failed after all retries');
    return false;
  }
}

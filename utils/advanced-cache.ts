import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  version: string;
}

export interface CacheOptions {
  ttl?: number;
  version?: string;
  forceRefresh?: boolean;
}

const DEFAULT_TTL = 1000 * 60 * 60;
const CACHE_VERSION = '1.0.0';
const CACHE_PREFIX = '@vibesync_cache_';

export class AdvancedCache {
  private static memoryCache: Map<string, CacheEntry<any>> = new Map();
  private static isOnline: boolean = true;

  static async initialize(): Promise<void> {
    const state = await NetInfo.fetch();
    this.isOnline = state.isConnected ?? true;

    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected ?? true;
      console.log('[Cache] Network status:', this.isOnline ? 'online' : 'offline');
    });

    console.log('[Cache] Initialized');
  }

  static async set<T>(key: string, data: T, options: CacheOptions = {}): Promise<void> {
    const ttl = options.ttl || DEFAULT_TTL;
    const version = options.version || CACHE_VERSION;
    const now = Date.now();

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
      version,
    };

    this.memoryCache.set(key, entry);

    try {
      await AsyncStorage.setItem(
        `${CACHE_PREFIX}${key}`,
        JSON.stringify(entry)
      );
      console.log('[Cache] Set:', key);
    } catch (error) {
      console.error('[Cache] Error setting cache:', error);
    }
  }

  static async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    if (options.forceRefresh) {
      await this.remove(key);
      return null;
    }

    let entry = this.memoryCache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      try {
        const stored = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
        if (stored) {
          entry = JSON.parse(stored) as CacheEntry<T>;
          this.memoryCache.set(key, entry);
        }
      } catch (error) {
        console.error('[Cache] Error getting cache:', error);
        return null;
      }
    }

    if (!entry) {
      return null;
    }

    const now = Date.now();
    const version = options.version || CACHE_VERSION;

    if (entry.expiresAt < now || entry.version !== version) {
      await this.remove(key);
      return null;
    }

    console.log('[Cache] Hit:', key);
    return entry.data;
  }

  static async remove(key: string): Promise<void> {
    this.memoryCache.delete(key);
    
    try {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
      console.log('[Cache] Removed:', key);
    } catch (error) {
      console.error('[Cache] Error removing cache:', error);
    }
  }

  static async clear(): Promise<void> {
    this.memoryCache.clear();

    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
      console.log('[Cache] Cleared all cache');
    } catch (error) {
      console.error('[Cache] Error clearing cache:', error);
    }
  }

  static async has(key: string): Promise<boolean> {
    const data = await this.get(key);
    return data !== null;
  }

  static async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = await this.get<T>(key, options);
    
    if (cached !== null) {
      return cached;
    }

    if (!this.isOnline) {
      throw new Error('No cached data available and device is offline');
    }

    const data = await fetchFn();
    await this.set(key, data, options);
    
    return data;
  }

  static isOnlineMode(): boolean {
    return this.isOnline;
  }

  static async getCacheSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      
      let totalSize = 0;
      for (const key of cacheKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('[Cache] Error calculating cache size:', error);
      return 0;
    }
  }

  static async getCacheStats(): Promise<{
    entries: number;
    size: number;
    memoryEntries: number;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      const size = await this.getCacheSize();

      return {
        entries: cacheKeys.length,
        size,
        memoryEntries: this.memoryCache.size,
      };
    } catch (error) {
      console.error('[Cache] Error getting cache stats:', error);
      return { entries: 0, size: 0, memoryEntries: 0 };
    }
  }

  static async cleanExpired(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      const now = Date.now();
      let cleaned = 0;

      for (const key of cacheKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          const entry = JSON.parse(value) as CacheEntry<any>;
          if (entry.expiresAt < now) {
            await AsyncStorage.removeItem(key);
            this.memoryCache.delete(key.replace(CACHE_PREFIX, ''));
            cleaned++;
          }
        }
      }

      console.log('[Cache] Cleaned', cleaned, 'expired entries');
      return cleaned;
    } catch (error) {
      console.error('[Cache] Error cleaning expired cache:', error);
      return 0;
    }
  }
}

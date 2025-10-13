import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number;
  staleWhileRevalidate?: boolean;
}

const DEFAULT_TTL = 5 * 60 * 1000;
const CACHE_PREFIX = '@api_cache:';

class APICache {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private pendingRequests: Map<string, Promise<any>> = new Map();

  private getCacheKey(key: string): string {
    return `${CACHE_PREFIX}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && Date.now() < memoryEntry.expiresAt) {
      return memoryEntry.data;
    }

    try {
      const cacheKey = this.getCacheKey(key);
      const cached = await AsyncStorage.getItem(cacheKey);
      
      if (cached) {
        const entry: CacheEntry<T> = JSON.parse(cached);
        
        if (Date.now() < entry.expiresAt) {
          this.memoryCache.set(key, entry);
          return entry.data;
        } else {
          await AsyncStorage.removeItem(cacheKey);
        }
      }
    } catch (error) {
      console.warn('[APICache] Get error:', error);
    }

    return null;
  }

  async set<T>(key: string, data: T, options: CacheOptions = {}): Promise<void> {
    const ttl = options.ttl || DEFAULT_TTL;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    };

    this.memoryCache.set(key, entry);

    try {
      const cacheKey = this.getCacheKey(key);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch (error) {
      console.warn('[APICache] Set error:', error);
    }
  }

  async invalidate(key: string): Promise<void> {
    this.memoryCache.delete(key);
    
    try {
      const cacheKey = this.getCacheKey(key);
      await AsyncStorage.removeItem(cacheKey);
    } catch (error) {
      console.warn('[APICache] Invalidate error:', error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = Array.from(this.memoryCache.keys()).filter(k => k.includes(pattern));
    
    for (const key of keys) {
      await this.invalidate(key);
    }
  }

  async fetchWithCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const pending = this.pendingRequests.get(key);
    if (pending) {
      return pending;
    }

    const cached = await this.get<T>(key);
    if (cached !== null) {
      if (options.staleWhileRevalidate) {
        this.revalidate(key, fetcher, options);
      }
      return cached;
    }

    const promise = fetcher();
    this.pendingRequests.set(key, promise);

    try {
      const data = await promise;
      await this.set(key, data, options);
      return data;
    } finally {
      this.pendingRequests.delete(key);
    }
  }

  private async revalidate<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions
  ): Promise<void> {
    try {
      const data = await fetcher();
      await this.set(key, data, options);
    } catch (error) {
      console.warn('[APICache] Revalidate error:', error);
    }
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();
    this.pendingRequests.clear();

    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.warn('[APICache] Clear error:', error);
    }
  }

  getCacheSize(): number {
    return this.memoryCache.size;
  }

  async prefetch<T>(key: string, fetcher: () => Promise<T>, options: CacheOptions = {}): Promise<void> {
    const cached = await this.get<T>(key);
    if (cached === null) {
      try {
        const data = await fetcher();
        await this.set(key, data, options);
      } catch (error) {
        console.warn('[APICache] Prefetch error:', error);
      }
    }
  }
}

export const apiCache = new APICache();

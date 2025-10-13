import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const CACHE_DIR = `${FileSystem.cacheDirectory}images/`;
const MAX_CACHE_SIZE = 100 * 1024 * 1024;
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000;

interface CacheEntry {
  uri: string;
  timestamp: number;
  size: number;
}

class ImageCache {
  private cacheMap: Map<string, CacheEntry> = new Map();
  private initialized = false;

  async initialize() {
    if (this.initialized || Platform.OS === 'web') return;

    try {
      const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
      }
      await this.loadCacheMap();
      this.initialized = true;
    } catch (error) {
      console.warn('[ImageCache] Initialization error:', error);
    }
  }

  private async loadCacheMap() {
    try {
      const files = await FileSystem.readDirectoryAsync(CACHE_DIR);
      for (const file of files) {
        const filePath = `${CACHE_DIR}${file}`;
        const info = await FileSystem.getInfoAsync(filePath);
        if (info.exists && !info.isDirectory) {
          this.cacheMap.set(file, {
            uri: filePath,
            timestamp: info.modificationTime || Date.now(),
            size: info.size || 0,
          });
        }
      }
    } catch (error) {
      console.warn('[ImageCache] Load cache map error:', error);
    }
  }

  private getCacheKey(url: string): string {
    return url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }

  async get(url: string): Promise<string | null> {
    if (Platform.OS === 'web') return url;
    if (!this.initialized) await this.initialize();

    const key = this.getCacheKey(url);
    const entry = this.cacheMap.get(key);

    if (entry) {
      const age = Date.now() - entry.timestamp;
      if (age < CACHE_EXPIRY) {
        const info = await FileSystem.getInfoAsync(entry.uri);
        if (info.exists) {
          return entry.uri;
        }
      }
      this.cacheMap.delete(key);
    }

    return null;
  }

  async set(url: string, localUri: string): Promise<void> {
    if (Platform.OS === 'web') return;
    if (!this.initialized) await this.initialize();

    try {
      const key = this.getCacheKey(url);
      const cachedPath = `${CACHE_DIR}${key}`;

      await FileSystem.copyAsync({
        from: localUri,
        to: cachedPath,
      });

      const info = await FileSystem.getInfoAsync(cachedPath);
      if (info.exists) {
        this.cacheMap.set(key, {
          uri: cachedPath,
          timestamp: Date.now(),
          size: info.size || 0,
        });

        await this.enforceMaxSize();
      }
    } catch (error) {
      console.warn('[ImageCache] Set error:', error);
    }
  }

  async download(url: string): Promise<string> {
    if (Platform.OS === 'web') return url;

    const cached = await this.get(url);
    if (cached) return cached;

    try {
      const key = this.getCacheKey(url);
      const cachedPath = `${CACHE_DIR}${key}`;

      const downloadResult = await FileSystem.downloadAsync(url, cachedPath);
      
      if (downloadResult.status === 200) {
        const info = await FileSystem.getInfoAsync(cachedPath);
        if (info.exists) {
          this.cacheMap.set(key, {
            uri: cachedPath,
            timestamp: Date.now(),
            size: info.size || 0,
          });

          await this.enforceMaxSize();
          return cachedPath;
        }
      }
    } catch (error) {
      console.warn('[ImageCache] Download error:', error);
    }

    return url;
  }

  private async enforceMaxSize() {
    const entries = Array.from(this.cacheMap.entries());
    const totalSize = entries.reduce((sum, [, entry]) => sum + entry.size, 0);

    if (totalSize > MAX_CACHE_SIZE) {
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

      let currentSize = totalSize;
      for (const [key, entry] of entries) {
        if (currentSize <= MAX_CACHE_SIZE * 0.8) break;

        try {
          await FileSystem.deleteAsync(entry.uri, { idempotent: true });
          this.cacheMap.delete(key);
          currentSize -= entry.size;
        } catch (error) {
          console.warn('[ImageCache] Delete error:', error);
        }
      }
    }
  }

  async clear() {
    if (Platform.OS === 'web') return;

    try {
      await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true });
      await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
      this.cacheMap.clear();
    } catch (error) {
      console.warn('[ImageCache] Clear error:', error);
    }
  }

  getCacheSize(): number {
    return Array.from(this.cacheMap.values()).reduce((sum, entry) => sum + entry.size, 0);
  }
}

export const imageCache = new ImageCache();

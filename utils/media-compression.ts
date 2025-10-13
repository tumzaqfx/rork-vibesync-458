import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface CompressionResult {
  uri: string;
  width: number;
  height: number;
  size: number;
  originalSize: number;
  compressionRatio: number;
}

export class MediaCompression {
  static async compressImage(
    uri: string,
    options: CompressionOptions = {}
  ): Promise<CompressionResult> {
    try {
      const {
        maxWidth = 1920,
        maxHeight = 1920,
        quality = 0.8,
        format = 'jpeg',
      } = options;

      const originalInfo = await FileSystem.getInfoAsync(uri);
      const originalSize = originalInfo.exists && 'size' in originalInfo ? originalInfo.size : 0;

      const saveFormat = format === 'jpeg' ? SaveFormat.JPEG : 
                        format === 'png' ? SaveFormat.PNG : 
                        SaveFormat.WEBP;

      const result = await manipulateAsync(
        uri,
        [{ resize: { width: maxWidth, height: maxHeight } }],
        { compress: quality, format: saveFormat }
      );

      const compressedInfo = await FileSystem.getInfoAsync(result.uri);
      const compressedSize = compressedInfo.exists && 'size' in compressedInfo ? compressedInfo.size : 0;

      const compressionRatio = originalSize > 0 ? (1 - compressedSize / originalSize) * 100 : 0;

      console.log('[MediaCompression] Image compressed:', {
        originalSize,
        compressedSize,
        compressionRatio: `${compressionRatio.toFixed(2)}%`,
      });

      return {
        uri: result.uri,
        width: result.width,
        height: result.height,
        size: compressedSize,
        originalSize,
        compressionRatio,
      };
    } catch (error) {
      console.error('[MediaCompression] Error compressing image:', error);
      throw error;
    }
  }

  static async compressMultipleImages(
    uris: string[],
    options: CompressionOptions = {}
  ): Promise<CompressionResult[]> {
    const results: CompressionResult[] = [];

    for (const uri of uris) {
      try {
        const result = await this.compressImage(uri, options);
        results.push(result);
      } catch (error) {
        console.error('[MediaCompression] Error compressing image:', uri, error);
      }
    }

    return results;
  }

  static async getThumbnail(
    uri: string,
    size: number = 200
  ): Promise<string> {
    try {
      const result = await manipulateAsync(
        uri,
        [{ resize: { width: size, height: size } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );

      console.log('[MediaCompression] Thumbnail created');
      return result.uri;
    } catch (error) {
      console.error('[MediaCompression] Error creating thumbnail:', error);
      throw error;
    }
  }

  static async getFileSize(uri: string): Promise<number> {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      return info.exists && 'size' in info ? info.size : 0;
    } catch (error) {
      console.error('[MediaCompression] Error getting file size:', error);
      return 0;
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  static async optimizeForUpload(uri: string): Promise<CompressionResult> {
    return this.compressImage(uri, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.85,
      format: 'jpeg',
    });
  }

  static async optimizeForProfile(uri: string): Promise<CompressionResult> {
    return this.compressImage(uri, {
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.9,
      format: 'jpeg',
    });
  }

  static async optimizeForStory(uri: string): Promise<CompressionResult> {
    return this.compressImage(uri, {
      maxWidth: 1080,
      maxHeight: 1920,
      quality: 0.85,
      format: 'jpeg',
    });
  }
}

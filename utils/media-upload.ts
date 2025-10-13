import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export interface UploadOptions {
  onProgress?: (progress: number) => void;
  maxRetries?: number;
  timeout?: number;
  compressionQuality?: number;
}

export interface MediaUploadResult {
  uri: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
}

export async function compressImage(
  uri: string,
  quality: number = 0.8
): Promise<MediaUploadResult> {
  try {
    console.log('[MediaUpload] Compressing image:', uri);

    const manipResult = await manipulateAsync(
      uri,
      [{ resize: { width: 1080 } }],
      { compress: quality, format: SaveFormat.JPEG }
    );

    const fileInfo = await FileSystem.getInfoAsync(manipResult.uri);
    
    return {
      uri: manipResult.uri,
      size: (fileInfo as any).size || 0,
      width: manipResult.width,
      height: manipResult.height,
    };
  } catch (error) {
    console.error('[MediaUpload] Image compression error:', error);
    throw new Error('Failed to compress image');
  }
}

export async function uploadMedia(
  uri: string,
  type: 'photo' | 'video',
  options: UploadOptions = {}
): Promise<MediaUploadResult> {
  const {
    onProgress,
    maxRetries = 3,
    timeout = 30000,
    compressionQuality = 0.8,
  } = options;

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt < maxRetries) {
    try {
      console.log(`[MediaUpload] Upload attempt ${attempt + 1}/${maxRetries}`);

      let processedUri = uri;
      let fileSize = 0;
      let dimensions = {};

      if (type === 'photo') {
        const compressed = await compressImage(uri, compressionQuality);
        processedUri = compressed.uri;
        fileSize = compressed.size;
        dimensions = { width: compressed.width, height: compressed.height };
      } else {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        fileSize = (fileInfo as any).size || 0;
      }

      const result = await simulateUpload(processedUri, fileSize, onProgress, timeout);

      console.log('[MediaUpload] Upload successful:', result);
      return { ...result, ...dimensions };
    } catch (error) {
      lastError = error as Error;
      attempt++;
      
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.log(`[MediaUpload] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Upload failed after maximum retries');
}

async function simulateUpload(
  uri: string,
  fileSize: number,
  onProgress?: (progress: number) => void,
  timeout: number = 30000
): Promise<MediaUploadResult> {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const chunkSize = 5;
    let currentChunk = 0;

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      reject(new Error('Upload timeout'));
    }, timeout);

    const intervalId = setInterval(() => {
      currentChunk++;
      progress = Math.min(currentChunk * chunkSize, 100);
      
      onProgress?.(progress);

      if (progress >= 100) {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        
        setTimeout(() => {
          resolve({
            uri,
            size: fileSize,
          });
        }, 500);
      }
    }, 150);
  });
}

export async function uploadVoiceNote(
  uri: string,
  duration: number,
  options: UploadOptions = {}
): Promise<MediaUploadResult> {
  const { onProgress, maxRetries = 3, timeout = 20000 } = options;

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt < maxRetries) {
    try {
      console.log(`[MediaUpload] Voice upload attempt ${attempt + 1}/${maxRetries}`);

      const fileInfo = await FileSystem.getInfoAsync(uri);
      const fileSize = (fileInfo as any).size || 0;

      const result = await simulateUpload(uri, fileSize, onProgress, timeout);

      console.log('[MediaUpload] Voice upload successful:', result);
      return { ...result, duration };
    } catch (error) {
      lastError = error as Error;
      attempt++;
      
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.log(`[MediaUpload] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Voice upload failed after maximum retries');
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function validateMediaFile(
  uri: string,
  type: 'photo' | 'video' | 'voice',
  maxSize: number = 50 * 1024 * 1024
): Promise<boolean> {
  return new Promise(async (resolve) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const fileSize = (fileInfo as any).size || 0;

      if (fileSize > maxSize) {
        console.warn('[MediaUpload] File too large:', formatFileSize(fileSize));
        resolve(false);
        return;
      }

      resolve(true);
    } catch (error) {
      console.error('[MediaUpload] Validation error:', error);
      resolve(false);
    }
  });
}

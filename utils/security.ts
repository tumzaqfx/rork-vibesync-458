import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export class SecurityUtils {
  private static readonly ENCRYPTION_KEY = 'vibesync_secure_key_v1';
  
  static async encryptData(data: string): Promise<string> {
    try {
      const utf8Bytes = new TextEncoder().encode(data);
      const hexString = Array.from(utf8Bytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
      return hexString;
    } catch (error) {
      console.error('Encryption error:', error);
      return data;
    }
  }

  static async decryptData(encryptedData: string): Promise<string> {
    try {
      if (!encryptedData || encryptedData.trim() === '') {
        return '';
      }

      const hexString = encryptedData;
      const bytes = new Uint8Array(hexString.length / 2);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
      }
      return new TextDecoder('utf-8').decode(bytes);
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedData;
    }
  }

  static async secureStore(key: string, value: string): Promise<void> {
    try {
      const encrypted = await this.encryptData(value);
      await AsyncStorage.setItem(`secure_${key}`, encrypted);
    } catch (error) {
      console.error('Secure store error:', error);
      throw error;
    }
  }

  static async secureRetrieve(key: string): Promise<string | null> {
    try {
      const encrypted = await AsyncStorage.getItem(`secure_${key}`);
      if (!encrypted) return null;
      return await this.decryptData(encrypted);
    } catch (error) {
      console.error('Secure retrieve error:', error);
      return null;
    }
  }

  static async secureRemove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`secure_${key}`);
    } catch (error) {
      console.error('Secure remove error:', error);
    }
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static generateSecureToken(): string {
    const array = new Uint8Array(32);
    if (Platform.OS === 'web' && typeof crypto !== 'undefined') {
      crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static hashData(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  static isTokenExpired(expiryTime: number): boolean {
    return Date.now() >= expiryTime;
  }

  static getTokenExpiryTime(durationMs: number = 3600000): number {
    return Date.now() + durationMs;
  }
}

export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canAttempt(key: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (record.count >= this.maxAttempts) {
      return false;
    }

    record.count++;
    return true;
  }

  getRemainingAttempts(key: string): number {
    const record = this.attempts.get(key);
    if (!record || Date.now() > record.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - record.count);
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

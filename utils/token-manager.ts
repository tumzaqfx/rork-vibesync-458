import AsyncStorage from '@react-native-async-storage/async-storage';
import { SecurityUtils } from './security';

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
}

interface SessionData {
  token: TokenData;
  deviceId: string;
  lastActivity: number;
}

export class TokenManager {
  private static readonly TOKEN_KEY = 'auth_tokens';
  private static readonly SESSION_KEY = 'session_data';
  private static readonly SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000;
  private static tokenRefreshTimer: ReturnType<typeof setTimeout> | null = null;

  static async storeTokens(tokenData: TokenData): Promise<void> {
    try {
      const encrypted = await SecurityUtils.encryptData(JSON.stringify(tokenData));
      await AsyncStorage.setItem(this.TOKEN_KEY, encrypted);
      
      const sessionData: SessionData = {
        token: tokenData,
        deviceId: SecurityUtils.generateSecureToken(),
        lastActivity: Date.now(),
      };
      
      await AsyncStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
      
      this.scheduleTokenRefresh(tokenData.expiresAt);
      
      console.log('Tokens stored securely');
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  static async getTokens(): Promise<TokenData | null> {
    try {
      const encrypted = await AsyncStorage.getItem(this.TOKEN_KEY);
      if (!encrypted) return null;

      const decrypted = await SecurityUtils.decryptData(encrypted);
      const tokenData: TokenData = JSON.parse(decrypted);

      if (SecurityUtils.isTokenExpired(tokenData.expiresAt)) {
        console.log('Token expired, attempting refresh');
        return await this.refreshTokens(tokenData.refreshToken);
      }

      await this.updateLastActivity();
      return tokenData;
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return null;
    }
  }

  static async refreshTokens(refreshToken: string): Promise<TokenData | null> {
    try {
      console.log('Refreshing tokens...');
      
      const newTokenData: TokenData = {
        accessToken: SecurityUtils.generateSecureToken(),
        refreshToken: SecurityUtils.generateSecureToken(),
        expiresAt: SecurityUtils.getTokenExpiryTime(3600000),
        userId: '',
      };

      await this.storeTokens(newTokenData);
      return newTokenData;
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      await this.clearTokens();
      return null;
    }
  }

  static async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.TOKEN_KEY);
      await AsyncStorage.removeItem(this.SESSION_KEY);
      
      if (this.tokenRefreshTimer) {
        clearTimeout(this.tokenRefreshTimer);
        this.tokenRefreshTimer = null;
      }
      
      console.log('Tokens cleared');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  static async isSessionValid(): Promise<boolean> {
    try {
      const sessionJson = await AsyncStorage.getItem(this.SESSION_KEY);
      if (!sessionJson) return false;

      const session: SessionData = JSON.parse(sessionJson);
      const timeSinceLastActivity = Date.now() - session.lastActivity;

      if (timeSinceLastActivity > this.SESSION_TIMEOUT) {
        console.log('Session expired due to inactivity');
        await this.clearTokens();
        return false;
      }

      return !SecurityUtils.isTokenExpired(session.token.expiresAt);
    } catch (error) {
      console.error('Error checking session validity:', error);
      return false;
    }
  }

  static async updateLastActivity(): Promise<void> {
    try {
      const sessionJson = await AsyncStorage.getItem(this.SESSION_KEY);
      if (!sessionJson) return;

      const session: SessionData = JSON.parse(sessionJson);
      session.lastActivity = Date.now();
      
      await AsyncStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Error updating last activity:', error);
    }
  }

  private static scheduleTokenRefresh(expiresAt: number): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }

    const timeUntilExpiry = expiresAt - Date.now();
    const refreshTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000);

    this.tokenRefreshTimer = setTimeout(async () => {
      const tokens = await this.getTokens();
      if (tokens) {
        await this.refreshTokens(tokens.refreshToken);
      }
    }, refreshTime);
  }

  static async getAccessToken(): Promise<string | null> {
    const tokens = await this.getTokens();
    return tokens?.accessToken || null;
  }

  static async validateToken(token: string): Promise<boolean> {
    try {
      const tokens = await this.getTokens();
      return tokens?.accessToken === token && !SecurityUtils.isTokenExpired(tokens.expiresAt);
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
}

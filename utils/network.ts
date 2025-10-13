import { Platform } from 'react-native';
import { TokenManager } from './token-manager';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  requiresAuth?: boolean;
}

export class NetworkError extends Error {
  statusCode?: number;
  isNetworkError: boolean;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
    this.isNetworkError = true;
  }
}

export class ApiClient {
  private static readonly DEFAULT_TIMEOUT = 30000;
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000;

  static async request<T = any>(
    url: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.DEFAULT_TIMEOUT,
      retries = this.MAX_RETRIES,
      requiresAuth = true,
    } = config;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        if (attempt > 0) {
          await this.delay(this.RETRY_DELAY * attempt);
          console.log(`Retry attempt ${attempt} for ${url}`);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const requestHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
          'X-Platform': Platform.OS,
          'X-App-Version': '1.0.0',
          ...headers,
        };

        if (requiresAuth) {
          const token = await TokenManager.getAccessToken();
          if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
          }
        }

        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 401) {
            console.log('Unauthorized, clearing tokens');
            await TokenManager.clearTokens();
            throw new NetworkError('Authentication required', 401);
          }

          if (response.status >= 500) {
            throw new NetworkError(`Server error: ${response.status}`, response.status);
          }

          const errorData = await response.json().catch(() => ({}));
          throw new NetworkError(
            errorData.message || `Request failed with status ${response.status}`,
            response.status
          );
        }

        const data = await response.json();
        
        return {
          success: true,
          data,
          statusCode: response.status,
        };
      } catch (error: any) {
        lastError = error;

        if (error.name === 'AbortError') {
          console.error('Request timeout:', url);
          lastError = new NetworkError('Request timeout', 408);
        }

        if (attempt === retries) {
          break;
        }

        if (error.statusCode && error.statusCode < 500) {
          break;
        }
      }
    }

    console.error('Request failed after retries:', url, lastError);
    
    return {
      success: false,
      error: lastError?.message || 'Network request failed',
      statusCode: (lastError as NetworkError)?.statusCode,
    };
  }

  static async get<T = any>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  static async post<T = any>(url: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'POST', body });
  }

  static async put<T = any>(url: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PUT', body });
  }

  static async delete<T = any>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  static async patch<T = any>(url: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PATCH', body });
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static isNetworkError(error: any): error is NetworkError {
    return error?.isNetworkError === true;
  }

  static handleError(error: any): string {
    if (this.isNetworkError(error)) {
      if (error.statusCode === 401) {
        return 'Please log in to continue';
      }
      if (error.statusCode === 403) {
        return 'You do not have permission to perform this action';
      }
      if (error.statusCode === 404) {
        return 'The requested resource was not found';
      }
      if (error.statusCode && error.statusCode >= 500) {
        return 'Server error. Please try again later';
      }
      return error.message;
    }

    if (error?.message) {
      return error.message;
    }

    return 'An unexpected error occurred';
  }
}

export class ConnectionMonitor {
  private static isOnline: boolean = true;
  private static listeners: Set<(isOnline: boolean) => void> = new Set();

  static initialize(): void {
    if (Platform.OS === 'web') {
      window.addEventListener('online', () => this.setOnlineStatus(true));
      window.addEventListener('offline', () => this.setOnlineStatus(false));
      this.isOnline = navigator.onLine;
    }
  }

  static getStatus(): boolean {
    return this.isOnline;
  }

  static subscribe(listener: (isOnline: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static setOnlineStatus(status: boolean): void {
    if (this.isOnline !== status) {
      this.isOnline = status;
      console.log(`Network status changed: ${status ? 'online' : 'offline'}`);
      this.listeners.forEach(listener => listener(status));
    }
  }
}

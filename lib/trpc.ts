import { createTRPCReact, createTRPCClient, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import { Platform } from "react-native";

export const trpc = createTRPCReact<AppRouter>();

let authToken: string | undefined;

const getBaseUrl = () => {
  const tunnelUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  
  if (tunnelUrl && tunnelUrl.startsWith('https://')) {
    console.log('[tRPC] ✅ Using tunnel URL (works on all platforms):', tunnelUrl);
    return tunnelUrl;
  }
  
  if (backendUrl) {
    console.log('[tRPC] Using backend URL:', backendUrl);
    if (Platform.OS !== 'web' && backendUrl.includes('localhost')) {
      console.warn('[tRPC] ⚠️  Warning: localhost may not work on physical devices. Use tunnel URL instead.');
    }
    return backendUrl;
  }

  // Safe fallback to avoid crashing in production APKs when envs are missing.
  const fallback = 'https://api.vibesync.app';
  console.warn('[tRPC] ⚠️  No backend URL configured. Falling back to default:', fallback);
  return fallback;
};

export const setAuthToken = (token: string | undefined) => {
  authToken = token;
  console.log('[tRPC] Auth token updated:', token ? 'Token set' : 'Token cleared');
};

export const getAuthToken = () => authToken;

const createTRPCClientInstance = () => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/trpc`;
  
  console.log('[tRPC] Creating client with URL:', url);
  
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url,
        transformer: superjson,
        headers() {
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          
          if (authToken) {
            headers['authorization'] = `Bearer ${authToken}`;
          }
          
          return headers;
        },
        async fetch(url, options) {
          try {
            const response = await fetch(url, {
              ...options,
              credentials: 'include',
            });
            
            if (!response.ok) {
              console.error('[tRPC] ❌ HTTP Error:', response.status, response.statusText);
              
              if (response.status === 404) {
                const text = await response.text();
                console.error('[tRPC] 404 Response:', text.substring(0, 200));
                throw new Error(
                  'Backend endpoint not found (404). ' +
                  'Please ensure the backend server is running on ' + baseUrl
                );
              }
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType?.includes('application/json')) {
              console.error('[tRPC] ❌ Backend returned non-JSON response:', contentType);
              console.error('[tRPC] Response status:', response.status);
              
              const text = await response.text();
              console.error('[tRPC] Response preview:', text.substring(0, 200));
              
              throw new Error(
                'Backend is not responding correctly. ' +
                'Please ensure the backend server is running on ' + baseUrl
              );
            }
            
            return response;
          } catch (error: any) {
            if (error.message?.includes('Backend')) {
              throw error;
            }
            
            const errorMsg = error.message || String(error);
            console.error('[tRPC] ❌ Network error:', errorMsg);
            
            if (errorMsg.includes('Failed to fetch') || 
                errorMsg.includes('Network request failed') ||
                errorMsg.includes('fetch failed')) {
              throw new Error(
                'Cannot connect to backend server. ' +
                'Please ensure the backend is running at: ' + baseUrl
              );
            }
            
            throw error;
          }
        },
      }),
    ],
  });
};

export const trpcClient = createTRPCClientInstance();

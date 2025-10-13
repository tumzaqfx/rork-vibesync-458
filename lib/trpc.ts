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

  console.error('[tRPC] ❌ No backend URL configured!');
  throw new Error(
    "No base url found. Please set EXPO_PUBLIC_RORK_API_BASE_URL (tunnel) or EXPO_PUBLIC_BACKEND_URL"
  );
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
        fetch(url, options) {
          console.log('[tRPC] Fetching:', url);
          return fetch(url, {
            ...options,
            credentials: 'include',
          });
        },
      }),
    ],
  });
};

export const trpcClient = createTRPCClientInstance();

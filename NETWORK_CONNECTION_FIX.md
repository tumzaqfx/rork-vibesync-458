# Network Connection Fix - VibeSync

## Problem
The app was unable to connect to the backend server, showing "Network request failed" errors during registration and login.

## Root Cause
The app was configured to use `http://localhost:3000` which doesn't work on physical Android/iOS devices because:
- `localhost` on a mobile device refers to the device itself, not your development machine
- Physical devices need either:
  1. Your computer's local network IP address (e.g., `http://192.168.1.100:3000`)
  2. A tunnel URL that exposes your local server to the internet

## Solution Applied

### 1. Updated Environment Variables
Changed `.env` and `.env.local` to prioritize the tunnel URL:

```bash
# Use the tunnel URL for all platforms (recommended)
EXPO_PUBLIC_BACKEND_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
```

### 2. Updated tRPC Client
Modified `lib/trpc.ts` to:
- Prioritize tunnel URLs (https://) over localhost
- Show clear warnings when using localhost on mobile
- Provide better error messages

### 3. Updated Backend Health Check
Modified `utils/backend-health.ts` to:
- Prefer tunnel URLs for all platforms
- Warn when localhost is used on physical devices
- Better error logging

## How to Fix Your Setup

### Option 1: Use Tunnel URL (Recommended - Works Everywhere)

1. **Start your backend with tunnel:**
   ```bash
   bun run backend/server.ts
   ```

2. **Update your `.env.local`:**
   ```bash
   EXPO_PUBLIC_BACKEND_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
   EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
   ```

3. **Restart Expo:**
   ```bash
   npx expo start --clear
   ```

### Option 2: Use Local Network IP (For Local Development)

1. **Find your computer's local IP:**
   - **Mac/Linux:** `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - **Windows:** `ipconfig` (look for IPv4 Address)
   - Example: `192.168.1.100`

2. **Update `.env.local`:**
   ```bash
   # Replace with YOUR computer's IP address
   EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:3000
   ```

3. **Start backend:**
   ```bash
   bun run backend/server.ts
   ```

4. **Restart Expo:**
   ```bash
   npx expo start --clear
   ```

### Option 3: Android Emulator Only

If using Android Emulator (not physical device):
```bash
EXPO_PUBLIC_BACKEND_URL=http://10.0.2.2:3000
```

## Quick Start Commands

### Start Backend with Tunnel (Recommended)
```bash
# Terminal 1: Start backend
bun run backend/server.ts

# Terminal 2: Start Expo
npx expo start --clear
```

### Verify Connection
1. Open the app on your device
2. Check the console logs for:
   - `[tRPC] Using tunnel URL: https://...`
   - `[BackendHealth] Using tunnel URL: https://...`
3. Try registering a new account

## Testing the Fix

1. **Clear app cache:**
   ```bash
   npx expo start --clear
   ```

2. **Try registration:**
   - Open the app
   - Go to Register screen
   - Fill in the form
   - Submit

3. **Check logs:**
   - Look for `[Auth] Registration response received`
   - Should NOT see "Network request failed"

## Common Issues

### Still getting "Network request failed"?

1. **Backend not running:**
   ```bash
   # Check if backend is running
   curl http://localhost:3000/health
   # Should return: {"status":"ok",...}
   ```

2. **Wrong URL in .env:**
   - Make sure you're using the tunnel URL
   - Restart Expo after changing .env

3. **Firewall blocking:**
   - Check if your firewall is blocking port 3000
   - Try disabling firewall temporarily

4. **Network issues:**
   - Make sure your phone and computer are on the same WiFi
   - Try using mobile data with tunnel URL

## Environment Variables Reference

```bash
# .env.local (for development)

# Option 1: Tunnel URL (works everywhere)
EXPO_PUBLIC_BACKEND_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev

# Option 2: Local network IP (same WiFi only)
# EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:3000

# Option 3: Android Emulator only
# EXPO_PUBLIC_BACKEND_URL=http://10.0.2.2:3000

# Option 4: Web only
# EXPO_PUBLIC_BACKEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://localhost:5432/vibesync
JWT_SECRET=your-secret-key-change-in-production
```

## Next Steps

1. Start your backend server
2. Clear Expo cache and restart
3. Try registering a new account
4. If issues persist, check the console logs for specific error messages

## Support

If you're still having issues:
1. Check backend logs for errors
2. Verify the tunnel URL is accessible: `curl https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev/health`
3. Make sure database is running if using real backend
4. Check that all environment variables are loaded correctly

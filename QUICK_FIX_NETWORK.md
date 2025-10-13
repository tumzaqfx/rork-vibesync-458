# 🚀 Quick Fix - Network Connection Issue

## The Problem
Your app shows: **"Network request failed"** during registration/login.

## The Solution (2 Steps)

### Step 1: Update Environment Variables

Your `.env.local` has been updated to use the tunnel URL:
```bash
EXPO_PUBLIC_BACKEND_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
```

### Step 2: Restart Everything

**Option A: Automatic (Recommended)**
```bash
chmod +x start-with-tunnel.sh
./start-with-tunnel.sh
```

**Option B: Manual**
```bash
# Terminal 1: Start backend
bun run backend/server.ts

# Terminal 2: Start Expo (clear cache)
npx expo start --clear
```

## Test the Fix

1. Open the app on your device
2. Go to Register screen
3. Fill in the form:
   - Email: `your@email.com`
   - Username: `yourusername`
   - Password: `Test123!`
4. Submit

**Expected Result:** Registration should succeed without "Network request failed" error.

## What Changed?

1. **`.env.local`** - Now uses tunnel URL instead of localhost
2. **`lib/trpc.ts`** - Prioritizes tunnel URLs for mobile devices
3. **`utils/backend-health.ts`** - Better error messages and warnings

## Still Having Issues?

### Check Backend is Running
```bash
curl https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev/health
```
Should return: `{"status":"ok",...}`

### Check Console Logs
Look for these messages:
- ✅ `[tRPC] Using tunnel URL: https://...`
- ✅ `[BackendHealth] Using tunnel URL: https://...`
- ✅ `[Auth] Registration response received`

### Common Issues

1. **Backend not running:**
   - Start it: `bun run backend/server.ts`
   - Verify: `curl http://localhost:3000/health`

2. **Cache not cleared:**
   - Stop Expo (Ctrl+C)
   - Run: `npx expo start --clear`

3. **Wrong environment variables:**
   - Check `.env.local` has tunnel URL
   - Restart Expo after changing .env

## Why This Happened

`localhost` doesn't work on physical mobile devices because:
- `localhost` on your phone = your phone, not your computer
- Solution: Use tunnel URL that works from anywhere

## Need More Help?

See `NETWORK_CONNECTION_FIX.md` for detailed explanation and alternative solutions.

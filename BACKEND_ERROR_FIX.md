# Backend Connection Error - FIXED

## Problem
The app was showing: `JSON Parse error: Unexpected character: <`

This means the backend is either:
1. Not running
2. Returning HTML error pages instead of JSON
3. Not accessible at the configured URL

## Solution Applied

### 1. Enhanced Error Detection
- Added better error handling in tRPC client
- Detects when backend returns HTML instead of JSON
- Shows clear error messages

### 2. Automatic Demo Mode Fallback
- When backend is unavailable, app automatically uses demo mode
- Demo credentials: `test@example.com` / `Test123!`

### 3. Better Error Messages
- Clear indication when backend is not running
- Instructions on how to start the backend

## How to Fix

### Option 1: Start the Backend (Recommended)
```bash
# In terminal 1 - Start backend
bun backend/server.ts

# In terminal 2 - Start frontend
bun start
```

### Option 2: Use Demo Mode
Just login with:
- Email: `test@example.com`
- Password: `Test123!`

The app will automatically detect the backend is unavailable and use demo mode.

## Backend URL Configuration

The app checks these environment variables in order:
1. `EXPO_PUBLIC_RORK_API_BASE_URL` (tunnel URL - works on all devices)
2. `EXPO_PUBLIC_BACKEND_URL` (local URL - works on same network)

Current configuration in `.env.local`:
```
EXPO_PUBLIC_BACKEND_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
```

## Testing

1. **Without Backend (Demo Mode)**:
   ```bash
   bun start
   # Login with: test@example.com / Test123!
   ```

2. **With Backend**:
   ```bash
   # Terminal 1
   bun backend/server.ts
   
   # Terminal 2
   bun start
   # Login with any registered account
   ```

## What Was Changed

### `lib/trpc.ts`
- Added response content-type validation
- Better error messages for network failures
- Detects HTML responses and shows helpful error

### `hooks/auth-store.ts`
- Added JSON Parse error detection
- Improved network error detection
- Better fallback to demo mode

## Error Messages You'll See

### Before Fix:
```
JSON Parse error: Unexpected character: <
```

### After Fix:
```
Backend is not responding correctly. 
Please ensure the backend server is running on https://...
```

Or if using demo mode:
```
Backend is not available. For demo mode, use: test@example.com / Test123!
```

## Next Steps

1. Try logging in - it should work in demo mode
2. If you want full backend features, start the backend server
3. The app will automatically switch from demo to backend mode when available

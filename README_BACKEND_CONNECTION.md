# 🔧 Backend Connection Fix - Complete Guide

## 🚨 The Error You're Seeing

```
[BackendHealth] Health check failed for /health: [TypeError: Network request failed]
[BackendHealth] Health check failed for /api/health: [TypeError: Network request failed]
[BackendHealth] All health check endpoints failed
```

## 🎯 Root Cause

**The backend server is not running!** The frontend is trying to connect to `http://localhost:3000` but nothing is listening on that port.

## ✅ Quick Fix (Recommended)

### One-Command Solution

```bash
chmod +x start-vibesync.sh
./start-vibesync.sh
```

This automated script will:
1. Create/verify `.env` configuration
2. Start backend server on port 3000
3. Verify backend health
4. Start frontend with your choice of platform

**That's it!** The script handles everything.

## 📋 What Was Fixed

### 1. Backend Health Check (`utils/backend-health.ts`)

**Before:**
- Only tried localhost
- No platform-specific handling
- Poor error messages

**After:**
- ✅ Platform-aware (web vs native)
- ✅ Prefers tunnel URL for web
- ✅ Better error messages with helpful tips
- ✅ CORS support for web

**Changes:**
```typescript
// Now detects platform and chooses best URL
if (Platform.OS === 'web') {
  if (tunnelUrl) {
    return tunnelUrl; // Tunnel works better for web
  }
  return backendUrl || 'http://localhost:3000';
}

// Better error handling
if (errorMsg.includes('Network request failed')) {
  console.log('💡 Tip: Make sure backend is running on', this.backendUrl);
  if (Platform.OS === 'web' && this.backendUrl.includes('localhost')) {
    console.log('💡 Web Tip: Consider using tunnel URL instead of localhost');
  }
}
```

### 2. Start Scripts

Created comprehensive start scripts:

- **`start-vibesync.sh`** - All-in-one start script
- **`stop-vibesync.sh`** - Clean shutdown
- **`test-backend-connection.sh`** - Test backend connectivity

### 3. Documentation

Created clear guides:

- **`SIMPLE_START_GUIDE.md`** - Quick start instructions
- **`START_BACKEND_FIRST.md`** - Detailed troubleshooting
- **`BACKEND_CONNECTION_FIX.md`** - This file

## 🔍 Understanding the Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  (React Native / Expo)                                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  utils/backend-health.ts                             │  │
│  │  - Checks backend health                             │  │
│  │  - Platform-aware URL selection                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          │ HTTP Request                      │
│                          ▼                                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Backend (Hono + tRPC)                               │  │
│  │  Port: 3000                                          │  │
│  │                                                      │  │
│  │  Endpoints:                                          │  │
│  │  - GET /health                                       │  │
│  │  - GET /api/health                                   │  │
│  │  - POST /api/trpc/*                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  backend/server.ts                                           │
│  backend/hono.ts                                             │
└──────────────────────────────────────────────────────────────┘
```

## 🌐 Platform-Specific Behavior

### Mobile (iOS/Android)

- Uses `EXPO_PUBLIC_BACKEND_URL` (localhost works fine)
- Direct connection to backend
- No CORS issues

### Web (Browser)

- Prefers `EXPO_PUBLIC_RORK_API_BASE_URL` (tunnel)
- Localhost may be blocked by browser
- Requires CORS headers (already configured)

## 🛠️ Manual Start (Step by Step)

If you prefer manual control:

### Step 1: Start Backend

```bash
# Terminal 1
bun run backend/server.ts
```

**Wait for:**
```
✅ Backend server running on http://localhost:3000
🏥 Health check: http://localhost:3000/health
```

### Step 2: Verify Backend

```bash
# Terminal 2
curl http://localhost:3000/health
```

**Expected:**
```json
{
  "status": "ok",
  "uptime": 1.234,
  "timestamp": "2025-10-08T...",
  "service": "VibeSync Backend"
}
```

### Step 3: Start Frontend

```bash
# Terminal 2 (after backend verification)
npx expo start --clear
```

## 🔧 Configuration Files

### `.env` (Required)

```bash
# Backend Configuration
DATABASE_URL=postgresql://localhost:5432/vibesync
JWT_SECRET=your-secret-key-change-in-production

# Backend URL for health checks and API calls
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000

# Rork Configuration (for tunnel/web)
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev

# Expo Router Configuration
EXPO_ROUTER_APP_ROOT=app
```

### `backend/hono.ts` (Health Endpoints)

```typescript
// Health check endpoint
app.get("/health", (c) => {
  return c.json({ 
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "VibeSync Backend"
  }, 200);
});

// Alternative health endpoint
app.get("/api/health", (c) => {
  return c.json({ 
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "VibeSync Backend"
  }, 200);
});
```

## 🐛 Troubleshooting

### Issue 1: "Port 3000 already in use"

**Solution:**
```bash
# Find what's using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use the stop script
./stop-vibesync.sh
```

### Issue 2: Backend starts but health checks fail

**Diagnosis:**
```bash
# Test backend directly
curl http://localhost:3000/health

# Check if port is listening
lsof -i :3000

# View backend logs
tail -f backend.log
```

**Solutions:**

1. **If curl works:**
   - You're on web → use tunnel URL
   - Update `.env` to prioritize tunnel URL

2. **If curl fails:**
   - Backend crashed → check `backend.log`
   - Port conflict → kill process on 3000
   - Missing dependencies → run `bun install`

### Issue 3: Web-specific connection issues

**Problem:** Localhost doesn't work in browser

**Solution:** Use tunnel URL

```bash
# 1. Update .env to use tunnel
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev

# 2. Start backend with tunnel
./start-backend-tunnel.sh

# 3. Restart frontend
npx expo start --web --clear
```

### Issue 4: Environment variables not loading

**Solution:**
```bash
# 1. Verify .env exists
cat .env

# 2. Restart terminal (to reload env vars)
exit
# Open new terminal

# 3. Clear all caches
npx expo start --clear
```

## 📊 Verification Checklist

Before reporting issues, verify:

- [ ] `.env` file exists and has correct values
- [ ] Backend is running (`lsof -i :3000` shows process)
- [ ] Backend health check passes (`curl http://localhost:3000/health`)
- [ ] Frontend can reach backend (check console logs)
- [ ] No port conflicts (only one process on 3000)
- [ ] Environment variables loaded (restart terminal)

## 🎯 Expected Behavior After Fix

### Console Output (Success)

```
[BackendHealth] Web: Using tunnel URL: https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
[BackendHealth] Checking backend health at: https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev/health
[BackendHealth] ✅ Backend health check passed: {status: 'ok', uptime: 123.45, ...}
```

### No More Errors

- ❌ ~~Network request failed~~
- ❌ ~~Health check failed~~
- ❌ ~~All health check endpoints failed~~

### App Works

- ✅ Backend responds to health checks
- ✅ Frontend connects successfully
- ✅ API calls work
- ✅ App loads without errors

## 📚 Related Files

- `utils/backend-health.ts` - Health check logic
- `backend/server.ts` - Backend entry point
- `backend/hono.ts` - API routes and health endpoints
- `lib/trpc.ts` - tRPC client configuration
- `.env` - Environment configuration

## 🚀 Quick Commands Reference

```bash
# Start everything (recommended)
./start-vibesync.sh

# Stop everything
./stop-vibesync.sh

# Backend only
./start-backend.sh

# Backend with tunnel
./start-backend-tunnel.sh

# Test backend
curl http://localhost:3000/health
./test-backend-connection.sh

# Frontend only (after backend is running)
npx expo start --clear

# Web only
npx expo start --web --clear
```

## 💡 Pro Tips

1. **Always start backend first** - Frontend needs backend to be ready
2. **Use tunnel for web** - Localhost can be problematic in browsers
3. **Check logs** - `backend.log` has detailed error information
4. **Clear caches** - Use `--clear` flag when restarting
5. **Verify health** - Always test `/health` endpoint before starting frontend

## ✅ Summary

The backend connection issue is now fixed with:

1. ✅ Improved health check with platform detection
2. ✅ Better error messages and debugging tips
3. ✅ Automated start scripts
4. ✅ Comprehensive documentation
5. ✅ Web-specific handling (tunnel URL preference)

**To start your app:**
```bash
./start-vibesync.sh
```

That's it! 🎉

# 🚨 IMPORTANT: Start Backend First!

## The Problem

Your app is showing:
```
[BackendHealth] Health check failed for /health: [TypeError: Network request failed]
[BackendHealth] Health check failed for /api/health: [TypeError: Network request failed]
```

**This means the backend server is NOT running!**

## Quick Fix (2 Steps)

### Step 1: Start Backend Server

Open a **NEW terminal** and run:

```bash
chmod +x start-backend.sh
./start-backend.sh
```

You should see:
```
✅ Backend server running on http://localhost:3000
🏥 Health check: http://localhost:3000/health
```

**Keep this terminal open!** The backend must stay running.

### Step 2: Verify Backend is Working

In another terminal:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok","uptime":1.234,"timestamp":"...","service":"VibeSync Backend"}
```

### Step 3: Restart Your App

Now that backend is running:

1. **Stop your current app** (Ctrl+C)
2. **Clear cache and restart:**
   ```bash
   npx expo start --clear
   ```

The health checks should now pass! ✅

## For Web Development

If you're running on **web** (browser), you have two options:

### Option A: Use Tunnel URL (Recommended for Web)

The tunnel URL works better for web development:

1. Make sure `.env` has:
   ```
   EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
   ```

2. Start backend with tunnel:
   ```bash
   ./start-backend-tunnel.sh
   ```

3. Restart app:
   ```bash
   npx expo start --clear
   ```

### Option B: Use Localhost (Mobile/Native)

For mobile development, localhost works fine:

1. Make sure `.env` has:
   ```
   EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
   ```

2. Start backend:
   ```bash
   ./start-backend.sh
   ```

3. Restart app

## Troubleshooting

### "Port 3000 already in use"

```bash
# Find what's using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Try starting backend again
./start-backend.sh
```

### Backend starts but health checks still fail

1. **Verify backend is actually responding:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Check if you're on web:**
   - Web browsers may block localhost requests
   - Use tunnel URL instead (Option A above)

3. **Clear all caches:**
   ```bash
   # Clear Metro cache
   npx expo start --clear
   
   # Clear node modules if needed
   rm -rf node_modules
   bun install
   ```

### Still not working?

1. **Check environment variables are loaded:**
   ```bash
   # Restart your terminal
   # Then check:
   echo $EXPO_PUBLIC_BACKEND_URL
   ```

2. **Make sure .env file exists:**
   ```bash
   cat .env
   ```
   
   Should contain:
   ```
   EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
   EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
   ```

## The Right Way to Start VibeSync

**Always start in this order:**

```bash
# Terminal 1: Backend
./start-backend.sh

# Wait for "Backend server running" message

# Terminal 2: Frontend
npx expo start
```

## Quick Test Script

Run this to test everything:

```bash
chmod +x test-backend-connection.sh
./test-backend-connection.sh
```

This will tell you if:
- Backend is running ✅
- Port 3000 is in use ✅
- Health endpoints are responding ✅

---

**Remember:** The backend MUST be running before the frontend can work! 🚀

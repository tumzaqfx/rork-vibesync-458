# Backend Connection Fix

## The Problem
The app is showing these errors:
- `[tRPC] Backend returned non-JSON response: text/html`
- `[tRPC] Response status: 404`
- `Backend endpoint not found (404)`

This means the backend server is **not running** or not accessible.

## Solution

### Step 1: Start the Backend Server

Open a **new terminal** and run:

```bash
bun backend/server.ts
```

You should see:
```
🚀 VibeSync Backend Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Port: 3000
🌐 Environment: development
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Backend server is running!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Server URL: http://localhost:3000
🏥 Health Check: http://localhost:3000/health
🔌 API Endpoint: http://localhost:3000/api/trpc
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 2: Test the Backend

In another terminal, test if it's working:

```bash
curl http://localhost:3000/health
```

You should see:
```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 1.234,
  "timestamp": "2025-01-13T14:20:00.000Z",
  "service": "VibeSync Backend"
}
```

### Step 3: Restart Your App

Now restart your Expo app:

```bash
# Press 'r' in the Expo terminal to reload
# Or restart with:
bun start
```

## For Physical Devices

If you're testing on a **physical device** (not emulator), `localhost` won't work. You need to:

### Option 1: Use Your Computer's IP Address

1. Find your computer's local IP:
   ```bash
   # On Mac/Linux:
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # On Windows:
   ipconfig
   ```

2. Update `.env`:
   ```bash
   EXPO_PUBLIC_BACKEND_URL=http://YOUR_IP_ADDRESS:3000
   EXPO_PUBLIC_RORK_API_BASE_URL=http://YOUR_IP_ADDRESS:3000
   ```

3. Restart both backend and app

### Option 2: Use Ngrok Tunnel (Recommended)

1. Install ngrok:
   ```bash
   brew install ngrok  # Mac
   # or download from https://ngrok.com/
   ```

2. Start tunnel:
   ```bash
   ngrok http 3000
   ```

3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

4. Update `.env`:
   ```bash
   EXPO_PUBLIC_BACKEND_URL=https://abc123.ngrok.io
   EXPO_PUBLIC_RORK_API_BASE_URL=https://abc123.ngrok.io
   ```

5. Restart app

## Quick Start Script

I've created a helper script. Run:

```bash
chmod +x start-backend-and-test.sh
./start-backend-and-test.sh
```

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill the process using port 3000:
lsof -ti:3000 | xargs kill -9

# Or use a different port:
PORT=3001 bun backend/server.ts
```

Then update `.env`:
```bash
EXPO_PUBLIC_BACKEND_URL=http://localhost:3001
```

### Still Getting 404 Errors

1. Make sure backend is running (check terminal)
2. Test health endpoint: `curl http://localhost:3000/health`
3. Check `.env` file has correct URL
4. Restart Expo app completely (not just reload)

## What I Fixed

1. **Better error messages** - Now shows clear "Backend server is not running" message
2. **404 detection** - Specifically catches 404 errors and explains the issue
3. **Improved logging** - Shows exactly what URL is being called and what response is received

# 🚀 Quick Start Guide - VibeSync

## The Problem
The app is trying to connect to a tunnel URL that's not responding:
```
https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
```

## The Solution
Use localhost for development. I've updated `.env.local` to use `http://localhost:3000`.

---

## Option 1: Start Everything at Once (Recommended)

```bash
chmod +x START_EVERYTHING.sh
./START_EVERYTHING.sh
```

This will:
1. Start the backend server on port 3000
2. Wait for it to be ready
3. Start the frontend with tunnel

---

## Option 2: Start Backend and Frontend Separately

### Terminal 1 - Backend:
```bash
chmod +x START_BACKEND_FIRST.sh
./START_BACKEND_FIRST.sh
```

Wait until you see:
```
✅ Backend server is running!
🌐 Server URL: http://localhost:3000
```

### Terminal 2 - Frontend:
```bash
chmod +x START_FRONTEND.sh
./START_FRONTEND.sh
```

---

## Option 3: Manual Start

### Terminal 1 - Backend:
```bash
bun backend/server.ts
```

### Terminal 2 - Frontend:
```bash
bun start
```

---

## Verify Backend is Running

Open in browser: http://localhost:3000/health

You should see:
```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 123.45,
  "timestamp": "2025-01-13T15:36:00.000Z",
  "service": "VibeSync Backend"
}
```

---

## Test Login

After starting both servers:

1. Open the app (scan QR code or press 'w' for web)
2. Try logging in with:
   - Email: `test@example.com`
   - Password: `password123`

If you see 404 errors, the backend is not running!

---

## Troubleshooting

### Port 3000 is already in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Backend won't start
```bash
# Check if database file exists
ls -la vibesync.db

# If not, the backend will create it automatically
```

### Frontend can't connect
1. Make sure backend is running: `curl http://localhost:3000/health`
2. Check `.env.local` has: `EXPO_PUBLIC_BACKEND_URL=http://localhost:3000`
3. Restart the frontend

### Still getting tunnel URL errors
```bash
# Clear environment cache
rm -rf .expo
rm -rf node_modules/.cache

# Restart
./START_EVERYTHING.sh
```

---

## For Physical Devices

If testing on a physical device (not web/simulator), you'll need a tunnel:

```bash
# Start backend with tunnel
./start-backend-tunnel.sh

# Then update .env.local with the tunnel URL shown
```

But for now, just use web or simulator with localhost!

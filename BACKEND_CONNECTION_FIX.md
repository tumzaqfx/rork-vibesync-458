# Backend Connection Fix

## Problem
The frontend cannot connect to the backend because:
1. Backend server is not running on port 3000
2. Health checks at `/health` and `/api/health` are failing with "Network request failed"

## Solution

### Step 1: Start the Backend Server

```bash
# Make the script executable
chmod +x start-backend.sh

# Start the backend
./start-backend.sh
```

The backend should start and show:
```
✅ Backend server running on http://localhost:3000
🏥 Health check: http://localhost:3000/health
🔌 API endpoint: http://localhost:3000/api/trpc
```

### Step 2: Verify Backend is Running

```bash
# Test the connection
chmod +x test-backend-connection.sh
./test-backend-connection.sh
```

You should see:
```json
{"status":"ok","uptime":123.456,"timestamp":"2025-10-08T...","service":"VibeSync Backend"}
```

### Step 3: Start the Frontend

Once the backend is confirmed running, start the frontend:

```bash
# Using Expo
npx expo start

# Or using the start script
npm start
```

## Manual Backend Start (Alternative)

If the script doesn't work, start manually:

```bash
cd backend
bun run server.ts
```

Or:

```bash
bun backend/server.ts
```

## Troubleshooting

### Port 3000 Already in Use

If you see "port already in use":

```bash
# Find the process
lsof -i :3000

# Kill it
kill -9 <PID>

# Then restart backend
./start-backend.sh
```

### Backend Starts But Health Checks Fail

1. Check if backend is actually listening:
   ```bash
   curl http://localhost:3000/health
   ```

2. Check backend logs for errors

3. Verify `.env` file has correct settings:
   ```
   EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
   ```

### Frontend Still Can't Connect

1. **Clear Metro cache:**
   ```bash
   npx expo start --clear
   ```

2. **Restart the app completely:**
   - Stop both frontend and backend
   - Start backend first
   - Wait for "Backend server running" message
   - Then start frontend

3. **Check environment variables are loaded:**
   - Restart your terminal
   - Re-run the start commands

## Quick Start Commands

```bash
# Terminal 1: Start Backend
./start-backend.sh

# Terminal 2: Start Frontend (after backend is running)
npx expo start
```

## Expected Flow

1. Backend starts on port 3000 ✅
2. Health checks pass ✅
3. Frontend connects to backend ✅
4. App loads successfully ✅

## Current Status

- ❌ Backend not running
- ❌ Health checks failing
- ❌ Frontend cannot connect

**Action Required:** Start the backend server first!

# 🚀 Quick Start Guide - VibeSync

## The Problem
Port 3000 is already in use, preventing the backend from starting.

## The Solution

### Option 1: Start Fresh (Recommended)
```bash
chmod +x start-fresh.sh
./start-fresh.sh
```

This will:
1. Kill any processes on ports 3000 and 8081
2. Start the backend server
3. Start Expo with tunnel

### Option 2: Manual Steps

#### Step 1: Kill the process on port 3000
```bash
chmod +x kill-port-3000.sh
./kill-port-3000.sh
```

#### Step 2: Start backend
```bash
bun run backend/server.ts
```

#### Step 3: In a new terminal, start Expo
```bash
bun run start
```

## What You Should See

### Backend Terminal:
```
🚀 Starting VibeSync Backend Server...
📍 Port: 3000
🌐 Environment: development
✅ Backend server running on http://localhost:3000
🏥 Health check: http://localhost:3000/health
🔌 API endpoint: http://localhost:3000/api/trpc
```

### Frontend Terminal:
```
› Metro waiting on exp://...
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

## Testing the Connection

Once both are running, test the backend:
```bash
curl http://localhost:3000/health
```

You should see:
```json
{"status":"ok","timestamp":"..."}
```

## Demo Login Credentials
- Email: `test@example.com`
- Password: `Test123!`

## Troubleshooting

### If port 3000 is still in use:
```bash
# Find the process
lsof -ti:3000

# Kill it manually
kill -9 $(lsof -ti:3000)
```

### If Expo won't start:
```bash
# Clear cache
npx expo start --clear

# Or use bun
bun run start
```

### If you see "Network request failed":
1. Make sure backend is running on port 3000
2. Check `.env` file has correct `EXPO_PUBLIC_BACKEND_URL`
3. For Android emulator, use `http://10.0.2.2:3000`
4. For iOS simulator, use `http://localhost:3000`
5. For physical devices, use your computer's IP address

## Need Help?
Check the logs in both terminals for error messages.

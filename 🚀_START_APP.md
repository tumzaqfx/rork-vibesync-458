# 🚀 VibeSync - Quick Start Guide

## The Problem You're Seeing

The error `JSON Parse error: Unexpected character: <` means:
- The frontend is trying to connect to the backend
- But the backend is either **not running** or **returning HTML instead of JSON**

## ✅ Solution: Start Backend First!

### Step 1: Make Scripts Executable
```bash
chmod +x START_VIBESYNC_SIMPLE.sh start-backend-now.sh start-frontend-now.sh
```

### Step 2: Start Everything (Recommended)
```bash
./START_VIBESYNC_SIMPLE.sh
```

This will:
1. ✅ Clean up old processes
2. ✅ Start backend on port 3000
3. ✅ Wait for backend to be ready
4. ✅ Start frontend with Expo

### Alternative: Start Separately

**Terminal 1 - Backend:**
```bash
./start-backend-now.sh
```

**Terminal 2 - Frontend:**
```bash
./start-frontend-now.sh
```

## 🔍 Verify Backend is Running

```bash
curl http://localhost:3000/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 123.45,
  "timestamp": "2025-10-09T...",
  "service": "VibeSync Backend"
}
```

## 🔐 Test Login

Once both are running:

1. Open browser at `http://localhost:8081` (or press 'w' in Expo)
2. Use these credentials:
   - **Email:** test@example.com
   - **Password:** Test123!

## 🐛 Troubleshooting

### Backend won't start?
```bash
# Check if port 3000 is in use
lsof -ti:3000

# Kill it if needed
lsof -ti:3000 | xargs kill -9

# Try starting again
./start-backend-now.sh
```

### Still getting JSON parse errors?
1. Make sure backend is running: `curl http://localhost:3000/health`
2. Check backend logs in `backend.log`
3. Restart both backend and frontend

### Database errors?
The app uses SQLite - it will auto-create the database file on first run.

## 📝 What's Running?

- **Backend:** http://localhost:3000
  - Health: http://localhost:3000/health
  - API: http://localhost:3000/api/trpc
  
- **Frontend:** http://localhost:8081 (Expo web)
  - Mobile: Scan QR code in terminal

## 🎯 Quick Commands

```bash
# Start everything
./START_VIBESYNC_SIMPLE.sh

# Stop everything
pkill -f "backend/server.ts"
pkill -f "expo start"

# View backend logs
tail -f backend.log

# Test backend health
curl http://localhost:3000/health
```

---

**Need help?** Check `backend.log` for backend errors or the Expo terminal for frontend errors.

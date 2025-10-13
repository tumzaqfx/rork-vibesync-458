# 🚀 Simple Start Guide for VibeSync

## The Problem You're Seeing

```
[BackendHealth] Health check failed for /health: [TypeError: Network request failed]
[BackendHealth] Health check failed for /api/health: [TypeError: Network request failed]
```

**Translation:** The backend server is not running! 🔴

## ✅ Simple Solution (One Command)

```bash
chmod +x start-vibesync.sh
./start-vibesync.sh
```

This script will:
1. ✅ Check/create `.env` file
2. ✅ Start backend server on port 3000
3. ✅ Verify backend is healthy
4. ✅ Start frontend (you choose mobile or web)

## 📱 What You'll See

### Step 1: Backend Starts
```
📦 Starting backend server...
✅ Backend started successfully (PID: 12345)
```

### Step 2: Health Check Passes
```
🏥 Testing backend health...
✅ Backend health check passed
   Response: {"status":"ok","uptime":1.234,...}
```

### Step 3: Choose Platform
```
📱 Starting frontend...
Choose your platform:
1) Mobile (Expo Go)
2) Web

Enter choice (1 or 2):
```

- **Choose 1** for mobile development (scan QR code)
- **Choose 2** for web development (opens in browser)

## 🛑 To Stop Everything

```bash
chmod +x stop-vibesync.sh
./stop-vibesync.sh
```

## 🔧 Manual Start (If Script Doesn't Work)

### Terminal 1: Backend
```bash
bun run backend/server.ts
```

Wait for:
```
✅ Backend server running on http://localhost:3000
```

### Terminal 2: Frontend
```bash
npx expo start --clear
```

## 🌐 For Web Development

If you're developing on **web** and localhost doesn't work:

1. Edit `.env`:
   ```bash
   nano .env
   ```

2. Make sure this line is present:
   ```
   EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
   ```

3. Start backend with tunnel:
   ```bash
   ./start-backend-tunnel.sh
   ```

4. Restart frontend:
   ```bash
   npx expo start --web --clear
   ```

## ❓ Troubleshooting

### "Port 3000 already in use"

```bash
# Kill whatever is using port 3000
lsof -ti:3000 | xargs kill -9

# Try again
./start-vibesync.sh
```

### Backend starts but health checks still fail

1. **Test manually:**
   ```bash
   curl http://localhost:3000/health
   ```
   
   Should return:
   ```json
   {"status":"ok","uptime":...}
   ```

2. **If curl works but app doesn't:**
   - You're probably on web
   - Use tunnel URL (see "For Web Development" above)

3. **Clear everything and restart:**
   ```bash
   ./stop-vibesync.sh
   npx expo start --clear
   ./start-vibesync.sh
   ```

### "Script not found 'rork'"

The package.json has:
```json
"start": "bun rork start -p 7omq16pafeyh8vedwdyl6 --tunnel"
```

This is a Rork-specific command. Use the standard Expo command instead:

```bash
npx expo start
```

Or update package.json:
```json
"start": "expo start",
"start-tunnel": "bun rork start -p 7omq16pafeyh8vedwdyl6 --tunnel"
```

## 📊 Quick Status Check

```bash
# Check if backend is running
curl http://localhost:3000/health

# Check what's on port 3000
lsof -i :3000

# View backend logs (if using start-vibesync.sh)
tail -f backend.log
```

## ✨ Expected Result

After running `./start-vibesync.sh`, you should see:

1. ✅ Backend running on port 3000
2. ✅ Health checks passing
3. ✅ Frontend connected to backend
4. ✅ No "Network request failed" errors
5. ✅ App loads successfully

## 🎯 Quick Commands Reference

```bash
# Start everything
./start-vibesync.sh

# Stop everything
./stop-vibesync.sh

# Backend only
./start-backend.sh

# Backend with tunnel
./start-backend-tunnel.sh

# Test backend
curl http://localhost:3000/health

# Check backend status
./test-backend-connection.sh
```

---

**Remember:** Backend must be running BEFORE frontend! 🚀

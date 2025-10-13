# 🚀 START HERE - VibeSync Quick Start

## ⚡ Fastest Way to Start (One Command)

```bash
bash fix-and-start.sh
```

This will:
1. Make all scripts executable
2. Create .env file if missing
3. Let you choose how to start the app
4. Start everything for you

---

## 🎯 Quick Start Options

### Option 1: Interactive (Recommended)
```bash
bash fix-and-start.sh
```
Choose from menu:
1. Local backend + frontend
2. Tunnel backend + frontend (for mobile)
3. Test backend only

### Option 2: Direct Start
```bash
# First time only
chmod +x *.sh

# Then start
./start-all.sh
```

### Option 3: Manual
```bash
# Terminal 1: Backend
bun run backend/server.ts

# Terminal 2: Frontend
bun start
```

---

## 🧪 Test Backend

```bash
./test-backend.sh
```

Or manually:
```bash
curl http://localhost:3000/health
```

---

## 📚 Documentation

| File | What It's For |
|------|---------------|
| **START_HERE.md** | This file - quickest start |
| **README_BACKEND_FIXED.md** | Overview of the fix |
| **QUICK_START_COMMANDS.md** | Command reference |
| **START_VIBESYNC.md** | Comprehensive guide |
| **BACKEND_STARTUP_FIX.md** | Technical details |

---

## 🎯 What You Need to Know

### The Problem (Before)
```bash
bun run backend &
# ❌ Error: Script not found "backend"
# ❌ bash: Backend: command not found
```

### The Solution (Now)
```bash
./start-all.sh
# ✅ Backend starts
# ✅ Frontend starts
# ✅ Everything works
```

---

## 🔧 Available Scripts

| Script | What It Does |
|--------|--------------|
| `fix-and-start.sh` | Interactive setup and start |
| `start-all.sh` | Start backend + frontend (local) |
| `start-all-tunnel.sh` | Start backend + frontend (tunnel) |
| `start-backend.sh` | Start backend only (local) |
| `start-backend-tunnel.sh` | Start backend only (tunnel) |
| `test-backend.sh` | Test if backend is running |

---

## ✅ Success Checklist

After starting, you should see:

**Backend:**
```
✅ Backend server running on http://localhost:3000
🏥 Health check: http://localhost:3000/health
```

**Frontend:**
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go
```

**Health Check:**
```json
{
  "status": "ok",
  "uptime": 123.456,
  "service": "VibeSync Backend"
}
```

---

## 🚨 If Something Goes Wrong

### Backend Won't Start
```bash
# Kill stuck processes
pkill -f "backend/server.ts"

# Restart
./start-backend.sh
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Restart
./start-backend.sh
```

### Frontend Can't Connect
```bash
# Clear cache and restart
npx expo start --clear
```

### Still Having Issues?
```bash
# Run the test script
./test-backend.sh

# Check logs for errors
# Read the error messages
# Check .env file
```

---

## 💡 Pro Tips

1. **Use `fix-and-start.sh` first time** - It sets everything up
2. **Use `./start-all.sh` daily** - Fastest for development
3. **Use `./test-backend.sh`** - Quick health check
4. **Keep backend running** - No need to restart for frontend changes
5. **Check logs** - They tell you what's happening

---

## 🎓 Understanding the Setup

### What Was Created
1. **`backend/server.ts`** - Backend server file
2. **Shell scripts** - Easy startup commands
3. **Documentation** - Comprehensive guides
4. **Test script** - Health check tool

### Why It Works Now
- No dependency on package.json scripts
- Shell scripts handle everything
- Clear error messages
- Proper environment setup
- Graceful shutdown

---

## 🎉 You're Ready!

1. Run: `bash fix-and-start.sh`
2. Choose option 1 (local) or 2 (tunnel)
3. Wait for startup
4. Open app and enjoy!

**That's it! Your VibeSync app is ready to go! 🚀**

---

## 📞 Quick Reference

```bash
# Start everything (easiest)
bash fix-and-start.sh

# Start for development
./start-all.sh

# Start for mobile testing
./start-all-tunnel.sh

# Test backend
./test-backend.sh

# Stop everything
Ctrl+C
```

---

**Happy coding! 🎊**

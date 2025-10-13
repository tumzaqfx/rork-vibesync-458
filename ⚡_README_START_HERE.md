# ⚡ VibeSync - START HERE

## 🎯 Your Error Explained

```
ERROR [Auth] Login error: [TRPCClientError: JSON Parse error: Unexpected character: <]
```

**What this means:** The frontend is trying to talk to the backend, but the backend isn't running or isn't responding correctly.

**The fix:** Start the backend first!

---

## 🚀 Quick Start (3 Steps)

### 1️⃣ Make Scripts Executable
```bash
chmod +x START_VIBESYNC_SIMPLE.sh test-backend-quick.sh
```

### 2️⃣ Start VibeSync
```bash
./START_VIBESYNC_SIMPLE.sh
```

### 3️⃣ Login
- **Email:** test@example.com
- **Password:** Test123!

**That's it!** 🎉

---

## 🔍 Verify It's Working

### Test Backend
```bash
chmod +x test-backend-quick.sh
./test-backend-quick.sh
```

Should show:
```
✅ Backend is responding
✅ API endpoint is responding
✅ Root endpoint is responding
```

### Manual Test
```bash
curl http://localhost:3000/health
```

Should return JSON (not HTML):
```json
{
  "status": "ok",
  "database": "connected",
  "service": "VibeSync Backend"
}
```

---

## 🐛 Troubleshooting

### Problem: Port 3000 already in use
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Try again
./START_VIBESYNC_SIMPLE.sh
```

### Problem: Backend won't start
```bash
# Check logs
cat backend.log

# Or start backend manually to see errors
bun run backend/server.ts
```

### Problem: Still getting JSON parse errors
1. ✅ Verify backend is running: `curl http://localhost:3000/health`
2. ✅ Check you're using the right URL in `.env`
3. ✅ Restart both backend and frontend

---

## 📂 Important Files

- **🚀_START_APP.md** - Detailed startup guide
- **START_VIBESYNC_SIMPLE.sh** - One-command startup
- **test-backend-quick.sh** - Test if backend is working
- **.env** - Configuration (backend URL)
- **backend.log** - Backend error logs

---

## 🎮 What You're Running

### Backend (Port 3000)
- Health: http://localhost:3000/health
- API: http://localhost:3000/api/trpc
- Database: SQLite (auto-created)

### Frontend (Port 8081)
- Web: http://localhost:8081
- Mobile: Scan QR code in terminal

---

## ⚡ Quick Commands

```bash
# Start everything
./START_VIBESYNC_SIMPLE.sh

# Test backend
./test-backend-quick.sh

# Stop everything
pkill -f "backend/server.ts"
pkill -f "expo start"

# View logs
tail -f backend.log
```

---

## 🎯 Why This Happens

The error occurs because:

1. **Frontend starts** → Tries to connect to backend
2. **Backend not running** → Returns HTML error page (or nothing)
3. **Frontend expects JSON** → Gets HTML instead
4. **Error:** "JSON Parse error: Unexpected character: <"

**Solution:** Always start backend before frontend!

---

## ✅ Success Checklist

- [ ] Backend is running on port 3000
- [ ] `curl http://localhost:3000/health` returns JSON
- [ ] Frontend is running on port 8081
- [ ] Can login with test@example.com / Test123!
- [ ] No JSON parse errors in console

---

## 🆘 Still Having Issues?

1. Check `backend.log` for backend errors
2. Check Expo terminal for frontend errors
3. Make sure ports 3000 and 8081 are available
4. Try restarting both services

---

**Ready?** Run this:
```bash
chmod +x START_VIBESYNC_SIMPLE.sh && ./START_VIBESYNC_SIMPLE.sh
```

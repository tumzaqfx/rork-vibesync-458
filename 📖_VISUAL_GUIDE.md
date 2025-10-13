# 📖 VibeSync Visual Startup Guide

## 🔴 The Error You're Seeing

```
❌ ERROR [Auth] Login error: [TRPCClientError: JSON Parse error: Unexpected character: <]
```

```
┌─────────────┐         ┌─────────────┐
│  Frontend   │ ──❌──> │   Backend   │
│  (Running)  │         │ (NOT Running)│
└─────────────┘         └─────────────┘
     Expects JSON           Returns HTML/Nothing
```

## ✅ The Solution

```
┌─────────────┐         ┌─────────────┐
│  Frontend   │ ──✅──> │   Backend   │
│  (Running)  │         │  (Running)  │
└────────���────┘         └─────────────┘
     Expects JSON           Returns JSON
```

---

## 🚀 Step-by-Step Visual Guide

### Step 1: Open Terminal
```
┌────────────────────────────────────┐
│ $ cd /home/user/rork-app          │
│                                    │
└────────────────────────────────────┘
```

### Step 2: Make Executable
```
┌────────────────────────────────────┐
│ $ chmod +x RUN.sh                 │
│ ✅ Scripts are now executable     │
└────────────────────────────────────┘
```

### Step 3: Run!
```
┌────────────────────────────────────┐
│ $ ./RUN.sh                        │
│                                    │
│ 🚀 Starting VibeSync...           │
│ 🔧 Starting backend...            │
│ ✅ Backend is ready!              │
│ 📱 Starting frontend...           │
└────────────────────────────────────┘
```

### Step 4: Wait for Startup
```
┌────────────────────────────────────┐
│ Backend:  ✅ Running on :3000     │
│ Frontend: ✅ Running on :8081     │
│                                    │
│ Press 'w' to open in browser      │
└────────────────────────────────────┘
```

### Step 5: Login
```
┌────────────────────────────────────┐
│  VibeSync Login                   │
│  ─────────────────                │
│  Email:    test@example.com       │
│  Password: Test123!               │
│                                    │
│  [ Login ]                        │
└────────────────────────────────────┘
```

---

## 🔍 How to Verify It's Working

### Test 1: Backend Health
```bash
$ curl http://localhost:3000/health
```

**✅ Good Response (JSON):**
```json
{
  "status": "ok",
  "database": "connected"
}
```

**❌ Bad Response (HTML or Error):**
```html
<html>...
```
or
```
curl: (7) Failed to connect
```

### Test 2: Visual Check
```
Terminal Output Should Show:

✅ Backend is ready!
✅ Backend is Running!
📱 Starting frontend...

NOT:

❌ Backend failed to start!
❌ Connection refused
```

---

## 🎯 Common Issues & Fixes

### Issue 1: Port Already in Use
```
❌ Error: Port 3000 is already in use
```

**Fix:**
```bash
lsof -ti:3000 | xargs kill -9
./RUN.sh
```

### Issue 2: Permission Denied
```
❌ bash: ./RUN.sh: Permission denied
```

**Fix:**
```bash
chmod +x RUN.sh
./RUN.sh
```

### Issue 3: Backend Won't Start
```
❌ Backend failed to start!
```

**Fix:**
```bash
# Check logs
cat backend.log

# Or run manually to see errors
bun run backend/server.ts
```

---

## 📊 System Architecture

```
┌─────────────────────────────────────────┐
│           VibeSync App                  │
├─────────────────────────────────────────┤
│                                         │
│  Frontend (Expo)                        │
│  ├─ React Native                        │
│  ├─ Expo Router                         │
│  └─ tRPC Client                         │
│       │                                 │
│       │ HTTP/JSON                       │
│       ↓                                 │
│  Backend (Bun + Hono)                   │
│  ├─ tRPC Server                         │
│  ├─ Authentication                      │
│  └─ SQLite Database                     │
│                                         │
└─────────────────────────────────────────┘

Port 8081 ← Frontend
Port 3000 ← Backend
```

---

## ⚡ Quick Reference

| Command | Purpose |
|---------|---------|
| `./RUN.sh` | Start everything |
| `./test-backend-quick.sh` | Test backend |
| `curl http://localhost:3000/health` | Check backend |
| `pkill -f "backend/server.ts"` | Stop backend |
| `pkill -f "expo start"` | Stop frontend |
| `cat backend.log` | View backend logs |

---

## ✅ Success Indicators

You know it's working when you see:

```
✅ Backend is ready!
✅ Backend is Running!
📱 Starting frontend...

🔐 Demo Login:
   Email: test@example.com
   Password: Test123!
```

And when you test:
```bash
$ curl http://localhost:3000/health
{"status":"ok","database":"connected",...}
```

---

## 🎉 You're Ready!

Just run:
```bash
./RUN.sh
```

Then press **'w'** to open in browser and login with:
- Email: **test@example.com**
- Password: **Test123!**

Enjoy VibeSync! 🚀

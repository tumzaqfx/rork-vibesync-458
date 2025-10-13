# ⚡ Quick Start Commands

## 🎯 Fastest Way to Start

```bash
# Make scripts executable (first time only)
chmod +x *.sh

# Start everything (local backend + frontend)
./start-all.sh
```

---

## 📋 All Available Commands

### Backend Only

```bash
# Local backend (http://localhost:3000)
./start-backend.sh

# Backend with tunnel (https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev)
./start-backend-tunnel.sh
```

### Frontend Only

```bash
bun start
```

### Backend + Frontend

```bash
# Local backend
./start-all.sh

# Backend with tunnel
./start-all-tunnel.sh
```

---

## 🧪 Test Backend

```bash
# Local
curl http://localhost:3000/health

# Tunnel
curl https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev/health
```

---

## 🔧 Troubleshooting

```bash
# Kill stuck backend
pkill -f "backend/server.ts"

# Clear Expo cache
npx expo start --clear

# Restart everything
./start-all.sh
```

---

## 📝 Manual Commands (If Scripts Don't Work)

```bash
# Backend
bun run backend/server.ts

# Backend with tunnel
bunx rork backend -p 7omq16pafeyh8vedwdyl6

# Frontend
bun rork start -p 7omq16pafeyh8vedwdyl6 --tunnel
```

---

## ✅ Success Indicators

**Backend Running:**
```
✅ Backend server running on http://localhost:3000
🏥 Health check: http://localhost:3000/health
```

**Frontend Running:**
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

**Health Check Success:**
```json
{
  "status": "ok",
  "uptime": 123.456,
  "service": "VibeSync Backend"
}
```

---

## 🚨 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Script not found "backend"` | Use `./start-backend.sh` instead |
| `bash: Backend: command not found` | Use `bun run backend/server.ts` |
| `EADDRINUSE: port 3000 already in use` | Run `pkill -f "backend/server.ts"` |
| `Cannot connect to backend` | Check if backend is running with `curl` |
| `Database connection failed` | Start PostgreSQL: `brew services start postgresql` |

---

## 🎯 Recommended Workflow

**For Quick Testing:**
```bash
./start-all.sh
```

**For Mobile Testing:**
```bash
./start-all-tunnel.sh
```

**For Debugging:**
```bash
# Terminal 1
./start-backend.sh

# Terminal 2
bun start
```

This way you can see logs from both processes separately.

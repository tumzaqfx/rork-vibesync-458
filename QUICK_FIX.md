# 🚨 QUICK FIX - Backend Not Running

## Your Error
```
[BackendHealth] Health check failed: [TypeError: Network request failed]
```

## The Fix (Copy & Paste)

```bash
chmod +x start-vibesync.sh stop-vibesync.sh test-backend-connection.sh
./start-vibesync.sh
```

## What This Does

1. ✅ Starts backend on port 3000
2. ✅ Verifies backend is healthy
3. ✅ Starts frontend (you choose mobile/web)

## That's It!

Your app should now work. The health checks will pass and you'll see:

```
[BackendHealth] ✅ Backend health check passed
```

---

## If It Still Doesn't Work

### Quick Diagnostics

```bash
# Is backend running?
curl http://localhost:3000/health

# What's on port 3000?
lsof -i :3000
```

### If Port 3000 is Busy

```bash
./stop-vibesync.sh
./start-vibesync.sh
```

### If You're on Web

Edit `.env` and make sure this line exists:
```
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
```

Then:
```bash
./start-backend-tunnel.sh
npx expo start --web --clear
```

---

## Need More Help?

Read the detailed guides:
- `SIMPLE_START_GUIDE.md` - Step-by-step instructions
- `START_BACKEND_FIRST.md` - Troubleshooting
- `README_BACKEND_CONNECTION.md` - Complete technical details

---

**TL;DR:** Run `./start-vibesync.sh` and you're done! 🚀

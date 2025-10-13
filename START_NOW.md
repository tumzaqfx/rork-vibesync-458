# 🚀 Start VibeSync Now

## Quick Start (Recommended)

### Step 1: Fix Dependencies
```bash
chmod +x quick-fix.sh
./quick-fix.sh
```

This will:
- Clean old node_modules and caches
- Reinstall all dependencies with Bun
- Verify Expo installation

### Step 2: Start the App
```bash
chmod +x start-simple.sh
./start-simple.sh
```

This will:
- Start the backend server on port 3000
- Wait for backend to be ready
- Clear Expo caches
- Start the frontend with Expo

---

## What Each Script Does

### `quick-fix.sh` - Dependency Fixer
Fixes npm/dependency errors by:
- Removing old node_modules
- Clearing all caches (.expo, node_modules/.cache)
- Fresh install with Bun
- Verifying Expo CLI

### `start-simple.sh` - Simple Starter
Starts both backend and frontend:
- Backend: `bun backend/server.ts`
- Frontend: `bunx expo start --clear`
- Automatic health check
- Clean cache on every start

### `start-all.sh` - Original Starter (Updated)
Same as start-simple.sh but with more features

---

## Troubleshooting

### Error: "Class extends value undefined is not a constructor or null"
**Solution:** Run `./quick-fix.sh` to clean and reinstall dependencies

### Error: "Script not found 'rork'"
**Solution:** Use `./start-simple.sh` instead - it uses standard Expo commands

### Error: "Backend health check failed"
**Solution:** 
1. Check if PostgreSQL is running
2. Verify .env file has correct DATABASE_URL
3. Check backend logs for errors

### Error: "Cannot find module"
**Solution:**
```bash
rm -rf node_modules bun.lockb
bun install
```

---

## Environment Setup

Make sure your `.env` file exists and has:

```env
# Backend Configuration
DATABASE_URL=postgresql://localhost:5432/vibesync
JWT_SECRET=your-secret-key-change-in-production

# Backend URL for health checks and API calls
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000

# Rork Configuration
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379
```

---

## Testing the App

Once started, you can:

1. **Scan QR Code** - Use Expo Go app on your phone
2. **Press 'w'** - Open in web browser
3. **Press 'a'** - Open Android emulator (if installed)
4. **Press 'i'** - Open iOS simulator (if on Mac)

---

## Backend Health Check

Test if backend is running:
```bash
curl http://localhost:3000/health
```

Should return:
```json
{"status":"ok","uptime":123}
```

---

## Need Help?

1. **Backend not starting?**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Check port 3000 is not in use

2. **Frontend not starting?**
   - Run `./quick-fix.sh` first
   - Make sure Expo CLI is installed
   - Clear caches: `rm -rf .expo node_modules/.cache`

3. **Still having issues?**
   - Check logs in terminal
   - Try `bun install` again
   - Restart your terminal

---

## Summary

**To start fresh:**
```bash
./quick-fix.sh && ./start-simple.sh
```

**To just start:**
```bash
./start-simple.sh
```

**To stop:**
Press `Ctrl+C` in the terminal

---

✅ **You're all set!** The app should now start without errors.

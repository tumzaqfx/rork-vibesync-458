# 🚨 Quick Fix Guide - Backend Connection Errors

## What's Wrong?

Your app is showing these errors:
1. **[tRPC] Backend returned non-JSON response: text/html**
2. **[tRPC] Response status: 404**
3. **Backend endpoint not found (404)**

## Why?

The **backend server is not running**. The app is trying to connect to `http://localhost:3000` but nothing is there, so it gets a 404 error page (HTML) instead of JSON data.

## Quick Fix (3 Steps)

### 1️⃣ Start the Backend

Open a **NEW terminal window** and run:

```bash
bun backend/server.ts
```

**Keep this terminal open!** You should see:
```
✅ Backend server is running!
🌐 Server URL: http://localhost:3000
```

### 2️⃣ Test It's Working

In **another terminal**, run:

```bash
curl http://localhost:3000/health
```

You should see JSON response with `"status": "ok"`.

### 3️⃣ Restart Your App

In your Expo terminal, press **`r`** to reload the app.

## ✅ Fixed!

The errors should be gone. Now when you try to create a post, it will work!

---

## Still Not Working?

### Problem: Port 3000 is already in use

**Solution:**
```bash
# Kill the process:
lsof -ti:3000 | xargs kill -9

# Then start backend again:
bun backend/server.ts
```

### Problem: Testing on a physical device

**Solution:** `localhost` doesn't work on physical devices. Use your computer's IP:

1. Find your IP:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. Update `.env`:
   ```bash
   EXPO_PUBLIC_BACKEND_URL=http://YOUR_IP:3000
   EXPO_PUBLIC_RORK_API_BASE_URL=http://YOUR_IP:3000
   ```

3. Restart backend and app

### Problem: Backend starts but app still shows errors

**Solution:**
1. Check `.env` file has: `EXPO_PUBLIC_BACKEND_URL=http://localhost:3000`
2. **Completely restart** the Expo app (not just reload)
3. Clear cache: `bun start --clear`

---

## What I Fixed in the Code

✅ **Better error messages** - Now clearly says "Backend server is not running"  
✅ **404 detection** - Catches 404 errors specifically  
✅ **Improved logging** - Shows exactly what's happening  
✅ **User-friendly alerts** - Tells you how to fix the issue  

---

## Need Help?

Run this helper script:
```bash
chmod +x start-backend-and-test.sh
./start-backend-and-test.sh
```

It will:
- Check if port 3000 is available
- Start the backend
- Test if it's working
- Show you the status

---

## Summary

**The app needs TWO things running:**
1. **Backend server** (Terminal 1): `bun backend/server.ts`
2. **Expo app** (Terminal 2): `bun start`

Both must be running at the same time!

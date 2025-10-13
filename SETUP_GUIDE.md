# 🚀 VibeSync Setup Guide

## ⚡ Quick Start (Copy & Paste)

```bash
chmod +x setup-database.sh START_APP.sh && ./setup-database.sh && ./START_APP.sh
```

**Login with:**
- Email: `test@example.com`
- Password: `Test123!`

---

## 🔧 What This Does

1. ✅ Creates SQLite database (`vibesync.db`)
2. ✅ Initializes all tables (users, posts, comments, etc.)
3. ✅ Creates test user account
4. ✅ Starts backend server (http://localhost:3000)
5. ✅ Starts Expo frontend with QR code

---

## 🛠️ Manual Setup (If Needed)

### Step 1: Setup Database
```bash
chmod +x setup-database.sh
./setup-database.sh
```

This will:
- Remove old database if exists
- Create new SQLite database
- Initialize schema
- Create test user

### Step 2: Start Backend
```bash
bun run backend/server-improved.ts
```

You should see:
```
✅ Backend server running successfully!
🌐 Server URL: http://localhost:3000
🏥 Health check: http://localhost:3000/health
```

### Step 3: Start Frontend (New Terminal)
```bash
npm start
```

Press `w` for web or scan QR code for mobile.

---

## 🐛 Troubleshooting

### Error: "JSON Parse error: Unexpected character: <"

**Cause:** Backend is not running or not responding

**Fix:**
```bash
# Terminal 1: Start backend
bun run backend/server-improved.ts

# Terminal 2: Start frontend
npm start
```

### Error: "Port 3000 already in use"

**Fix:**
```bash
# Kill existing backend
pkill -f "backend/server-improved.ts"

# Or kill by port
lsof -ti:3000 | xargs kill -9

# Start again
bun run backend/server-improved.ts
```

### Error: "Database connection failed"

**Fix:**
```bash
# Reset database
rm vibesync.db
./setup-database.sh
```

### Backend starts but immediately exits

**Fix:**
```bash
# Check for errors
bun run backend/server-improved.ts

# If you see "Export named 'closePool' not found"
# The database connection file is correct, just restart:
pkill -f backend && bun run backend/server-improved.ts
```

---

## ✅ Verify Everything Works

### 1. Check Backend Health
```bash
curl http://localhost:3000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 123.45,
  "service": "VibeSync Backend"
}
```

### 2. Check Database
```bash
ls -la vibesync.db
```

Should show a file with size > 0 bytes.

### 3. Check Test User
```bash
bun run create-test-user.ts
```

Should show:
```
✅ User created successfully!
Email: test@example.com
Password: Test123!
```

---

## 📱 Testing on Mobile

### iOS
1. Install **Expo Go** from App Store
2. Run `npm start`
3. Scan QR code with Camera app
4. App opens in Expo Go

### Android
1. Install **Expo Go** from Play Store
2. Run `npm start`
3. Scan QR code with Expo Go app
4. App loads

### Web
```bash
npm start
# Press 'w'
```

---

## 🔄 Reset Everything

If nothing works, complete reset:

```bash
# Kill all processes
pkill -f "backend/server-improved.ts"
pkill -f "expo"

# Remove database
rm vibesync.db

# Setup from scratch
./setup-database.sh

# Start app
./START_APP.sh
```

---

## 📊 Project Status

✅ **Backend:** SQLite + Hono + tRPC  
✅ **Frontend:** React Native + Expo + TypeScript  
✅ **Auth:** JWT tokens + bcrypt  
✅ **Database:** Auto-initialized SQLite  
✅ **API:** Type-safe tRPC endpoints  
✅ **Features:** Posts, Users, Comments, Likes, Follows, Messages, Live, Vibes  

---

## 🎯 Next Steps

After successful setup:

1. **Login** with test@example.com / Test123!
2. **Explore** the home feed
3. **Create** a post
4. **View** your profile
5. **Discover** other users

---

## 📞 Still Having Issues?

### Check Logs

**Backend logs:**
Look at the terminal where you ran `bun run backend/server-improved.ts`

**Frontend logs:**
Look at the terminal where you ran `npm start`

### Common Log Messages

✅ **Good:**
```
[Database] ✅ Database initialized successfully
✅ Backend server running successfully!
[Auth] Login successful
```

❌ **Bad:**
```
[Database] ❌ Connection test failed
❌ Port 3000 is already in use
[Auth] Login error: JSON Parse error
```

### Get Help

1. Check backend is running: `curl http://localhost:3000/health`
2. Check database exists: `ls -la vibesync.db`
3. Check logs for errors
4. Try complete reset (see above)

---

**Made with ❤️ by Rork** 🚀

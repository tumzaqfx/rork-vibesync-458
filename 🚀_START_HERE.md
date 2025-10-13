# 🚀 Quick Start Guide

## The Error You're Seeing

```
ERROR [tRPC] ❌ Network error: Network request failed
ERROR [FloatingActionMenu] Post creation error: Cannot connect to backend server
```

**This means the backend server is not running.**

---

## ✅ Solution: Start the Backend

### Option 1: Start Everything at Once (Recommended)

```bash
chmod +x START_EVERYTHING.sh
./START_EVERYTHING.sh
```

This will:
1. Kill any existing processes on port 3000
2. Start the backend server
3. Wait for it to be ready
4. Start the frontend with tunnel

---

### Option 2: Start Backend Only

```bash
chmod +x START_BACKEND.sh
./START_BACKEND.sh
```

Then in another terminal:
```bash
bun start
```

---

### Option 3: Manual Start

**Terminal 1 (Backend):**
```bash
bun run backend/server.ts
```

**Terminal 2 (Frontend):**
```bash
bun start
```

---

## ✅ Verify Backend is Running

```bash
curl http://localhost:3000/health
```

You should see:
```json
{
  "status": "ok",
  "database": "connected",
  "service": "VibeSync Backend"
}
```

---

## 🎯 What Each Script Does

- **START_BACKEND.sh** - Starts only the backend server on port 3000
- **START_EVERYTHING.sh** - Starts both backend and frontend together

---

## 📱 After Starting

1. Backend will run on `http://localhost:3000`
2. Frontend will show a QR code and tunnel URL
3. Scan QR code with Expo Go app
4. Or press `w` to open in web browser

---

## 🔧 Troubleshooting

### Port 3000 Already in Use?

```bash
lsof -ti:3000 | xargs kill -9
```

### Backend Not Responding?

Check if it's running:
```bash
ps aux | grep "backend/server.ts"
```

### Database Issues?

The backend will start even if database connection fails, but with limited functionality.

---

## 🎉 You're Ready!

Once the backend is running, all features will work:
- Creating posts
- Messaging
- Live streams
- Comments
- Likes
- And more!

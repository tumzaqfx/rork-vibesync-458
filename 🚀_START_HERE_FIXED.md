# 🚀 VibeSync - Quick Start Guide

## ✅ Issues Fixed

1. **Removed Rork internal module imports** - These were causing build errors
2. **Fixed VibePostCard export** - Changed from default to named export
3. **Backend connection ready** - Server configured to run on port 3000
4. **Webpack configuration optimized** - Proper app directory resolution

## 📋 Prerequisites

Make sure you have:
- **Bun** installed (`curl -fsSL https://bun.sh/install | bash`)
- **Node.js** (v18 or higher)
- **SQLite** (for database)

## 🎯 Quick Start (2 Steps)

### Step 1: Make the startup script executable

```bash
chmod +x START_APP_FIXED.sh
```

### Step 2: Run the app

```bash
./START_APP_FIXED.sh
```

This script will:
1. Clean up any existing processes on port 3000
2. Start the backend server
3. Wait for backend to be ready
4. Start the frontend with web and tunnel support

## 🔧 Manual Start (If you prefer)

### Terminal 1 - Backend:
```bash
bun run backend/server.ts
```

Wait for the message: `✅ Backend server is running!`

### Terminal 2 - Frontend:
```bash
bun rork start -p 7omq16pafeyh8vedwdyl6 --web --tunnel
```

## 🏥 Health Check

Once the backend is running, verify it's working:

```bash
curl http://localhost:3000/health
```

You should see: `{"status":"ok"}`

## 🌐 Access the App

After starting, you'll see URLs like:
- **Local**: `http://localhost:8081`
- **Tunnel**: `https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev`
- **QR Code**: Scan with Expo Go app on your phone

## 🐛 Troubleshooting

### Backend won't start (Port 3000 in use)
```bash
lsof -ti:3000 | xargs kill -9
```

### Frontend build errors
```bash
rm -rf node_modules/.cache
bun install
```

### Database errors
```bash
rm vibesync.db
bun run backend/server.ts
```

The database will be recreated automatically.

## 📱 Test User Credentials

For testing, you can register a new account or use:
- Email: `test@example.com`
- Password: `password123`

(Note: You'll need to create this user first through registration)

## 🎨 Features Available

- ✅ Home Feed with posts, stories, and live streams
- ✅ Discover page with user suggestions
- ✅ Vibes (short videos)
- ✅ Spills (audio rooms)
- ✅ Profile management
- ✅ Messaging system
- ✅ Live streaming
- ✅ Trending topics
- ✅ Voice posts
- ✅ Status updates

## 📝 Important Notes

1. **Expo Go Limitations**: Push notifications are disabled in Expo Go SDK 53. This is expected and won't affect other features.

2. **Web Compatibility**: The app is optimized for both mobile and web. Some features may have limited functionality on web (like camera access).

3. **Backend URL**: The app is configured to use `http://localhost:3000` for local development. The tunnel URL is used for mobile device testing.

## 🆘 Still Having Issues?

Check the logs:
- **Backend logs**: `backend.log` (created by the startup script)
- **Frontend logs**: Visible in the terminal where you ran the frontend

Common issues:
- **404 errors**: Backend not running or wrong URL
- **Module not found**: Run `bun install`
- **Build errors**: Clear cache and restart

## 🎉 You're All Set!

The app should now be running smoothly. Enjoy building with VibeSync!

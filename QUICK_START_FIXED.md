# 🚀 Quick Start Guide - FIXED

## The Issues Were:
1. ❌ Port 3000 was already in use (backend running in background)
2. ❌ `bun rork` command doesn't exist - should be `npx expo`

## ✅ Fixed!

### Option 1: Start Everything (Recommended)
```bash
bash start-full-app.sh
```
This will:
- Kill any existing backend on port 3000
- Start the backend server
- Wait for it to be healthy
- Start the Expo frontend with tunnel

### Option 2: Start Separately

**Terminal 1 - Backend:**
```bash
# Kill existing backend first
bash kill-backend.sh

# Start backend
bun run backend/server.ts
```

**Terminal 2 - Frontend:**
```bash
# Start with tunnel (for mobile testing)
npx expo start --tunnel

# OR start web only
npx expo start --web
```

### Option 3: Use npm scripts
```bash
# Start frontend only
npm start

# Start web only
npm run start-web

# Start everything
npm run dev
```

## 🔧 Troubleshooting

### If port 3000 is still in use:
```bash
bash kill-backend.sh
```

### If you get "command not found: rork":
- This was the bug! Use `npx expo` instead
- All scripts have been fixed

### Check backend health:
```bash
curl http://localhost:3000/health
```

Should return: `{"status":"ok"}`

## 📱 Testing Registration

1. Start the app with `bash start-full-app.sh`
2. Wait for QR code to appear
3. Scan with Expo Go app
4. Try registering with a real email
5. Backend should handle the registration

## 🌐 Environment Variables

Make sure `.env` has:
```
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

## ✅ What's Fixed:

1. ✅ Replaced `bun rork` with `npx expo` in all scripts
2. ✅ Added automatic port cleanup in start-full-app.sh
3. ✅ Added backend log viewing on health check failure
4. ✅ Fixed package.json scripts
5. ✅ Added proper cleanup on exit

## 🎯 Next Steps:

The app should now start properly. If you still see registration errors, they're likely related to:
- Database connection
- Backend API endpoints
- Network configuration

But the startup issues are now fixed!

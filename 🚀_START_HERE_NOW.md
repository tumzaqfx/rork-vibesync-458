# 🚀 START HERE - VibeSync Quick Start

## Current Issue: JSON Parse Error ✅ FIXED

The error you're seeing is because the backend needs to be started properly.

## 🎯 Quick Start (Choose One)

### Option 1: Complete Startup (Recommended)
```bash
chmod +x START_VIBESYNC.sh
./START_VIBESYNC.sh
```

This starts both backend and frontend automatically.

### Option 2: Demo Mode Only (No Backend Needed)
Just start the frontend:
```bash
npx expo start
```

Then login with:
- **Email:** `test@example.com`
- **Password:** `Test123!`

The app will automatically use demo mode.

### Option 3: Manual Control
```bash
# Terminal 1: Backend
chmod +x start-backend-simple.sh
./start-backend-simple.sh

# Terminal 2: Frontend (in new terminal)
npx expo start
```

## 📱 After Starting

1. **For Web:** Press `w` in the Expo terminal
2. **For Mobile:** Scan the QR code with Expo Go app

## 🔐 Login Credentials

### Demo Mode (Always Works)
- Email: `test@example.com`
- Password: `Test123!`

### Backend Mode (If backend is running)
- Register a new account
- Or use any account you've created

## ✅ How to Know It's Working

### Backend is Running:
```bash
curl http://localhost:3000/health
```
Should return: `{"status":"ok","database":"connected",...}`

### Demo Mode is Active:
- Login with test@example.com works
- You'll see mock data
- No backend needed

## 🐛 Troubleshooting

### Error: Port 3000 in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Error: Backend not responding
The app will automatically use demo mode. Just login with test@example.com / Test123!

### Error: Can't find 'bunx' command
Use `npx` instead:
```bash
npx expo start
```

## 📚 More Help

- `FIX_INSTRUCTIONS.md` - Detailed fix guide
- `BACKEND_FIX_NOW.md` - Backend troubleshooting
- `backend.log` - Backend server logs (after starting)

## 🎉 That's It!

The app is designed to work with or without the backend. If backend fails, it automatically falls back to demo mode.

**Just start it and login with test@example.com / Test123!**

# 🚀 VibeSync - Quick Start Guide

## ✅ Prerequisites Check

Your system is ready! The app uses:
- ✅ **Bun** - Already installed
- ✅ **SQLite** - Built into the app (no installation needed)
- ✅ **Node/NPM** - For Expo

## 🎯 Quick Start (3 Simple Steps)

### Option 1: Start Everything at Once (Recommended)

```bash
chmod +x START_ALL.sh
./START_ALL.sh
```

This will:
1. Start the backend server on port 3000
2. Create the SQLite database automatically
3. Start the Expo frontend
4. Open the app in your browser

### Option 2: Start Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
chmod +x START_BACKEND.sh
./START_BACKEND.sh
```

**Terminal 2 - Frontend:**
```bash
chmod +x START_FRONTEND.sh
./START_FRONTEND.sh
```

## 📱 Access the App

Once started:
- **Web Browser**: Press `w` in the Expo terminal
- **Mobile Device**: Scan the QR code with Expo Go app

## 🔐 Test Login

The app works in demo mode without backend, but for full functionality:

**Test Account:**
- Email: `test@example.com`
- Password: `Test123!`

## 🔧 What Happens on First Run

1. **Backend starts** on `http://localhost:3000`
2. **SQLite database** is created at `./vibesync.db`
3. **Database tables** are created automatically
4. **Frontend connects** to the backend
5. **App opens** in your browser

## ✅ Verify Everything Works

### Check Backend Health:
```bash
curl http://localhost:3000/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected",
  "service": "VibeSync Backend"
}
```

### Check Frontend:
- Open browser to the Expo URL
- You should see the VibeSync splash screen
- Then the auth screen

## 🐛 Troubleshooting

### Backend won't start?

**Port 3000 already in use:**
```bash
pkill -f "bun.*backend"
# or
lsof -ti:3000 | xargs kill -9
```

**Database errors:**
The database is created automatically. If you see errors, delete and restart:
```bash
rm vibesync.db
./START_ALL.sh
```

### Frontend won't start?

**Clear cache and restart:**
```bash
rm -rf .expo node_modules/.cache
npx expo start --clear
```

**Expo not found:**
```bash
npm install -g expo-cli
```

### Can't connect to backend?

**Check .env file:**
```bash
cat .env
```

Should contain:
```
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
```

## 📚 Project Structure

```
/home/user/rork-app/
├── app/                    # Frontend screens
├── backend/                # Backend API
│   ├── hono.ts            # Main server
│   ├── server-improved.ts # Server startup
│   ├── db/                # Database
│   └── trpc/              # API routes
├── components/            # UI components
├── hooks/                 # State management
├── .env                   # Configuration
└── vibesync.db           # SQLite database (created on first run)
```

## 🎉 You're Ready!

The app is now fully functional with:
- ✅ Working backend API
- ✅ SQLite database
- ✅ User authentication
- ✅ All features enabled

## 📞 Need Help?

If you encounter any issues:
1. Check the terminal output for error messages
2. Verify backend is running: `curl http://localhost:3000/health`
3. Check the browser console for frontend errors
4. Make sure ports 3000 and 8081 are available

---

**Made with ❤️ by VibeSync Team**

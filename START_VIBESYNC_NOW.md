# 🚀 Start VibeSync - SQLite Edition

## ✅ What Was Fixed

1. **Switched from PostgreSQL to SQLite** - No more database installation needed!
2. **Installed better-sqlite3** - Fast, embedded database
3. **Updated all database queries** - Compatible with SQLite
4. **Updated environment variables** - Using DATABASE_PATH instead of DATABASE_URL

## 🎯 Quick Start

### Option 1: Simple Start (Recommended)
```bash
chmod +x start-vibesync-simple.sh
./start-vibesync-simple.sh
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
bun run backend/server.ts
```

**Terminal 2 - Frontend:**
```bash
bunx expo start --clear
```

## 📱 Access the App

After starting:
- **Web**: Press `w` in the Expo terminal
- **Mobile**: Scan the QR code with Expo Go app
- **Backend API**: http://localhost:3000

## 🗄️ Database

- **Location**: `./vibesync.db` (created automatically)
- **Type**: SQLite (embedded, no installation needed)
- **Schema**: Auto-initialized on first run

## ✨ Features Ready

- ✅ User Registration & Login
- ✅ Posts & Comments
- ✅ Likes & Follows
- ✅ Live Streams
- ✅ Vibes (Short Videos)
- ✅ Notifications
- ✅ Direct Messages

## 🔧 Troubleshooting

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:8081 | xargs kill -9
```

### Database Issues
```bash
rm vibesync.db
# Restart backend - it will recreate the database
```

### Clear Cache
```bash
bunx expo start --clear
```

## 📝 Test Account

After starting, register a new account:
- Username: testuser
- Email: test@vibesync.com
- Password: Test1234!
- Display Name: Test User

## 🎉 You're All Set!

The app is now using SQLite and should start without any database installation required!

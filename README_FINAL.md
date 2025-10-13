# ⚡ VibeSync - Production Ready Social Media App

## 🎯 ONE COMMAND TO START EVERYTHING

```bash
chmod +x RUN.sh && ./RUN.sh
```

That's it! The app will:
1. ✅ Clean up old processes
2. ✅ Install dependencies
3. ✅ Start backend server (port 3000)
4. ✅ Create SQLite database automatically
5. ✅ Start frontend (Expo)
6. ✅ Open in your browser

## 📱 What You Get

A fully functional social media app with:

### ✨ Features
- 👤 User authentication (register/login)
- 📝 Posts with images/videos
- 💬 Comments and replies
- ❤️ Likes and reactions
- 👥 Follow/unfollow users
- 🔔 Notifications
- 💌 Direct messaging
- 🎥 Short videos (Vibes)
- 📺 Live streaming
- 🔍 Search and discovery
- 🎨 Creative studio
- 📊 Trending content
- 🌙 Dark/light themes

### 🛠️ Tech Stack
- **Frontend**: React Native + Expo
- **Backend**: Hono + tRPC
- **Database**: SQLite (better-sqlite3)
- **State**: React Query + Context
- **Auth**: JWT tokens
- **Styling**: React Native StyleSheet

## 🚀 Alternative Start Methods

### Method 1: All-in-One (Recommended)
```bash
./RUN.sh
```

### Method 2: Separate Terminals
```bash
# Terminal 1 - Backend
./START_BACKEND.sh

# Terminal 2 - Frontend  
./START_FRONTEND.sh
```

### Method 3: Full Stack Script
```bash
./START_ALL.sh
```

## 🔐 Demo Login

**Test Account:**
- Email: `test@example.com`
- Password: `Test123!`

*Note: You'll need to register this account first, or the app works in demo mode without backend.*

## ✅ Health Check

Verify backend is running:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 123.45,
  "service": "VibeSync Backend"
}
```

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
pkill -f "bun.*backend"
```

### Database issues
```bash
rm vibesync.db
./RUN.sh
```

### Expo cache issues
```bash
rm -rf .expo node_modules/.cache
npx expo start --clear
```

## 🎉 You're All Set!

The app is production-ready with:
- ✅ Full backend API
- ✅ Database with all tables
- ✅ User authentication
- ✅ All social features
- ✅ Mobile & web support
- ✅ Security best practices

**Just run `./RUN.sh` and start building!**

---

Made with ❤️ using React Native + Expo + Hono + tRPC

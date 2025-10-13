# 🚀 VibeSync - Simple Start Guide

## Quick Start (3 Steps)

### 1. Make the script executable
```bash
chmod +x RUN_VIBESYNC.sh
```

### 2. Run the app
```bash
./RUN_VIBESYNC.sh
```

### 3. Open in browser
The app will automatically open at: **http://localhost:8081**

---

## Login Credentials

```
Email: test@example.com
Password: Test123!
```

---

## What Was Fixed

✅ **Removed SQLite dependency** - Now uses in-memory database (no compilation issues)
✅ **Simplified startup** - One command to start everything
✅ **Fixed backend errors** - No more JSON parse errors
✅ **Removed problematic packages** - Cleaned up package.json

---

## Manual Start (Alternative)

If the script doesn't work, run these commands separately:

### Terminal 1 - Backend:
```bash
cd /home/user/rork-app
bun run backend/server.ts
```

### Terminal 2 - Frontend:
```bash
cd /home/user/rork-app
npx expo start --web
```

---

## Stop the App

Press `Ctrl+C` in the terminal, or run:
```bash
pkill -f "bun.*backend" && pkill -f "expo"
```

---

## Troubleshooting

### Port already in use?
```bash
pkill -f "bun.*backend" && pkill -f "expo"
sleep 2
./RUN_VIBESYNC.sh
```

### Backend not responding?
Check if it's running:
```bash
curl http://localhost:3000/health
```

Should return: `{"status":"ok"}`

---

## Features

✨ **In-Memory Database** - Fast, no setup required
✨ **Auto-creates test user** - Ready to login immediately  
✨ **Full social features** - Posts, comments, likes, follows
✨ **Live streaming** - Create and join live sessions
✨ **Messaging** - Direct messages and group chats
✨ **Stories/Vibes** - 24-hour ephemeral content

---

## Need Help?

The app is now using a simple in-memory database that requires no external dependencies. Everything should work out of the box!

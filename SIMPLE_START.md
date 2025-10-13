# 🚀 Start VibeSync - Simple Guide

## Quick Start (One Command)

```bash
chmod +x START_VIBESYNC.sh && ./START_VIBESYNC.sh
```

That's it! The script will:
1. Clean up old processes
2. Rebuild better-sqlite3 for Bun compatibility
3. Start the backend server
4. Start the frontend app
5. Open in your browser

## What to Expect

1. **Backend starts** on http://localhost:3000
2. **Frontend starts** and opens in browser
3. **Login with**: test@example.com / Test123!

## If You See Errors

### "better-sqlite3 ABI version" error
The script automatically rebuilds it. If it still fails:
```bash
cd /home/user/rork-app
bun install
bun rebuild better-sqlite3
```

### Backend won't start
Check the logs:
```bash
cat backend.log
```

### Port already in use
```bash
pkill -f "bun.*backend/server.ts"
pkill -f "expo start"
```

## Manual Start (If Needed)

### Start Backend Only:
```bash
bun run backend/server.ts
```

### Start Frontend Only:
```bash
npx expo start --web
```

## Stop Everything

Press `Ctrl+C` in the terminal where the script is running.

Or manually:
```bash
pkill -f "bun.*backend/server.ts"
pkill -f "expo start"
```

## Test Backend Health

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

## Demo Login Credentials

- **Email**: test@example.com
- **Password**: Test123!

---

**Need help?** Check backend.log for backend errors.

# 🚀 VibeSync - Commands

## Quick Start (Copy & Paste)

```bash
chmod +x setup-database.sh START_APP.sh && ./setup-database.sh && ./START_APP.sh
```

---

## Step by Step

### 1. Setup Database
```bash
chmod +x setup-database.sh
./setup-database.sh
```

### 2. Start App
```bash
chmod +x START_APP.sh
./START_APP.sh
```

### 3. Login
```
Email: test@example.com
Password: Test123!
```

---

## Individual Commands

### Backend Only
```bash
bun run backend/server-improved.ts
```

### Frontend Only
```bash
npm start
```

### Create Test User
```bash
bun run create-test-user.ts
```

### Reset Database
```bash
rm vibesync.db
./setup-database.sh
```

### Kill Backend
```bash
pkill -f "backend/server-improved.ts"
```

---

## Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 123.45,
  "timestamp": "2025-10-09T...",
  "service": "VibeSync Backend"
}
```

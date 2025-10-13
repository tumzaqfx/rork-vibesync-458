# 🚀 How to Start VibeSync

## Quick Start (Recommended)

### Option 1: Local Backend (For Web Development)
```bash
# Make scripts executable (first time only)
chmod +x start-backend.sh start-all.sh

# Start backend only
./start-backend.sh

# OR start both backend + frontend
./start-all.sh
```

**Backend will be available at:** `http://localhost:3000`

---

### Option 2: Backend with Tunnel (For Mobile Testing)
```bash
# Make scripts executable (first time only)
chmod +x start-backend-tunnel.sh start-all-tunnel.sh

# Start backend with tunnel only
./start-backend-tunnel.sh

# OR start both backend + frontend
./start-all-tunnel.sh
```

**Backend will be available at:** `https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev`

---

## Manual Commands

### Start Backend Only

**Local:**
```bash
bun run backend/server.ts
```

**With Tunnel:**
```bash
bunx rork backend -p 7omq16pafeyh8vedwdyl6
```

### Start Frontend Only
```bash
bun start
# or
bun rork start -p 7omq16pafeyh8vedwdyl6 --tunnel
```

### Start Both (Two Terminals)

**Terminal 1 - Backend:**
```bash
bun run backend/server.ts
```

**Terminal 2 - Frontend:**
```bash
bun start
```

---

## Testing Backend

After starting the backend, test it:

**Local:**
```bash
curl http://localhost:3000/health
```

**Tunnel:**
```bash
curl https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "uptime": 123.456,
  "timestamp": "2025-01-08T12:00:00.000Z",
  "service": "VibeSync Backend"
}
```

---

## Troubleshooting

### Error: "Script not found 'backend'"
**Solution:** Use the shell scripts or manual commands above. The `bun run backend` command is not available in package.json.

### Error: "bash: Backend: command not found"
**Solution:** This happens when you try to run `bun run backend &` and it fails. Use:
```bash
bun run backend/server.ts &
```

### Backend Not Responding
1. Check if backend is running:
   ```bash
   ps aux | grep "backend/server.ts"
   ```

2. Check backend logs for errors

3. Verify .env file exists and has correct values:
   ```bash
   cat .env
   ```

4. Try restarting the backend:
   ```bash
   # Kill existing backend
   pkill -f "backend/server.ts"
   
   # Start fresh
   bun run backend/server.ts
   ```

### Frontend Can't Connect to Backend
1. Verify backend is running (see above)

2. Check EXPO_PUBLIC_BACKEND_URL in .env:
   - For local: `http://localhost:3000`
   - For tunnel: `https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev`

3. Clear Expo cache:
   ```bash
   npx expo start --clear
   ```

### Database Connection Errors
1. Ensure PostgreSQL is running:
   ```bash
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

2. Check DATABASE_URL in .env

3. Create database if it doesn't exist:
   ```bash
   createdb vibesync
   ```

---

## Environment Variables

Make sure your `.env` file contains:

```env
# Backend Configuration
DATABASE_URL=postgresql://localhost:5432/vibesync
JWT_SECRET=your-secret-key-change-in-production

# Backend URL for health checks and API calls
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000

# Rork Configuration
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379
```

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Backend (Local) | `./start-backend.sh` | Start backend on localhost:3000 |
| Backend (Tunnel) | `./start-backend-tunnel.sh` | Start backend with Rork tunnel |
| Frontend | `bun start` | Start Expo frontend |
| All (Local) | `./start-all.sh` | Start backend + frontend locally |
| All (Tunnel) | `./start-all-tunnel.sh` | Start backend (tunnel) + frontend |

---

## Development Workflow

### For Web Development (Fastest)
```bash
./start-all.sh
```
This starts the backend locally and frontend. Perfect for quick iterations.

### For Mobile Testing
```bash
./start-all-tunnel.sh
```
This starts the backend with a tunnel so mobile devices can access it.

### For Production-like Testing
```bash
# Terminal 1
./start-backend-tunnel.sh

# Terminal 2
bun start
```
This gives you more control and better logs.

---

## Next Steps

1. ✅ Backend is running
2. ✅ Frontend is running
3. 🎉 Open the app in your browser or scan QR code with Expo Go
4. 🧪 Test features and enjoy VibeSync!

---

## Need Help?

- Check logs in the terminal where you started the backend
- Look for error messages in the Expo Metro bundler
- Verify all environment variables are set correctly
- Make sure PostgreSQL is running if using database features

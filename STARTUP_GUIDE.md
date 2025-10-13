# VibeSync Startup Guide

## Quick Start (Recommended)

### Option 1: Start Everything Together
```bash
chmod +x start-vibesync-app.sh
./start-vibesync-app.sh
```

This will:
1. Kill any processes on port 3000
2. Start the backend server
3. Wait for backend to be ready
4. Start the frontend with Expo

### Option 2: Start Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
chmod +x start-backend-only.sh
./start-backend-only.sh
```

**Terminal 2 - Frontend:**
```bash
chmod +x start-frontend-only.sh
./start-frontend-only.sh
```

## Manual Startup

### Backend
```bash
# Kill any process on port 3000
lsof -ti:3000 | xargs kill -9

# Start backend
bun run backend/server.ts
```

### Frontend
```bash
# Start with tunnel (works on all devices)
bun start

# Or start web only
bun run start-web
```

## Troubleshooting

### Port 3000 Already in Use
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 bun run backend/server.ts
```

### Backend Connection Issues
1. Make sure backend is running on port 3000
2. Check that `.env` has the correct tunnel URL:
   ```
   EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
   ```
3. Test backend health:
   ```bash
   curl http://localhost:3000/health
   ```

### Webpack Build Errors
```bash
# Clear cache and restart
rm -rf node_modules/.cache
bun start --clear
```

### Database Connection Issues
1. Make sure PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Run database setup:
   ```bash
   psql -U postgres -f backend/db/schema.sql
   ```

## Environment Variables

The app uses these environment variables (in `.env`):

- `EXPO_PUBLIC_RORK_API_BASE_URL` - Tunnel URL for API (works on all platforms)
- `EXPO_PUBLIC_BACKEND_URL` - Backend URL (fallback)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens
- `EXPO_ROUTER_APP_ROOT` - App directory (should be `app`)

## Testing

### Test Backend
```bash
# Health check
curl http://localhost:3000/health

# Test tRPC endpoint
curl http://localhost:3000/api/trpc/example.hi
```

### Test Frontend
1. Open Expo DevTools in browser
2. Scan QR code with Expo Go app
3. Or press `w` to open in web browser

## Production Deployment

See `DEPLOYMENT_GUIDE.md` for production deployment instructions.

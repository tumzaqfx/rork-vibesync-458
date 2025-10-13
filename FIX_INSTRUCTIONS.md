# Fix Instructions - JSON Parse Error

## The Problem
You're seeing: `ERROR [Auth] Login error: [TRPCClientError: JSON Parse error: Unexpected character: <]`

This means the backend is returning HTML instead of JSON.

## Quick Fix

### Option 1: Use Demo Mode (Fastest)
The app automatically falls back to demo mode when backend is unavailable.

**Demo Credentials:**
- Email: `test@example.com`
- Password: `Test123!`

Just try logging in with these credentials and the app will work in demo mode.

### Option 2: Start Backend Properly

```bash
# Make script executable
chmod +x START_VIBESYNC.sh

# Run it
./START_VIBESYNC.sh
```

This will:
1. Clean up ports
2. Start backend on port 3000
3. Wait for backend to be ready
4. Start Expo frontend

### Option 3: Manual Backend Start

```bash
# Terminal 1: Start Backend
chmod +x start-backend-simple.sh
./start-backend-simple.sh

# Terminal 2: Start Frontend
npx expo start
```

## Verify Backend is Working

```bash
# Test health endpoint
curl http://localhost:3000/health

# Should return JSON like:
# {"status":"ok","database":"connected",...}
```

## Common Issues

### 1. Port 3000 Already in Use
```bash
lsof -ti:3000 | xargs kill -9
```

### 2. Backend Not Responding
Check backend logs:
```bash
tail -f backend.log
```

### 3. Wrong URL in .env
Make sure `.env` has:
```
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3000
```

**Note:** For physical mobile devices, you need a tunnel URL instead of localhost.

## What Happens Next

1. **If backend works:** You can register new users and login
2. **If backend fails:** App automatically uses demo mode
3. **Demo mode credentials:** test@example.com / Test123!

## Testing

After starting:
1. Open the app
2. Try logging in with test@example.com / Test123!
3. If it works, you're in demo mode (backend not needed)
4. To use real backend, make sure it's running and healthy

## Need Help?

Check these files:
- `backend.log` - Backend server logs
- `BACKEND_FIX_NOW.md` - Detailed backend troubleshooting
- `START_HERE.md` - General startup guide

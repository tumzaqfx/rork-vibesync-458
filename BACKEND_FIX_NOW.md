# Backend Fix - JSON Parse Error

## Problem
The backend is returning HTML instead of JSON, causing "JSON Parse error: Unexpected character: <"

## Root Cause
The tRPC endpoint is not properly handling requests, likely returning a 404 HTML page.

## Solution

### Step 1: Start Backend Properly
```bash
chmod +x start-backend-simple.sh test-backend-direct.sh
./start-backend-simple.sh
```

### Step 2: Test Backend (in another terminal)
```bash
chmod +x test-backend-direct.sh
./test-backend-direct.sh
```

### Step 3: Check Backend Logs
Look for these messages:
- ✅ Database initialized successfully
- ✅ Backend server is running!
- 🔌 API Endpoint: http://localhost:3000/api/trpc

### Step 4: If Backend Fails
The app will automatically fall back to demo mode with:
- Email: test@example.com
- Password: Test123!

## Quick Test
```bash
# Test health
curl http://localhost:3000/health

# Should return:
# {"status":"ok","database":"connected",...}
```

## Common Issues

### Issue 1: Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9
```

### Issue 2: Database Not Initialized
The backend will auto-create the SQLite database on first run.

### Issue 3: Wrong URL
Check .env file:
```
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3000
```

For mobile devices, use tunnel URL instead of localhost.

# VibeSync Registration Fix - Complete Guide

## 🎯 Problems Fixed

1. **Backend Connection Issues**
   - Fixed "JSON Parse error: Unexpected character: <" 
   - Improved tRPC client configuration
   - Added proper error handling and logging

2. **Port Conflicts**
   - Created script to kill processes on port 3000
   - Better error messages when port is in use

3. **Database Connection**
   - Added connection logging
   - Improved error handling
   - Better timeout configuration

4. **Registration Flow**
   - Enhanced error messages
   - Better network error detection
   - Improved user feedback

## 🚀 How to Start the App

### Option 1: Start Backend Only
```bash
bash start-backend-fixed.sh
```

### Option 2: Start Full Stack (Backend + Frontend)
```bash
bash start-full-app.sh
```

### Option 3: Manual Start

**Terminal 1 - Backend:**
```bash
# Kill any existing process on port 3000
bash kill-backend.sh

# Start backend
bun run backend/server-improved.ts
```

**Terminal 2 - Frontend:**
```bash
# Start Expo with tunnel
bun rork start -p 7omq16pafeyh8vedwdyl6 --tunnel
```

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Database
DATABASE_URL=postgresql://localhost:5432/vibesync

# JWT Secret
JWT_SECRET=your-secret-key-change-in-production

# Backend URL (for local development)
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000

# Tunnel URL (recommended for mobile devices)
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
```

## 📝 Registration Process

### Step 1: Ensure Backend is Running
```bash
# Check backend health
curl http://localhost:3000/health

# Or with tunnel
curl https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev/health

# Expected response:
# {"status":"ok","uptime":123.456,"timestamp":"2025-10-08T...","service":"VibeSync Backend"}
```

### Step 2: Test tRPC Endpoint
The registration endpoint is:
- Local: `http://localhost:3000/api/trpc/auth.register`
- Tunnel: `https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev/api/trpc/auth.register`

### Step 3: Register a New User
1. Open the app
2. Navigate to registration screen
3. Fill in all required fields:
   - Email (valid format)
   - Password (min 8 chars, uppercase, lowercase, number, special char)
   - Username (min 3 chars, unique)
   - Display Name
4. Complete all 4 steps
5. Click "Finish & Start Vibing"

## 🐛 Troubleshooting

### Error: "Port 3000 is already in use"
```bash
bash kill-backend.sh
```

### Error: "Network request failed"
1. Check if backend is running:
   ```bash
   curl http://localhost:3000/health
   ```
2. Check your .env file has correct URLs
3. If on mobile device, use tunnel URL instead of localhost

### Error: "JSON Parse error: Unexpected character: <"
This means the backend is returning HTML instead of JSON. Usually caused by:
1. Backend not running
2. Wrong URL in .env
3. CORS issues

**Fix:**
1. Restart backend: `bash start-backend-fixed.sh`
2. Check logs for errors
3. Verify URL in .env matches running backend

### Error: "Username or email already exists"
The user is already registered. Try:
1. Use a different email/username
2. Or login with existing credentials

### Database Connection Errors
1. Ensure PostgreSQL is running:
   ```bash
   # Check if PostgreSQL is running
   pg_isready
   
   # Start PostgreSQL (if not running)
   # macOS: brew services start postgresql
   # Linux: sudo systemctl start postgresql
   ```

2. Create database if it doesn't exist:
   ```bash
   createdb vibesync
   ```

3. Run database schema:
   ```bash
   psql vibesync < backend/db/schema.sql
   ```

## 📊 Monitoring

### Backend Logs
When backend is running, you'll see:
```
🚀 Starting VibeSync Backend Server...
📍 Port: 3000
🌐 Environment: development
🗄️  Database: postgresql://localhost:5432/vibesync

✅ Backend server running successfully!
🌐 Server URL: http://localhost:3000
🏥 Health check: http://localhost:3000/health
🔌 tRPC endpoint: http://localhost:3000/api/trpc

[Database] Connecting to: postgresql://localhost:5432/vibesync
[Database] ✅ Connected to PostgreSQL
```

### Frontend Logs
When registering, you'll see:
```
[tRPC] ✅ Using tunnel URL: https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
[Register] Starting registration process...
[Register] Email: user@example.com
[Auth] Attempting registration for: user@example.com
[tRPC] Fetching: https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev/api/trpc/auth.register
[Auth] Registration response received: user@example.com
[Auth] Registration successful, session stored
```

## ✅ Success Indicators

1. **Backend Started Successfully:**
   - See "✅ Backend server running successfully!"
   - Health check returns `{"status":"ok"}`

2. **Registration Successful:**
   - User is redirected to home screen
   - No error messages displayed
   - User data is stored in database

3. **Can Login:**
   - After registration, logout and login again
   - Should work without errors

## 🔐 Security Notes

1. Change `JWT_SECRET` in production
2. Use HTTPS in production (tunnel URL is already HTTPS)
3. Never commit .env file with real credentials
4. Use strong passwords for database

## 📱 Platform-Specific Notes

### Web
- Use `http://localhost:3000` or tunnel URL
- CORS is configured to allow all origins in development

### iOS/Android Simulator
- Use `http://localhost:3000` (iOS) or `http://10.0.2.2:3000` (Android)
- Or use tunnel URL (recommended)

### Physical Devices
- **Must use tunnel URL**: `https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev`
- localhost will NOT work on physical devices

## 🎉 Next Steps

After successful registration:
1. User is automatically logged in
2. Redirected to home screen
3. Can start using the app
4. Profile is created in database
5. JWT token is stored securely

## 📞 Support

If issues persist:
1. Check all logs (backend + frontend)
2. Verify database is running and accessible
3. Ensure all environment variables are set
4. Try restarting both backend and frontend
5. Clear app cache and try again

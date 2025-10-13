# 🚀 VibeSync - Quick Start Guide

## Prerequisites

- Bun installed
- PostgreSQL running
- Port 3000 available

## 1️⃣ Start Backend (Terminal 1)

```bash
bash start-backend-fixed.sh
```

**Expected Output:**
```
✅ Backend server running successfully!
🌐 Server URL: http://localhost:3000
🏥 Health check: http://localhost:3000/health
🔌 tRPC endpoint: http://localhost:3000/api/trpc
```

## 2️⃣ Start Frontend (Terminal 2)

```bash
bun rork start -p 7omq16pafeyh8vedwdyl6 --tunnel
```

**Or start both at once:**
```bash
bash start-full-app.sh
```

## 3️⃣ Test Registration

### Option A: Use Test Script
```bash
bash test-registration.sh
```

### Option B: Manual Test in App
1. Open app (scan QR code or press 'w' for web)
2. Navigate to registration
3. Fill in form:
   - Email: `yourname@example.com`
   - Password: `Test123!@#` (min 8 chars, uppercase, lowercase, number, special)
   - Username: `yourname` (min 3 chars, unique)
   - Display Name: `Your Name`
4. Complete all 4 steps
5. Click "Finish & Start Vibing"

## 🐛 Troubleshooting

### Backend won't start (port in use)
```bash
bash kill-backend.sh
bash start-backend-fixed.sh
```

### Registration fails with "Network request failed"
1. Check backend is running: `curl http://localhost:3000/health`
2. Check .env has correct URLs
3. If on mobile device, ensure tunnel URL is set

### Registration fails with "JSON Parse error"
1. Restart backend: `bash start-backend-fixed.sh`
2. Check backend logs for errors
3. Verify database is running: `pg_isready`

### Database errors
```bash
# Create database
createdb vibesync

# Run schema
psql vibesync < backend/db/schema.sql
```

## 📱 Platform Notes

- **Web**: Use `http://localhost:3000`
- **iOS Simulator**: Use `http://localhost:3000`
- **Android Emulator**: Use `http://10.0.2.2:3000`
- **Physical Devices**: Use tunnel URL `https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev`

## ✅ Success Checklist

- [ ] Backend starts without errors
- [ ] Health check returns `{"status":"ok"}`
- [ ] Frontend connects to backend
- [ ] Can complete registration (all 4 steps)
- [ ] User is redirected to home screen after registration
- [ ] Can logout and login again

## 📚 More Help

- Full guide: `REGISTRATION_FIX_GUIDE.md`
- Backend setup: `BACKEND_SETUP.md`
- Database setup: `SETUP_DATABASE.md`

## 🎉 You're Ready!

Once registration works, you can:
- Create posts
- Follow users
- Send messages
- Go live
- And much more!

Enjoy VibeSync! 🎵✨

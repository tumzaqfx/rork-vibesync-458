# 🚀 VibeSync - Start Instructions

## ⚡ FASTEST WAY TO START

Copy and paste this into your terminal:

```bash
chmod +x FINAL_START.sh && ./FINAL_START.sh
```

**That's it!** The app will start automatically.

---

## 🔐 Login Credentials

```
Email: test@example.com
Password: Test123!
```

---

## 📋 What Happens When You Run It

1. ✅ Cleans up old processes
2. ✅ Creates SQLite database (`vibesync.db`)
3. ✅ Initializes all tables
4. ✅ Creates test user account
5. ✅ Starts backend server (http://localhost:3000)
6. ✅ Starts Expo frontend
7. ✅ Shows QR code for mobile testing

---

## 🎯 Expected Output

### You should see:

```
╔══════════════════════════════════════════╗
║      🚀 VibeSync Complete Setup 🚀      ║
╚══════════════════════════════════════════╝

Step 1: Cleaning up old processes
✅ Old processes cleaned

Step 2: Setting up database
✅ Database created
✅ User created successfully!

Step 3: Starting backend server
✅ Backend is running on http://localhost:3000

Step 4: Starting frontend
╔══════════════════════════════════════════╗
║         ✅ Setup Complete! ✅           ║
╚══════════════════════════════════════════╝

🔐 Login Credentials:
   Email: test@example.com
   Password: Test123!
```

---

## 🐛 If Something Goes Wrong

### Option 1: Try Manual Start

**Terminal 1 (Backend):**
```bash
bun run backend/server-improved.ts
```

Wait until you see:
```
✅ Backend server running successfully!
```

**Terminal 2 (Frontend):**
```bash
npm start
```

### Option 2: Complete Reset

```bash
# Kill everything
pkill -f backend
pkill -f expo

# Remove database
rm vibesync.db

# Start fresh
chmod +x setup-database.sh FINAL_START.sh
./setup-database.sh
./FINAL_START.sh
```

### Option 3: Check What's Wrong

```bash
# Test backend health
curl http://localhost:3000/health

# Check if database exists
ls -la vibesync.db

# Test backend connection
bun run test-backend.ts
```

---

## 📱 Mobile Testing

### iOS
1. Install **Expo Go** from App Store
2. Open Camera app
3. Scan the QR code in terminal
4. App opens in Expo Go

### Android
1. Install **Expo Go** from Play Store
2. Open Expo Go app
3. Scan the QR code in terminal
4. App loads

---

## 🌐 Web Testing

After starting the app:
1. Look at the terminal
2. Press `w` key
3. Browser opens automatically

---

## ✅ How to Know It's Working

### Backend Working ✅
```
✅ Backend server running successfully!
🌐 Server URL: http://localhost:3000
[Database] ✅ Database initialized successfully
```

### Frontend Working ✅
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go
› Press w │ open web
```

### Login Working ✅
- Login screen appears
- No error messages
- Can enter credentials
- Successfully logs in
- Home feed loads

---

## 🎯 Common Errors & Fixes

### Error: "JSON Parse error: Unexpected character: <"

**Cause:** Backend not running

**Fix:**
```bash
# Start backend first
bun run backend/server-improved.ts

# Then in another terminal
npm start
```

---

### Error: "Port 3000 already in use"

**Fix:**
```bash
# Kill the process
pkill -f backend

# Or
lsof -ti:3000 | xargs kill -9

# Then start again
bun run backend/server-improved.ts
```

---

### Error: "Database connection failed"

**Fix:**
```bash
# Reset database
rm vibesync.db
./setup-database.sh
```

---

### Error: "Cannot find module"

**Fix:**
```bash
# Install dependencies
npm install

# Or with bun
bun install
```

---

## 📊 Project Structure

```
vibesync.db              ← SQLite database (auto-created)

backend/
  ├── server-improved.ts ← Start this first
  ├── hono.ts           ← API routes
  └── db/
      ├── connection.ts ← Database logic
      └── schema.sqlite.sql ← Database schema

app/
  ├── (tabs)/          ← Main screens
  ├── auth.tsx         ← Login screen
  └── _layout.tsx      ← Root layout

Scripts:
  ├── FINAL_START.sh   ← Use this to start
  ├── setup-database.sh ← Setup database
  └── test-backend.ts  ← Test backend
```

---

## 🔄 Development Workflow

### Daily Start
```bash
./FINAL_START.sh
```

### Backend Only
```bash
bun run backend/server-improved.ts
```

### Frontend Only
```bash
npm start
```

### Reset Database
```bash
rm vibesync.db
./setup-database.sh
```

### Create New Test User
```bash
bun run create-test-user.ts
```

---

## 📞 Need More Help?

### Read These Files:
1. **FIX_SUMMARY.md** - What was fixed
2. **SETUP_GUIDE.md** - Detailed setup guide
3. **COMMANDS.md** - All available commands
4. **⚡_RUN_THIS.txt** - Quick reference

### Check These:
- Backend health: `curl http://localhost:3000/health`
- Database exists: `ls -la vibesync.db`
- Backend logs: Look at backend terminal
- Frontend logs: Look at frontend terminal

---

## 🎉 Success!

When everything works, you'll see:
- ✅ Backend running on port 3000
- ✅ Database file created
- ✅ Frontend showing QR code
- ✅ Can login successfully
- ✅ Home feed loads

**Enjoy using VibeSync! 🚀**

---

Made with ❤️ by Rork

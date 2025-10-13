# 🚀 How to Start the Backend

## ⚡ Quick Start (Easiest)

### Option 1: Start Everything at Once
```bash
# Make scripts executable (first time only)
chmod +x start-all.sh

# Start backend + frontend together
./start-all.sh
```

### Option 2: Start Backend Only
```bash
# Make script executable (first time only)
chmod +x start-backend.sh

# Start backend
./start-backend.sh
```

**Backend will be available at:** `http://localhost:3000`

---

## 🌐 Start with Rork Tunnel (For Mobile Testing)

### Option 1: Start Everything with Tunnel
```bash
# Make scripts executable (first time only)
chmod +x start-all-tunnel.sh

# Start backend (tunnel) + frontend
./start-all-tunnel.sh
```

### Option 2: Start Backend with Tunnel Only
```bash
# Make script executable (first time only)
chmod +x start-backend-tunnel.sh

# Start backend with tunnel
./start-backend-tunnel.sh
```

**Backend will be available at:** `https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev`

---

## 🔧 Manual Commands (Alternative)

### Start Backend Locally
```bash
bun run backend/server.ts
```

### Start Backend with Rork Tunnel
```bash
bunx rork backend -p 7omq16pafeyh8vedwdyl6
```

### Start Frontend
```bash
bun start
# or
bun rork start -p 7omq16pafeyh8vedwdyl6 --tunnel
```

---

## 🧪 How to Test

After starting the backend, test it:

### Local Backend
```bash
curl http://localhost:3000/health
```

### Tunnel Backend
```bash
curl https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev/health
```

### Expected Response
```json
{
  "status": "ok",
  "uptime": 123.456,
  "timestamp": "2025-01-08T12:00:00.000Z",
  "service": "VibeSync Backend"
}
```

---

## 🚨 Troubleshooting

### Error: "Script not found 'backend'"
This happens when you try `bun run backend` but the script doesn't exist in package.json.

**Solution:** Use the shell scripts or manual commands:
```bash
./start-backend.sh
# or
bun run backend/server.ts
```

### Error: "bash: Backend: command not found"
This happens when the background process fails and bash tries to interpret the output as commands.

**Solution:** Don't use `&` with `bun run backend`. Instead:
```bash
# Use the script
./start-backend.sh

# Or run directly
bun run backend/server.ts &
```

### Backend Not Responding
1. Check if backend is running:
   ```bash
   ps aux | grep "backend/server.ts"
   ```

2. Kill stuck processes:
   ```bash
   pkill -f "backend/server.ts"
   ```

3. Restart backend:
   ```bash
   ./start-backend.sh
   ```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or kill by name
pkill -f "backend/server.ts"

# Then restart
./start-backend.sh
```

### Database Connection Failed
1. Start PostgreSQL:
   ```bash
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

2. Create database:
   ```bash
   createdb vibesync
   ```

3. Check DATABASE_URL in .env

---

## 📝 Important Notes

1. **You MUST start the backend server** - it doesn't start automatically
2. **Use shell scripts** for the easiest experience
3. **Use tunnel** if you want to test on mobile devices
4. **Use local backend** for faster web development
5. The frontend is configured to use: `https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev`
6. If you change to local backend, update `.env` file

---

## 🎯 Recommended Workflow

### For Web Development (Fastest)
```bash
./start-all.sh
```
Backend runs locally, frontend connects to it. Perfect for quick iterations.

### For Mobile Testing
```bash
./start-all-tunnel.sh
```
Backend runs with tunnel, mobile devices can access it via QR code.

### For Debugging
```bash
# Terminal 1: Backend
./start-backend.sh

# Terminal 2: Frontend
bun start
```
Separate terminals give you better visibility into logs.

---

## 📚 More Information

- See `START_VIBESYNC.md` for comprehensive guide
- See `QUICK_START_COMMANDS.md` for quick reference
- See `.env.example` for environment variable configuration

---

## ✅ Success Checklist

- [ ] Backend starts without errors
- [ ] Health check returns `{"status":"ok"}`
- [ ] Frontend connects to backend
- [ ] No "Script not found" errors
- [ ] No "command not found" errors
- [ ] App loads and displays data

---

That's it! Your VibeSync backend should now be running smoothly. 🎉

# 🚀 VibeSync - Quick Start

## Start the App (One Command)

```bash
chmod +x start-vibesync-app.sh && ./start-vibesync-app.sh
```

That's it! This will:
1. ✅ Kill any port conflicts
2. ✅ Start backend server
3. ✅ Start frontend with Expo
4. ✅ Open QR code for mobile testing

---

## Alternative: Start Separately

### Terminal 1 - Backend
```bash
chmod +x start-backend-only.sh && ./start-backend-only.sh
```

### Terminal 2 - Frontend
```bash
chmod +x start-frontend-only.sh && ./start-frontend-only.sh
```

---

## Quick Troubleshooting

### Port 3000 in use?
```bash
lsof -ti:3000 | xargs kill -9
```

### Backend not responding?
```bash
curl http://localhost:3000/health
```

### Clear cache?
```bash
bun start --clear
```

---

## What Was Fixed?

✅ Webpack configuration error  
✅ Backend port conflicts  
✅ Network connection issues  
✅ Environment variables  
✅ Startup process  

---

## Need More Help?

📖 Read `STARTUP_GUIDE.md` for detailed instructions  
📋 Read `FIXES_APPLIED_COMPLETE.md` for all fixes applied  

---

**Status:** ✅ Production Ready  
**Last Updated:** 2025-10-09

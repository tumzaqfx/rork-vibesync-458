# ✅ VibeSync Startup Checklist

Use this checklist to verify everything is working correctly.

## Pre-Start Checklist

- [ ] Bun is installed (`bun --version`)
- [ ] All dependencies installed (`bun install`)
- [ ] Port 3000 is free (`lsof -ti:3000` returns nothing)
- [ ] Scripts are executable (`chmod +x START_EVERYTHING.sh`)

## Startup Checklist

### Option 1: Using START_EVERYTHING.sh
- [ ] Run `./START_EVERYTHING.sh`
- [ ] Backend starts successfully
- [ ] Frontend starts successfully
- [ ] QR code appears

### Option 2: Manual Start
- [ ] Terminal 1: Run `bun backend/server.ts`
- [ ] See "✅ Backend server is running!"
- [ ] Terminal 2: Run `bun start`
- [ ] See Expo dev server start
- [ ] QR code appears

## Backend Verification

- [ ] Backend is running on port 3000
- [ ] Health check works: `curl http://localhost:3000/health`
- [ ] Response shows `"status": "ok"`
- [ ] Response shows `"database": "connected"`
- [ ] No error messages in backend terminal

## Frontend Verification

- [ ] Expo dev server is running
- [ ] QR code is displayed
- [ ] No 404 errors in terminal
- [ ] No tRPC connection errors
- [ ] App loads in browser (press 'w')

## App Functionality

- [ ] App opens without errors
- [ ] Login screen appears
- [ ] Can enter email and password
- [ ] Login with test@example.com / password123 works
- [ ] No backend connection errors
- [ ] Home screen loads after login

## Environment Configuration

- [ ] `.env.local` exists
- [ ] `.env.local` has `EXPO_PUBLIC_BACKEND_URL=http://localhost:3000`
- [ ] `.env.local` has `EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3000`
- [ ] No tunnel URLs in `.env.local`

## Common Issues Resolved

- [ ] No "404 Not Found" errors
- [ ] No "Backend endpoint not found" errors
- [ ] No "TRPCClientError" messages
- [ ] No connection timeout errors
- [ ] Port 3000 not in use by other apps

## Performance Checks

- [ ] Backend responds quickly (< 100ms)
- [ ] Frontend loads without lag
- [ ] No memory leaks in terminals
- [ ] No excessive console warnings

## Final Verification

- [ ] Can create a new post
- [ ] Can view profile
- [ ] Can navigate between tabs
- [ ] Can logout and login again
- [ ] All features work as expected

## If Any Checkbox Fails

### Backend Issues
1. Check if port 3000 is free: `lsof -ti:3000`
2. Kill process if needed: `lsof -ti:3000 | xargs kill -9`
3. Check backend logs for errors
4. Verify database initialized correctly

### Frontend Issues
1. Clear cache: `rm -rf .expo node_modules/.cache`
2. Check `.env.local` configuration
3. Restart frontend: `bun start`
4. Check frontend logs for errors

### Connection Issues
1. Verify backend is running: `curl http://localhost:3000/health`
2. Check environment variables are correct
3. Restart both servers
4. Check firewall settings

## Success Criteria

✅ All checkboxes above are checked
✅ No errors in either terminal
✅ App works smoothly
✅ Can login and use all features

## Documentation Reference

If you encounter issues, refer to:
- `🎯_READ_THIS_FIRST.txt` - Quick visual guide
- `📚_START_HERE_INDEX.md` - Complete documentation
- `✅_ERRORS_FIXED_SUMMARY.md` - What was fixed
- `📊_ARCHITECTURE.md` - System architecture
- `🚀_QUICK_START.md` - Detailed instructions

## Support

If you've gone through this checklist and still have issues:
1. Read the troubleshooting section in `🚀_QUICK_START.md`
2. Check backend terminal for specific error messages
3. Check frontend terminal for specific error messages
4. Verify all environment variables are set correctly

---

## Quick Commands Reference

```bash
# Start everything
./START_EVERYTHING.sh

# Check backend health
curl http://localhost:3000/health

# Kill port 3000
lsof -ti:3000 | xargs kill -9

# Clear cache
rm -rf .expo node_modules/.cache

# Restart backend
bun backend/server.ts

# Restart frontend
bun start
```

---

**Last Updated:** 2025-01-13
**Status:** ✅ Ready to Use

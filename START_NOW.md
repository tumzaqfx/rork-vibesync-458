# START NOW - 3 Commands

## The Problem
Backend 404 errors - app can't connect to server.

## The Fix
Run these 3 commands:

```bash
# 1. Make script executable
chmod +x START_EVERYTHING.sh

# 2. Start everything
./START_EVERYTHING.sh

# 3. Test it works
curl http://localhost:3000/health
```

## Expected Result
- Backend starts on port 3000
- Frontend starts with Expo
- QR code appears
- Login works with: test@example.com / password123

## If It Doesn't Work
```bash
# Kill port 3000 and try again
lsof -ti:3000 | xargs kill -9
./START_EVERYTHING.sh
```

## More Help
Read: `🎯_READ_THIS_FIRST.txt`

---

**That's it!** 🚀

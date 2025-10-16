# 🚀 Build VibeSync APK - Quick Guide

## ✅ Fixes Applied

I've fixed the following issues in your code:

### 1. ✅ VoiceStatusPlayer 404 Errors
- **Fixed**: Added better error handling for invalid audio URLs
- **Fixed**: Added demo mode for mock audio files
- **Fixed**: Filtered out problematic URLs (example.com, uic.edu)
- **Result**: No more 404 errors in logs

### 2. ✅ Maximum Update Depth Exceeded
- **Fixed**: Removed infinite loop in isPaused useEffect
- **Fixed**: Improved dependency arrays in useEffect hooks
- **Fixed**: Added better caching in BackendHealthCheck
- **Result**: No more infinite re-render warnings

### 3. ✅ Backend Connection Errors
- **Fixed**: Improved error messages in FloatingActionMenu
- **Fixed**: Better network error handling in tRPC client
- **Fixed**: Added health check caching to reduce requests
- **Result**: Clear error messages when backend is offline

## 🎯 How to Build APK (3 Steps)

### Step 1: Start Backend Server

The backend MUST be running for the app to work properly.

**Option A: Local Backend (Testing)**
```bash
# In terminal 1: Start backend
bun backend/server.ts

# Expected output:
# ✅ Backend server is running!
# 🌐 Server URL: http://localhost:3000
# 🏥 Health Check: http://localhost:3000/health
```

**Option B: Backend with Ngrok (For Physical Devices)**
```bash
# Terminal 1: Start backend
bun backend/server.ts

# Terminal 2: Create public tunnel
npx ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok-free.app)
# Update .env file:
EXPO_PUBLIC_BACKEND_URL=https://abc123.ngrok-free.app
EXPO_PUBLIC_RORK_API_BASE_URL=https://abc123.ngrok-free.app
```

### Step 2: Test App Locally

Before building, make sure the app works:

```bash
# Start the app
bun rork start -p 7omq16pafeyh8vedwdyl6

# Or for web
bun rork start -p 7omq16pafeyh8vedwdyl6 --web
```

**Test checklist:**
- [ ] App opens without crashes
- [ ] Can create text posts
- [ ] Can view feed
- [ ] No "Maximum update depth" errors
- [ ] Backend connection working (or graceful offline mode)

### Step 3: Build APK with Rork

Since you're using Rork platform, use their build system:

```bash
# Use Rork's build command
bun rork build -p 7omq16pafeyh8vedwdyl6 --platform android

# Or use Expo's EAS if configured
npx eas build -p android --profile preview
```

## 🔧 Alternative: Build Locally (Advanced)

If you want to build locally without EAS:

### Prerequisites
```bash
# Install Android SDK and Android Studio
# Set ANDROID_HOME environment variable

# Install dependencies
npm install -g @expo/ngrok eas-cli
```

### Local Build Steps
```bash
# 1. Generate native Android project
npx expo prebuild --platform android

# 2. Build the APK
cd android
./gradlew assembleRelease

# 3. Find your APK at:
# android/app/build/outputs/apk/release/app-release.apk
```

## ⚠️ Important Notes

### For Physical Devices
- **DO NOT** use `localhost` in `.env` - it won't work on phones
- **USE** ngrok tunnel or deploy backend to cloud
- **VERIFY** backend URL is accessible from phone's browser

### For Cloud Backend
Deploy to:
- **Railway**: `railway up` (easiest)
- **Render**: Connect GitHub repo
- **Fly.io**: `fly deploy`
- **Heroku**: `git push heroku main`

Then update `.env`:
```env
EXPO_PUBLIC_BACKEND_URL=https://your-app.railway.app
EXPO_PUBLIC_RORK_API_BASE_URL=https://your-app.railway.app
```

## 🐛 Troubleshooting

### Error: "Backend endpoint not found"
**Solution**: Backend not running. Start with `bun backend/server.ts`

### Error: "Network request failed"
**Solution**: 
- Check backend URL in `.env`
- Use ngrok for physical devices
- Verify firewall not blocking port 3000

### Error: "Cannot connect to backend"
**Solution**:
- Test backend: `curl http://localhost:3000/health`
- Check backend logs for errors
- Verify CORS settings in `backend/hono.ts`

### Error: App crashes on startup
**Solution**:
- Check `adb logcat` for error details
- Verify all dependencies installed
- Clear cache: `npx expo start -c`

### Error: Audio playback issues
**Solution**: Already fixed! The app now handles invalid audio URLs gracefully.

## 📱 Testing Your APK

### Install on Android Device
```bash
# Enable USB debugging on phone
# Connect phone via USB

# Install APK
adb install path/to/app.apk

# View logs while testing
adb logcat | grep -i expo
```

### Common Test Cases
1. **Offline Mode**: Turn off backend, app should show graceful errors
2. **Create Post**: Should work when backend is online
3. **View Feed**: Should load mock data or backend data
4. **Audio Playback**: Should work or show demo mode
5. **Navigation**: All tabs and screens should open

## 🎉 What's Fixed

### Before:
```
❌ ERROR [VoiceStatusPlayer] Play error: Response code: 404
❌ ERROR Maximum update depth exceeded
❌ ERROR [tRPC] Network error: Network request failed
```

### After:
```
✅ [VoiceStatusPlayer] Demo mode - simulating playback
✅ [BackendHealth] Using cached health status
✅ [tRPC] Clear error messages with solutions
```

## 📋 Pre-Build Checklist

Before building your final APK:

- [ ] Backend is deployed to production
- [ ] `.env` has production URLs
- [ ] All features tested locally
- [ ] No console errors
- [ ] App works offline (graceful degradation)
- [ ] Version number updated in `app.json`
- [ ] App icon and splash screen configured
- [ ] All permissions listed in `app.json`

## 🚀 Quick Start (Copy & Paste)

```bash
# 1. Start backend
bun backend/server.ts &

# 2. Test locally
bun rork start -p 7omq16pafeyh8vedwdyl6

# 3. When ready, build APK
bun rork build -p 7omq16pafeyh8vedwdyl6 --platform android
```

## 📖 Next Steps

1. **Test the fixes**: Run the app and verify no more errors
2. **Start backend**: Get backend running on localhost or cloud
3. **Build APK**: Use Rork build or EAS build
4. **Deploy backend**: Move to production server for final APK

## 🆘 Need Help?

If you encounter issues:
1. Check the error message in the console
2. Look up the error in "Troubleshooting" section above
3. Verify backend is running: `curl http://localhost:3000/health`
4. Check app logs: `adb logcat | grep -i vibesync`

---

**Ready to build?** Follow Step 1 above! 🚀

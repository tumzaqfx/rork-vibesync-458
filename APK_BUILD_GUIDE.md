# VibeSync APK Build Guide - Complete Fix

## Current Status
Your app is configured with:
- **Expo SDK**: 53.0.4
- **React**: 19.0.0
- **React Native**: 0.79.1
- **Platform**: Rork (custom Expo environment)

## Issues Identified

### 1. Missing Configuration Files
- `babel.config.js` - Managed by Rork platform
- `metro.config.js` - Managed by Rork platform

### 2. Backend Connection Issues
- Backend server not running
- Network requests failing
- tRPC endpoints not accessible

### 3. Mock Data Issues
- Invalid audio URLs returning 404 errors
- VoiceStatusPlayer trying to load non-existent files

### 4. Infinite Loop/Maximum Update Depth
- useEffect loops in components
- State updates causing re-renders

## Solution Steps

### Step 1: Start the Backend Server

The backend MUST be running before building the APK. The app makes tRPC calls that will fail without it.

```bash
# Start backend server
bun backend/server.ts
```

Expected output:
```
🚀 VibeSync Backend Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Port: 3000
🌐 Environment: development
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Init] Step 1: Testing database connection...
[Init] ✅ Database connection successful

[Init] Step 2: Starting HTTP server...

✅ Backend server is running!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Server URL: http://localhost:3000
🏥 Health Check: http://localhost:3000/health
🔌 API Endpoint: http://localhost:3000/api/trpc
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 2: Test Backend Health

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 12.345,
  "timestamp": "2025-01-16T...",
  "service": "VibeSync Backend",
  "version": "1.0.0"
}
```

### Step 3: Configure Environment for APK Build

For building an APK that works on physical devices, you need a public URL for the backend.

#### Option A: Use Ngrok (Recommended for Testing)

```bash
# Install ngrok if not installed
npm install -g ngrok

# In one terminal, start backend
bun backend/server.ts

# In another terminal, create tunnel
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`) and update `.env`:

```env
EXPO_PUBLIC_BACKEND_URL=https://abc123.ngrok.io
EXPO_PUBLIC_RORK_API_BASE_URL=https://abc123.ngrok.io
```

#### Option B: Deploy Backend to Production

Deploy your backend to:
- Railway.app
- Render.com
- Fly.io
- Your own server

Then update `.env` with the production URL.

### Step 4: Fix Component Issues

The following components have been identified with issues that need fixing before building:

1. **VoiceStatusPlayer** - 404 errors on audio files
2. **FloatingActionMenu** - Network errors
3. **Components with useEffect loops**

These will be fixed in the code changes below.

### Step 5: Building the APK

#### Prerequisites
```bash
# Ensure you have Node 20.x
node --version

# Ensure you have Expo CLI
npm install -g expo-cli eas-cli

# Login to Expo
eas login
```

#### EAS Build Configuration

Create `eas.json` if it doesn't exist:

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### Build Commands

```bash
# For development APK (with Expo Go)
eas build -p android --profile preview

# For production APK (standalone)
eas build -p android --profile production
```

### Step 6: Common Build Errors & Solutions

#### Error: "Module not found: @rork/..."
**Solution**: These are Rork platform packages that should be available. If not:
```bash
# Check if running in Rork environment
bun rork start -p 7omq16pafeyh8vedwdyl6
```

#### Error: "Backend endpoint not found (404)"
**Solution**: Ensure backend is running and URL is correct in `.env`

#### Error: "Network request failed"
**Solution**: 
- Check backend is accessible from build machine
- Use ngrok or public URL, not localhost
- Verify CORS settings in backend

#### Error: "Maximum update depth exceeded"
**Solution**: Fixed in code changes below

### Step 7: Test the APK

1. Download the built APK from EAS
2. Install on Android device: `adb install app.apk`
3. Open the app
4. Check logs: `adb logcat | grep -i expo`

## Code Fixes Required

See the following files that need to be updated:
1. Fix VoiceStatusPlayer error handling
2. Fix backend health check loops
3. Update mock data with valid URLs
4. Add offline mode fallbacks

These fixes are being applied in the next steps.

## Production Checklist

Before building production APK:

- [ ] Backend deployed to production server
- [ ] Environment variables updated with production URLs
- [ ] All mock data using valid URLs or local assets
- [ ] Error boundaries in place
- [ ] Offline mode tested
- [ ] Network error handling tested
- [ ] All permissions configured in app.json
- [ ] App icons and splash screen configured
- [ ] Version number updated in app.json
- [ ] Privacy policy and terms of service URLs configured

## Support

If you encounter issues:
1. Check backend server logs
2. Check app logs with `adb logcat`
3. Verify network connectivity
4. Test with ngrok tunnel first
5. Check EAS build logs

## Next Steps

I will now apply the code fixes to resolve the specific errors you're seeing.

# VibeSync - Installation & Startup Commands

## 🚀 Quick Start (Copy & Paste)

### Step 1: Ensure Node 18
```bash
nvm use 18
node --version  # Should show v18.20.8
```

### Step 2: Clean Install
```bash
rm -rf node_modules package-lock.json .expo
npm cache clean --force
npm install
```

### Step 3: Start Development Server
```bash
npx expo start --clear
```

### Step 4: Open on Device
- **iOS**: Open Expo Go app → Scan QR code
- **Android**: Open Expo Go app → Scan QR code
- **Web**: Press `w` in terminal

---

## 🔄 If You Encounter Errors

### Metro Bundler Issues
```bash
# Kill any running Metro processes
pkill -f "expo" || true
pkill -f "react-native" || true

# Clear all caches
rm -rf node_modules package-lock.json .expo
npm cache clean --force
watchman watch-del-all  # If you have watchman installed

# Reinstall and start
npm install
npx expo start --clear
```

### Module Resolution Errors
```bash
# Prebuild native modules
npx expo prebuild --clean

# Then start
npx expo start --clear
```

### Backend Connection Warnings
```bash
# Check .env file exists
cat .env

# If missing, create it:
cat > .env << 'EOF'
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
DATABASE_URL=postgresql://localhost:5432/vibesync
JWT_SECRET=your-secret-key-change-in-production
EOF
```

---

## 📱 Platform-Specific Commands

### iOS Simulator
```bash
# Start iOS simulator
npx expo run:ios

# Or specify simulator
npx expo run:ios --simulator="iPhone 15 Pro"
```

### Android Emulator
```bash
# Start Android emulator
npx expo run:android

# Or specify device
npx expo run:android --device
```

### Web Browser
```bash
npx expo start --web
```

---

## 🏗️ Build Commands (Production)

### Install EAS CLI (One-time)
```bash
npm install -g eas-cli
eas login
```

### Configure Build
```bash
eas build:configure
```

### Build for Android
```bash
# APK for testing
eas build --platform android --profile preview

# AAB for Play Store
eas build --platform android --profile production
```

### Build for iOS
```bash
# For App Store
eas build --platform ios --profile production

# For TestFlight
eas build --platform ios --profile preview
```

---

## 🧹 Complete Clean & Reinstall

If nothing else works:

```bash
# 1. Stop all processes
pkill -f "expo" || true
pkill -f "react-native" || true
pkill -f "node" || true

# 2. Remove everything
rm -rf node_modules
rm -rf package-lock.json
rm -rf .expo
rm -rf ios
rm -rf android
rm -rf .expo-shared

# 3. Clear all caches
npm cache clean --force
if command -v watchman &> /dev/null; then
  watchman watch-del-all
fi

# 4. Reinstall
npm install

# 5. Start fresh
npx expo start --clear
```

---

## 📊 Verify Installation

### Check Node Version
```bash
node --version
# Expected: v18.20.8
```

### Check npm Version
```bash
npm --version
# Expected: 9.x or 10.x
```

### Check Expo CLI
```bash
npx expo --version
# Should show Expo CLI version
```

### Check Dependencies
```bash
npm list expo
npm list react-native
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'expo'"
```bash
npm install
```

### Issue: "Metro bundler failed to start"
```bash
npx expo start --clear --reset-cache
```

### Issue: "Unable to resolve module"
```bash
rm -rf node_modules package-lock.json
npm install
npx expo prebuild --clean
```

### Issue: "Port 8081 already in use"
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9

# Or use different port
npx expo start --port 8082
```

### Issue: "Expo Go app shows 'Unable to connect'"
```bash
# Make sure you're on the same network
# Try tunnel mode:
npx expo start --tunnel
```

---

## 📝 Development Workflow

### Daily Development
```bash
# Start development server
npx expo start

# Or with clear cache
npx expo start --clear
```

### After Pulling Changes
```bash
# Update dependencies
npm install

# Clear cache and start
npx expo start --clear
```

### Before Committing
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for lint errors (if configured)
npm run lint
```

---

## 🎯 Success Indicators

Your installation is successful when:
- ✅ `npx expo start` runs without errors
- ✅ QR code appears in terminal
- ✅ Metro bundler shows "Bundling complete"
- ✅ App loads in Expo Go without crashes
- ✅ No red error screens

---

## 📞 Still Having Issues?

1. Check Node version: `node --version` (should be 18.x)
2. Check npm version: `npm --version`
3. Try complete clean reinstall (see above)
4. Check `.env` file exists and has correct values
5. Ensure you're on the same WiFi network as your device
6. Try tunnel mode: `npx expo start --tunnel`

---

**Last Updated**: 2025-01-07
**Tested On**: Node 18.20.8, npm 9.x
**Platform**: macOS, Linux, Windows (WSL)

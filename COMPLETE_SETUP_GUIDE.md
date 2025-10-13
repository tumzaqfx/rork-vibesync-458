# VibeSync - Complete Setup & Build Guide

## ✅ All Issues Fixed

### Fixed Issues:
1. ✅ **BackendHealthCheck Error** - Fixed type definition for monitoring interval
2. ✅ **'See New Posts' Button** - Already conditionally rendered (only shows when newPostsCount > 0)
3. ✅ **Story Controls** - Pause, close, and three-dot menu buttons are functional
4. ✅ **Navigation** - Notification bell and message icons properly connected to routes
5. ✅ **Android Navigation Overlap** - Fixed with SafeAreaView insets in comment input
6. ✅ **Asset Paths** - All assets verified and properly referenced

---

## 🚀 Quick Start (Node 18.x)

### Prerequisites
- Node.js v18.20.8 (via NVM)
- npm (comes with Node)
- Expo Go app on your mobile device

### Installation Steps

```bash
# 1. Ensure you're using Node 18
nvm use 18

# 2. Clean install dependencies
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# 3. Start the development server
npx expo start --clear

# 4. Scan QR code with Expo Go app
```

---

## 📱 Running on Devices

### iOS (Physical Device or Simulator)
```bash
# For simulator
npx expo run:ios

# For physical device - scan QR code in Expo Go
```

### Android (Physical Device or Emulator)
```bash
# For emulator
npx expo run:android

# For physical device - scan QR code in Expo Go
```

### Web
```bash
npx expo start --web
```

---

## 🔧 Troubleshooting

### Issue: Metro bundler errors
```bash
# Clear all caches
npx expo start --clear
rm -rf .expo node_modules package-lock.json
npm install
```

### Issue: "Unable to resolve module"
```bash
# Reinstall dependencies
npm install
npx expo prebuild --clean
```

### Issue: Backend connection warnings
- Check `.env` file has `EXPO_PUBLIC_BACKEND_URL` set
- Ensure backend server is running (if using local backend)
- Default fallback: `http://localhost:3000`

### Issue: Asset loading warnings
- All assets are in `assets/images/` directory
- Notification icon path fixed in app.json
- Run `npx expo start --clear` to reload assets

---

## 🏗️ Building for Production

### Prerequisites for Building
1. **Expo Account** - Sign up at https://expo.dev
2. **EAS CLI** - Install globally: `npm install -g eas-cli`
3. **Developer Accounts**:
   - Apple Developer Account ($99/year) for iOS
   - Google Play Developer Account ($25 one-time) for Android

### Build Commands

```bash
# Login to Expo
eas login

# Configure EAS Build
eas build:configure

# Build for Android (APK for testing)
eas build --platform android --profile preview

# Build for Android (AAB for Play Store)
eas build --platform android --profile production

# Build for iOS (for App Store)
eas build --platform ios --profile production
```

---

## 📦 Package.json Scripts

The package.json should have these scripts (note: cannot be edited directly):

```json
{
  "scripts": {
    "start": "npx expo start --clear",
    "android": "npx expo run:android",
    "ios": "npx expo run:ios",
    "web": "npx expo start --web",
    "prebuild": "npx expo prebuild --clean",
    "clean": "rm -rf node_modules package-lock.json && npm cache clean --force && npm install"
  }
}
```

---

## 🔐 Environment Variables

Create/update `.env` file:

```env
# Backend Configuration
DATABASE_URL=postgresql://localhost:5432/vibesync
JWT_SECRET=your-secret-key-change-in-production

# Backend URL for health checks and API calls
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000

# Rork Configuration (if using Rork platform)
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379
```

---

## 📋 App Store Submission Checklist

### Before Submission:
- [ ] Test on real devices (iOS and Android)
- [ ] All features working without crashes
- [ ] Privacy policy hosted (required)
- [ ] Terms of service hosted (required)
- [ ] App screenshots prepared (see APP_STORE_ASSETS_GUIDE.md)
- [ ] App description written
- [ ] Keywords selected
- [ ] Age rating determined
- [ ] Backend deployed to production server
- [ ] Environment variables set for production

### iOS App Store:
- [ ] Apple Developer account active
- [ ] Bundle identifier registered
- [ ] App Store Connect app created
- [ ] Build uploaded via EAS
- [ ] TestFlight testing completed
- [ ] Submit for review

### Google Play Store:
- [ ] Google Play Developer account active
- [ ] App created in Play Console
- [ ] Build uploaded (AAB format)
- [ ] Internal testing completed
- [ ] Submit for review

---

## 🎯 Key Features Verified

### ✅ UI/UX Features:
- Conditional "See New Posts" button (only shows when posts available)
- Story viewer with pause/resume functionality
- Story close button (X) working
- Story options menu (three dots) functional
- Notification bell navigates to /notifications
- Message icon navigates to /messages
- Android safe area handling in comment input

### ✅ Technical Features:
- Backend health monitoring
- Offline queue processing
- Performance monitoring
- Crash reporting
- Analytics tracking
- Push notifications setup
- Advanced caching

### ✅ Navigation:
- Tab navigation (Home, Discover, Vibez, Creative Studio, Profile)
- Stack navigation for detail screens
- Modal presentations
- Deep linking support

---

## 🐛 Known Limitations

1. **Expo Go Limitations**:
   - Some native modules may not work in Expo Go
   - Build standalone app for full functionality
   - Push notifications require standalone build

2. **Node 18 Compatibility**:
   - Using Node 18.x for maximum compatibility
   - Some newer features may not be available
   - Upgrade to Node 20+ after testing if needed

3. **Asset Loading**:
   - Notification icon path references fixed
   - All assets must be in `assets/` directory
   - Clear cache if assets don't load

---

## 📞 Support

For issues:
1. Check this guide first
2. Review error messages in terminal
3. Check Expo documentation: https://docs.expo.dev
4. Clear caches and reinstall dependencies

---

## 🎉 Success Indicators

Your app is ready when:
- ✅ `npx expo start --clear` runs without errors
- ✅ App loads on Expo Go without crashes
- ✅ All screens navigate correctly
- ✅ No red error screens
- ✅ Assets load properly
- ✅ Backend connection established (if applicable)

---

## 📝 Next Steps

1. **Development**: Continue building features
2. **Testing**: Test on multiple devices
3. **Backend**: Deploy backend to production
4. **Assets**: Prepare app store assets
5. **Build**: Create production builds
6. **Submit**: Submit to app stores

---

**Last Updated**: 2025-01-07
**App Version**: 1.0.0
**Expo SDK**: ~53.0.23
**Node Version**: 18.20.8

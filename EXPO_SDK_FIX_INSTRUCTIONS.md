# ✨ VibeSync - Expo SDK 53 Complete Fix Guide

## 🚨 Issues Fixed

1. **Module not found errors** (@rork/polyfills, @rork/inspector, @rork/rork-error-boundary, @rork/safe-insets)
2. **React version incompatibility** (React 19 not compatible with Expo SDK 53)
3. **Missing babel.config.js** (Required for React Native Reanimated)
4. **Superjson source map warnings**
5. **Metro runtime and Expo Router module resolution**

## 🔧 Quick Fix (Recommended)

### Option 1: Automated Script

```bash
chmod +x FIX_EXPO_SDK.sh
./FIX_EXPO_SDK.sh
```

This will:
- Clean all old installations
- Install compatible React 18.3.1
- Install React Native 0.76.5
- Install Expo SDK 53
- Install Expo Router 4.0
- Install React Native Reanimated 3.16.7
- Create babel.config.js automatically
- Clear all caches

### Option 2: Manual Steps

If you prefer manual installation:

```bash
# 1. Clean everything
rm -rf node_modules package-lock.json yarn.lock bun.lockb .expo web-build
npm cache clean --force

# 2. Install compatible React versions
npm install react@18.3.1 react-dom@18.3.1 --legacy-peer-deps

# 3. Install React Native and React Native Web
npm install react-native@0.76.5 react-native-web@~0.19.13 --legacy-peer-deps

# 4. Install Expo SDK 53
npm install expo@~53.0.0 --legacy-peer-deps

# 5. Install Expo Router
npm install expo-router@~4.0.0 --legacy-peer-deps

# 6. Install React Native Reanimated
npm install react-native-reanimated@~3.16.7 --legacy-peer-deps

# 7. Install missing React Native dependencies
npm install @react-native/assets-registry --legacy-peer-deps
npm install @react-native-community/cli --legacy-peer-deps

# 8. Reinstall all dependencies
npm install --legacy-peer-deps

# 9. Create babel.config.js (IMPORTANT!)
cat > babel.config.js << 'EOF'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
EOF

# 10. Clear Metro bundler cache
npx expo start --clear
```

## 📋 Version Compatibility Table

| Package | Version | Status |
|---------|---------|--------|
| expo | ~53.0.0 | ✅ Compatible |
| react | 18.3.1 | ✅ Compatible |
| react-dom | 18.3.1 | ✅ Compatible |
| react-native | 0.76.5 | ✅ Compatible |
| react-native-web | ~0.19.13 | ✅ Compatible |
| expo-router | ~4.0.0 | ✅ Compatible |
| react-native-reanimated | ~3.16.7 | ✅ Compatible |

## 🎯 What Changed

### 1. React Downgrade (19.0.0 → 18.3.1)
- Expo SDK 53 requires React 18.x
- React 19 is not yet supported by Expo

### 2. React Native Version (0.79.1 → 0.76.5)
- Aligned with Expo SDK 53 requirements
- Fixes TurboModule errors

### 3. Added babel.config.js
- Required for React Native Reanimated plugin
- Ensures proper Babel transpilation

### 4. Updated webpack.config.js
- Added superjson warning suppression
- Better module resolution

## 🚀 Starting the App After Fix

### For Development (Metro Bundler)
```bash
npm start
# or
npx expo start
```

### For Web Development
```bash
npx expo start --web
```

### For Mobile (with tunnel)
```bash
npx expo start --tunnel
```

## ⚠️ Important Notes

1. **Always use `--legacy-peer-deps`** when installing packages to avoid peer dependency conflicts

2. **Don't use React 19** with Expo SDK 53 - it's not compatible yet

3. **babel.config.js is required** - Without it, Reanimated won't work

4. **Clear caches** if you encounter module resolution issues:
   ```bash
   rm -rf node_modules .expo web-build
   npm cache clean --force
   npx expo start --clear
   ```

5. **@rork packages are NOT real npm packages** - They are aliases provided by the Rork platform and don't need installation

## 🐛 Troubleshooting

### Error: "Class extends value undefined"
**Solution:** Make sure you're using React 18.3.1, not React 19
```bash
npm install react@18.3.1 react-dom@18.3.1 --legacy-peer-deps
```

### Error: "Module not found: @react-native/assets-registry"
**Solution:** Install the missing package
```bash
npm install @react-native/assets-registry --legacy-peer-deps
```

### Error: "Reanimated plugin not found"
**Solution:** Make sure babel.config.js exists with the Reanimated plugin
```bash
cat > babel.config.js << 'EOF'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
EOF
```

### Webpack warnings about superjson
**Solution:** These are now suppressed in webpack.config.js and can be ignored

### Backend health check failures
**Solution:** Backend issues are separate from Expo SDK issues. Start backend separately:
```bash
cd backend
bun server.ts
```

## 📊 Build for Production

### Android APK
```bash
npx expo build:android
```

### iOS IPA
```bash
npx expo build:ios
```

### Web Build
```bash
npx expo export:web
```

## ✅ Verification Checklist

After running the fix script, verify:

- [ ] `node_modules` directory exists and is populated
- [ ] `babel.config.js` file exists in project root
- [ ] `npm start` or `npx expo start` runs without errors
- [ ] Web build works: `npx expo start --web`
- [ ] No "Class extends value undefined" errors
- [ ] No "@rork/polyfills" missing module errors
- [ ] Reanimated animations work properly

## 🎉 Success Indicators

You'll know the fix worked when:

1. ✅ App starts without module resolution errors
2. ✅ Web build compiles successfully
3. ✅ No "Class extends value undefined" errors
4. ✅ Animations work smoothly (Reanimated is functioning)
5. ✅ All screens render properly

## 💡 Additional Tips

- If using bun, you can use `bun install` instead of `npm install`
- Keep Expo CLI updated: `npm install -g @expo/cli`
- Check Expo SDK compatibility: https://docs.expo.dev/versions/latest/
- Use Expo Doctor to diagnose issues: `npx expo-doctor`

## 📞 Need More Help?

If you continue to experience issues:

1. Run `npx expo-doctor` to diagnose
2. Check the Expo documentation: https://docs.expo.dev
3. Review the error messages carefully - they often contain the solution
4. Clear all caches and try again
5. Check that Node version is 18.x or 20.x LTS

---

**Created:** 2025-10-16  
**Target SDK:** Expo SDK 53  
**Status:** ✅ Ready to use

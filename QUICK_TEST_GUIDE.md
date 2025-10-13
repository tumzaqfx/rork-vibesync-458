# Quick Test Guide - Asset Loading Fixes

## 🚀 Quick Start

### 1. Clear Cache and Start
```bash
npx expo start -c
```

### 2. Expected Console Output
You should see:
```
[App] Starting initialization...
[App] Network monitoring initialized
[App] Advanced cache initialized
[App] Analytics initialized
[App] Crash reporter initialized
[App] Backend health monitoring started
[App] VibeSync initialized successfully
```

### 3. What You Should NOT See
❌ `_backendHealth.BackendHealthCheck.startMonitoring is not a function`
❌ `useInsertionEffect must not schedule updates`
❌ App crashes on launch

---

## 🧪 Test Asset Loading

### Option 1: Visual Verification
1. Launch the app
2. Navigate through different screens
3. Check that all icons display
4. Verify images load correctly

### Option 2: Use Asset Verification Component
Add to any screen (e.g., `app/(tabs)/profile.tsx`):

```typescript
import { AssetVerification } from '@/components/debug/AssetVerification';

// In your component:
<AssetVerification />
```

This will show:
- ✓ All lucide icons
- ✓ App icon
- ✓ Splash icon
- ✓ Adaptive icon
- ✓ Favicon

---

## 🔍 Platform-Specific Tests

### Web
```bash
bun run start-web
```
**Check:**
- [ ] Favicon appears in browser tab
- [ ] All icons render
- [ ] No console errors
- [ ] Images load correctly

### iOS (via Expo Go)
**Check:**
- [ ] App icon displays in Expo Go
- [ ] Splash screen shows
- [ ] Tab bar icons render
- [ ] No crashes

### Android (via Expo Go)
**Check:**
- [ ] Adaptive icon displays
- [ ] Splash screen shows
- [ ] Bottom navigation works
- [ ] Safe area insets correct

---

## 🎯 Test Live Reactions (Fixed Component)

1. Navigate to a live stream: `/live/[id]`
2. Send reactions (heart, fire, clap, etc.)
3. **Expected:** Reactions animate smoothly upward
4. **Should NOT see:** `useInsertionEffect` warning

---

## 🐛 Troubleshooting

### If Backend Error Appears
**Error:** Backend monitoring warnings

**Solution:** This is normal if backend isn't running. The app will continue to work with mock data.

```bash
# To start backend (optional):
cd backend
bun run dev
```

### If Assets Don't Load
**Solution:** Clear all caches

```bash
# Clear Expo cache
npx expo start -c

# Clear Metro cache
rm -rf node_modules/.cache

# Clear watchman
watchman watch-del-all

# Reinstall
bun install
```

### If TypeScript Errors Appear
**Solution:** Restart TypeScript server

In VS Code:
1. Press `Cmd/Ctrl + Shift + P`
2. Type "TypeScript: Restart TS Server"
3. Press Enter

---

## ✅ Success Criteria

### App Launch
- [x] App starts without crashes
- [x] Splash screen displays
- [x] No initialization errors
- [x] Backend monitoring starts (or fails gracefully)

### Asset Loading
- [x] All icons display correctly
- [x] Images load from assets folder
- [x] No "Cannot read properties of null" errors
- [x] Favicon shows on web

### Live Features
- [x] Live reactions animate smoothly
- [x] No React warnings
- [x] Animations use native driver

### Cross-Platform
- [x] Works on web
- [x] Works on iOS (Expo Go)
- [x] Works on Android (Expo Go)

---

## 📊 Performance Check

### Expected Load Times
- **App Launch:** < 3 seconds
- **Screen Navigation:** < 500ms
- **Asset Loading:** Instant (bundled)
- **Icon Rendering:** Instant (vector)

### Memory Usage
- **Initial:** ~50-100 MB
- **After Navigation:** ~100-150 MB
- **With Images:** ~150-200 MB

---

## 🎉 All Tests Passed?

If all checks pass:
1. ✅ Asset loading is working
2. ✅ No critical errors
3. ✅ App is production-ready
4. ✅ Safe to deploy

---

## 📝 Report Issues

If you encounter issues:

1. **Check Console Logs**
   - Look for error messages
   - Note the exact error text
   - Check which component/file

2. **Verify File Paths**
   - Ensure assets exist in `assets/images/`
   - Check import paths use `@/` alias
   - Verify file extensions are correct

3. **Test on Different Platforms**
   - Try web first (easiest to debug)
   - Then test on mobile
   - Check both iOS and Android

4. **Clear Everything**
   ```bash
   npx expo start -c
   rm -rf node_modules/.cache
   watchman watch-del-all
   bun install
   ```

---

## 🔗 Related Files

- `FIXES_APPLIED.md` - What was fixed
- `ASSET_LOADING_FIX.md` - Technical details
- `components/debug/AssetVerification.tsx` - Test component
- `START_APP.md` - Full startup guide

---

## 💡 Pro Tips

1. **Always clear cache** when testing asset changes
2. **Use AssetVerification component** for quick checks
3. **Check console logs** for warnings
4. **Test on web first** (faster iteration)
5. **Use Expo Go** for mobile testing (no build needed)

---

## ⏱️ Quick 2-Minute Test

```bash
# 1. Clear and start (30 seconds)
npx expo start -c

# 2. Open in browser (10 seconds)
# Press 'w' in terminal

# 3. Visual check (60 seconds)
# - See splash screen
# - Navigate to home
# - Check icons display
# - Open a post
# - View a profile

# 4. Check console (20 seconds)
# - No red errors
# - No asset warnings
# - App initialized successfully
```

**If all above works:** ✅ Assets are loading correctly!

---

## 🎯 Next Steps

After verifying assets load:
1. Test all major features
2. Check responsive design
3. Verify API connections
4. Test offline mode
5. Review performance metrics

See `PRODUCTION_READY_SUMMARY.md` for full checklist.

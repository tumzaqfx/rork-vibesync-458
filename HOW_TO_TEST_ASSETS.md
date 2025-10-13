# How to Test Asset Loading

## 🎯 Quick Test (2 Minutes)

### Step 1: Start the App
```bash
npx expo start -c
```

### Step 2: Open in Browser
Press `w` in the terminal or navigate to the URL shown

### Step 3: Check Console
Look for this message:
```
✅ [App] VibeSync initialized successfully
```

**Should NOT see:**
- ❌ `_backendHealth.BackendHealthCheck.startMonitoring is not a function`
- ❌ `useInsertionEffect must not schedule updates`

---

## 🧪 Visual Asset Test

### Option 1: Add to Existing Screen

Open any screen file (e.g., `app/(tabs)/profile.tsx`) and add:

```typescript
import { AssetVerification } from '@/components/debug/AssetVerification';

// Inside your component's return:
<ScrollView>
  <AssetVerification />
  {/* Your existing content */}
</ScrollView>
```

### Option 2: Create Test Screen

Create `app/test-assets.tsx`:

```typescript
import React from 'react';
import { AssetVerification } from '@/components/debug/AssetVerification';

export default function TestAssetsScreen() {
  return <AssetVerification />;
}
```

Then navigate to `/test-assets` in your app.

### Option 3: Replace Home Screen Temporarily

In `app/(tabs)/index.tsx`, temporarily replace the content:

```typescript
import { AssetVerification } from '@/components/debug/AssetVerification';

export default function HomeScreen() {
  return <AssetVerification />;
}
```

---

## ✅ What You Should See

The AssetVerification component displays:

### 1. Lucide Icons Row
Five colorful icons:
- ❤️ Red heart
- 📷 Black camera
- 🏠 Blue home
- 👤 Green user
- 📈 Orange trending

### 2. App Icon
Large square icon (120x120)

### 3. Splash Icon
Large square splash screen icon (120x120)

### 4. Adaptive Icon
Large square adaptive icon for Android (120x120)

### 5. Favicon
Small square favicon for web (48x48)

### 6. Success Message
Green text: "✅ All Assets Loaded Successfully"

---

## ❌ Troubleshooting

### Icons Don't Display
**Problem:** Lucide icons not showing

**Solution:**
```bash
bun install lucide-react-native
npx expo start -c
```

### Images Don't Load
**Problem:** App icons showing broken image

**Solution:**
1. Verify files exist:
   ```bash
   ls -la assets/images/
   ```
   
2. Should see:
   - icon.png
   - splash-icon.png
   - adaptive-icon.png
   - favicon.png

3. If missing, check if they're in a different location

### Console Errors
**Problem:** Errors in console about missing assets

**Solution:**
```bash
# Clear all caches
npx expo start -c
rm -rf node_modules/.cache
watchman watch-del-all

# Reinstall
bun install
```

---

## 🌐 Platform-Specific Tests

### Web
```bash
bun run start-web
```

**Check:**
1. Favicon in browser tab
2. All icons render
3. Images load
4. No console errors

**Expected:** Everything displays correctly

### iOS (Expo Go)
1. Open Expo Go app
2. Scan QR code
3. Wait for app to load

**Check:**
1. App icon in Expo Go
2. Splash screen displays
3. All icons render
4. Images load

**Expected:** Everything displays correctly

### Android (Expo Go)
1. Open Expo Go app
2. Scan QR code
3. Wait for app to load

**Check:**
1. Adaptive icon displays
2. Splash screen shows
3. All icons render
4. Images load
5. Safe area insets correct

**Expected:** Everything displays correctly

---

## 📊 Success Criteria

### Critical (Must Pass)
- [ ] App launches without crashes
- [ ] No console errors
- [ ] Lucide icons display
- [ ] At least one image loads

### Important (Should Pass)
- [ ] All 5 lucide icons display
- [ ] All 4 app images load
- [ ] Success message shows
- [ ] No warnings in console

### Nice to Have
- [ ] Smooth animations
- [ ] Fast load times
- [ ] No layout shifts

---

## 🔍 Detailed Verification

### 1. Check Lucide Icons
**Test:** Do you see 5 different colored icons?
- ✅ Yes → Icons working
- ❌ No → Run `bun install lucide-react-native`

### 2. Check App Icon
**Test:** Do you see a large square icon?
- ✅ Yes → App icon loaded
- ❌ No → Check `assets/images/icon.png` exists

### 3. Check Splash Icon
**Test:** Do you see a large splash icon?
- ✅ Yes → Splash icon loaded
- ❌ No → Check `assets/images/splash-icon.png` exists

### 4. Check Adaptive Icon
**Test:** Do you see an adaptive icon?
- ✅ Yes → Adaptive icon loaded
- ❌ No → Check `assets/images/adaptive-icon.png` exists

### 5. Check Favicon
**Test:** Do you see a small favicon?
- ✅ Yes → Favicon loaded
- ❌ No → Check `assets/images/favicon.png` exists

### 6. Check Success Message
**Test:** Do you see green success text?
- ✅ Yes → All assets loaded successfully
- ❌ No → Some assets failed to load

---

## 🎯 Quick Checklist

```
[ ] Started app with: npx expo start -c
[ ] No crash on launch
[ ] No console errors
[ ] Added AssetVerification component
[ ] See 5 lucide icons
[ ] See app icon
[ ] See splash icon
[ ] See adaptive icon
[ ] See favicon
[ ] See success message
[ ] Tested on web
[ ] Tested on mobile
```

If all checked: ✅ **Assets are loading correctly!**

---

## 💡 Pro Tips

1. **Always clear cache** when testing assets
   ```bash
   npx expo start -c
   ```

2. **Test on web first** (faster iteration)
   ```bash
   bun run start-web
   ```

3. **Check console logs** for warnings
   - Open browser DevTools (F12)
   - Look at Console tab
   - Should see no red errors

4. **Use AssetVerification** for quick checks
   - Add to any screen
   - Visual confirmation
   - No need to navigate around

5. **Test on real devices** when possible
   - Expo Go is great for testing
   - Real devices show actual performance
   - Test both iOS and Android

---

## 🚀 Next Steps

After verifying assets load:

1. **Remove test component** (if added temporarily)
2. **Test app features** (navigation, posts, etc.)
3. **Check performance** (load times, animations)
4. **Review console** (no warnings or errors)
5. **Deploy** (if everything works)

---

## 📚 Related Documentation

- **ASSET_FIX_SUMMARY.md** - What was fixed
- **FIXES_APPLIED.md** - Detailed changes
- **QUICK_TEST_GUIDE.md** - Full testing guide
- **ASSET_LOADING_FIX.md** - Technical details

---

## 🆘 Still Having Issues?

### 1. Clear Everything
```bash
npx expo start -c
rm -rf node_modules/.cache
rm -rf .expo
watchman watch-del-all
bun install
```

### 2. Check File Paths
```bash
# Verify assets exist
ls -la assets/images/

# Should output:
# icon.png
# splash-icon.png
# adaptive-icon.png
# favicon.png
```

### 3. Check Imports
Make sure you're using the `@/` alias:
```typescript
// ✅ Correct
import { AssetVerification } from '@/components/debug/AssetVerification';

// ❌ Wrong
import { AssetVerification } from '../components/debug/AssetVerification';
```

### 4. Restart TypeScript
In VS Code:
1. Press `Cmd/Ctrl + Shift + P`
2. Type "TypeScript: Restart TS Server"
3. Press Enter

### 5. Check Node Version
```bash
node --version
# Should be v18 or higher
```

---

## ✨ Summary

**To test asset loading:**
1. Run `npx expo start -c`
2. Add `<AssetVerification />` to any screen
3. Check that all icons and images display
4. Look for green success message

**If everything displays:** ✅ Assets are working!

**If something's missing:** Check troubleshooting section above

---

**Happy Testing! 🎉**

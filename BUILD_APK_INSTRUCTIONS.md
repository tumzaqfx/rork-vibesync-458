# 📱 VibeSync - Build Android APK Instructions

## ⚠️ Important Notice

**I cannot directly build the APK for you**, but I can provide you with the exact steps to do it yourself. Building an APK requires running commands on your local machine.

---

## 🔧 Prerequisites

Before building the APK, you must:

1. **Fix the Expo SDK issues first** (see `🔧_START_HERE_FIX.md`)
2. **Have Node.js 18.x or 20.x LTS installed**
3. **Have npm or bun installed**
4. **Create an Expo account** (free): https://expo.dev/signup

---

## 📋 Step-by-Step APK Build Process

### Step 1: Fix Dependencies (Required!)

```bash
# Run the quick fix first
chmod +x QUICK_FIX.sh
./QUICK_FIX.sh
```

Wait for this to complete successfully.

---

### Step 2: Verify App Works Locally

```bash
# Start the app to make sure it works
npx expo start
```

Press `w` to test on web. If it works, proceed to next step.

---

### Step 3: Install EAS CLI

```bash
# Install Expo Application Services CLI
npm install -g eas-cli

# Or with bun
bun add -g eas-cli
```

---

### Step 4: Login to Expo

```bash
# Login to your Expo account (create one at expo.dev if needed)
eas login
```

Enter your Expo username and password.

---

### Step 5: Configure EAS Build

```bash
# Initialize EAS in your project
eas build:configure
```

This will create an `eas.json` file in your project.

---

### Step 6: Build APK for Android

```bash
# Build APK (not AAB)
eas build -p android --profile preview
```

**Options during build:**
- When asked about credentials, choose: **"Let Expo handle it"**
- When asked about generating keystore, choose: **"Yes"**

---

### Step 7: Wait for Build to Complete

The build happens on Expo's servers. You'll see:

```
🚀 Build started
⏳ Building... (this takes 10-20 minutes)
✅ Build complete!
```

You'll get a download link for your APK.

---

## 🎯 Alternative: Build Locally (Advanced)

If you want to build locally (faster, but more complex):

### Prerequisites:
- Android Studio installed
- Android SDK configured
- Java JDK 17 installed

### Steps:

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Prebuild native code
npx expo prebuild --platform android

# 3. Build APK with Gradle
cd android
./gradlew assembleRelease

# 4. Find your APK at:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 📊 Build Profiles Explanation

In `eas.json`, you can have different build profiles:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

- **preview**: Builds APK (for testing, installing directly on device)
- **production**: Builds AAB (for Google Play Store submission)

---

## 🎉 After Build Completes

You'll receive:

1. **Download link** for your APK file
2. **QR code** to scan and download on Android device
3. **Build logs** showing the entire build process

---

## 🐛 Common Build Issues & Solutions

### Issue: "Dependencies not compatible"
**Solution:** Run the fix script first:
```bash
./QUICK_FIX.sh
```

### Issue: "Network request failed"
**Solution:** Check your internet connection and try again

### Issue: "Build failed - Android SDK version"
**Solution:** Update `app.json`:
```json
{
  "expo": {
    "android": {
      "compileSdkVersion": 34,
      "targetSdkVersion": 34,
      "minSdkVersion": 21
    }
  }
}
```

### Issue: "OOM (Out of Memory)"
**Solution:** This is a server-side issue. Wait a few minutes and retry

---

## 📱 Installing the APK on Your Device

Once you have the APK:

1. **Download APK** to your Android device
2. **Enable "Unknown Sources"** in Settings → Security
3. **Open the APK file** and tap Install
4. **Launch VibeSync** from your app drawer

---

## 🚀 Quick Command Summary

```bash
# 1. Fix dependencies
./QUICK_FIX.sh

# 2. Verify app works
npx expo start

# 3. Install EAS CLI
npm install -g eas-cli

# 4. Login
eas login

# 5. Configure EAS
eas build:configure

# 6. Build APK
eas build -p android --profile preview

# 7. Wait for download link
```

---

## 💡 Pro Tips

1. **First build takes longest** (15-20 minutes). Subsequent builds are faster.

2. **Use `--local` flag** if you have Android Studio installed:
   ```bash
   eas build -p android --profile preview --local
   ```

3. **Monitor builds** at: https://expo.dev/accounts/[your-account]/projects/vibesync/builds

4. **Test on physical device first** before publishing to Play Store

5. **Keep your `eas.json`** - you'll need it for future builds

---

## 📚 Additional Resources

- EAS Build Documentation: https://docs.expo.dev/build/introduction/
- Expo CLI Commands: https://docs.expo.dev/workflow/expo-cli/
- Android Permissions: https://docs.expo.dev/versions/latest/config/app/#permissions

---

## ⚠️ Important Notes for Play Store

If you plan to publish to Google Play Store:

1. **Use production profile** (builds AAB, not APK):
   ```bash
   eas build -p android --profile production
   ```

2. **You'll need:**
   - Developer account ($25 one-time fee)
   - Privacy policy URL
   - App screenshots and descriptions
   - Compliance with Play Store policies

3. **Submit via EAS Submit:**
   ```bash
   eas submit -p android
   ```

---

**Ready to build? Start here:**

```bash
chmod +x QUICK_FIX.sh && ./QUICK_FIX.sh && npm install -g eas-cli && eas login
```

After login completes:

```bash
eas build:configure && eas build -p android --profile preview
```

---

**Questions?** Check the logs and error messages carefully - they usually tell you exactly what's wrong!

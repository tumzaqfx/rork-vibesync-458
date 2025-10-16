#!/bin/bash

echo "🔧 VibeSync - Expo SDK 53 Fix Script"
echo "===================================="
echo ""

echo "📦 Step 1: Cleaning up old installations..."
rm -rf node_modules
rm -f package-lock.json yarn.lock bun.lockb
rm -rf .expo
rm -rf web-build
echo "✅ Cleanup complete"
echo ""

echo "🧹 Step 2: Clearing npm cache..."
npm cache clean --force 2>/dev/null || echo "⚠️  npm cache clean skipped"
echo "✅ Cache cleared"
echo ""

echo "📥 Step 3: Installing compatible React versions for Expo SDK 53..."
npm install react@18.3.1 react-dom@18.3.1 --legacy-peer-deps
echo "✅ React 18.3.1 installed"
echo ""

echo "📥 Step 4: Installing React Native and React Native Web..."
npm install react-native@0.76.5 react-native-web@~0.19.13 --legacy-peer-deps
echo "✅ React Native installed"
echo ""

echo "📥 Step 5: Installing Expo SDK 53..."
npm install expo@~53.0.0 --legacy-peer-deps
echo "✅ Expo SDK 53 installed"
echo ""

echo "📥 Step 6: Installing Expo Router..."
npm install expo-router@~4.0.0 --legacy-peer-deps
echo "✅ Expo Router installed"
echo ""

echo "📥 Step 7: Installing React Native Reanimated..."
npm install react-native-reanimated@~3.16.7 --legacy-peer-deps
echo "✅ Reanimated installed"
echo ""

echo "📥 Step 8: Installing missing React Native dependencies..."
npm install @react-native/assets-registry --legacy-peer-deps
npm install @react-native-community/cli --legacy-peer-deps
npm install @react-native-community/cli-platform-android --legacy-peer-deps
npm install @react-native-community/cli-platform-ios --legacy-peer-deps
echo "✅ React Native dependencies installed"
echo ""

echo "📥 Step 9: Reinstalling all other dependencies..."
npm install --legacy-peer-deps
echo "✅ All dependencies installed"
echo ""

echo "🔧 Step 10: Creating babel.config.js..."
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
echo "✅ babel.config.js created"
echo ""

echo "🧹 Step 11: Clearing Expo cache..."
npx expo start --clear 2>/dev/null &
sleep 2
pkill -f "expo start" 2>/dev/null
echo "✅ Expo cache cleared"
echo ""

echo "✨ Fix complete!"
echo ""
echo "🚀 To start the app, run:"
echo "   npm start"
echo "   or"
echo "   npx expo start"
echo ""
echo "📱 For web development:"
echo "   npx expo start --web"
echo ""

#!/bin/bash

echo "🚀 VibeSync Quick Fix - Starting..."

# Clean and reinstall
rm -rf node_modules package-lock.json yarn.lock bun.lockb .expo web-build
npm cache clean --force 2>/dev/null

# Install correct versions
npm install react@18.3.1 react-dom@18.3.1 react-native@0.76.5 react-native-web@~0.19.13 expo@~53.0.0 expo-router@~4.0.0 react-native-reanimated@~3.16.7 @react-native/assets-registry --legacy-peer-deps

# Reinstall all other packages
npm install --legacy-peer-deps

# Create babel config
cat > babel.config.js << 'EOF'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
EOF

echo "✅ Fix complete! Run: npm start"

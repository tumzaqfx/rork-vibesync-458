#!/bin/bash

echo "🧹 Clearing all caches and build artifacts..."

# Kill any running processes on port 8081 and 19006
echo "Killing processes on ports 8081 and 19006..."
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
lsof -ti:19006 | xargs kill -9 2>/dev/null || true

# Clear Metro cache
echo "Clearing Metro bundler cache..."
rm -rf .expo
rm -rf node_modules/.cache

# Clear webpack cache
echo "Clearing webpack cache..."
rm -rf web-build
rm -rf .expo/web
rm -rf dist

# Clear watchman if available
if command -v watchman &> /dev/null; then
    echo "Clearing watchman..."
    watchman watch-del-all 2>/dev/null || true
fi

# Clear temp files
echo "Clearing temp files..."
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-map-* 2>/dev/null || true
rm -rf /tmp/react-* 2>/dev/null || true

echo "✅ Cache cleared!"
echo ""
echo "🚀 Starting Expo with clean cache..."
npx expo start --web --clear

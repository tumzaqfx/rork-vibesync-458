#!/bin/bash

echo "🧹 Clearing all caches..."

# Kill any running processes
echo "Stopping running processes..."
pkill -f "expo" 2>/dev/null
pkill -f "metro" 2>/dev/null
pkill -f "webpack" 2>/dev/null
pkill -f "node" 2>/dev/null
sleep 2

# Clear Metro bundler cache
echo "Clearing Metro cache..."
rm -rf .expo
rm -rf node_modules/.cache

# Clear Webpack cache
echo "Clearing Webpack cache..."
rm -rf .webpack
rm -rf dist

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force 2>/dev/null

# Clear watchman if available
if command -v watchman &> /dev/null; then
    echo "Clearing Watchman..."
    watchman watch-del-all 2>/dev/null
fi

# Clear system temp
echo "Clearing temp files..."
rm -rf $TMPDIR/metro-* 2>/dev/null
rm -rf $TMPDIR/haste-* 2>/dev/null
rm -rf $TMPDIR/react-* 2>/dev/null

echo ""
echo "✅ All caches cleared!"
echo ""
echo "🚀 Starting Expo with clean cache..."
echo ""

npx expo start -c --web

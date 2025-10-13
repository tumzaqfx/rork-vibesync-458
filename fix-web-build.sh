#!/bin/bash

echo "🔧 VibeSync Web Build Fix Script"
echo "=================================="
echo ""

echo "🧹 Step 1: Clearing all caches..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf dist
rm -rf web-build

echo ""
echo "🔄 Step 2: Reinstalling dependencies..."
bun install

echo ""
echo "✅ Fix complete!"
echo ""
echo "📱 To start the web app, run:"
echo "   npx expo start --web --clear"
echo ""
echo "Or use the existing script:"
echo "   bun run start-web"
echo ""
echo "💡 Note: The webpack.config.js has been updated to:"
echo "   - Fix Expo Router module resolution"
echo "   - Suppress LogBox warnings"
echo "   - Add proper path aliases"
echo "   - Handle Node.js module fallbacks"

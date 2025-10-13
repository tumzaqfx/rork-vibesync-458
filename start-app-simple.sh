#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Starting VibeSync"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Clean cache
echo "🧹 Cleaning cache..."
rm -rf .expo node_modules/.cache

# Start Expo
echo "📱 Starting Expo..."
echo ""
echo "Press 'w' to open in web browser"
echo ""

npx expo start --web --clear

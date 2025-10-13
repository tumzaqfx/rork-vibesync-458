#!/bin/bash

echo "🚀 VibeSync Web - Quick Fix & Start"
echo "===================================="
echo ""

echo "🧹 Clearing caches..."
rm -rf node_modules/.cache .expo dist web-build 2>/dev/null

echo "🔄 Reinstalling dependencies..."
bun install

echo ""
echo "✅ Fix applied successfully!"
echo ""
echo "🌐 Starting web server..."
echo ""

npx expo start --web --clear

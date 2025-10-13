#!/bin/bash

echo "🔧 Fixing Webpack Errors..."
echo ""

echo "1️⃣ Clearing build cache..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf web-build
echo "✅ Cache cleared"
echo ""

echo "2️⃣ Verifying app directory exists..."
if [ -d "app" ]; then
    echo "✅ App directory found"
else
    echo "❌ App directory not found!"
    exit 1
fi
echo ""

echo "3️⃣ Checking webpack.config.js..."
if [ -f "webpack.config.js" ]; then
    echo "✅ webpack.config.js exists"
else
    echo "❌ webpack.config.js not found!"
    exit 1
fi
echo ""

echo "4️⃣ Starting web server..."
echo "   This will use the updated webpack configuration"
echo ""

bun run start-web

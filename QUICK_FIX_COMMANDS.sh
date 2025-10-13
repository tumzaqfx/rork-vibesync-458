#!/bin/bash

echo "🔧 VibeSync Quick Fix Script"
echo "================================"

# Step 1: Stop any running Metro/Expo processes
echo "📍 Step 1: Stopping any running Metro/Expo processes..."
pkill -f "node.*metro" 2>/dev/null || true
pkill -f "expo" 2>/dev/null || true
echo "✅ Processes stopped"
echo ""

# Step 2: Clear all caches
echo "📍 Step 2: Clearing caches..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf /tmp/expo-* 2>/dev/null || true
echo "✅ Caches cleared"
echo ""

# Step 3: Verify essential files
echo "📍 Step 3: Checking essential files..."
ALL_EXIST=true
FILES=("app/_layout.tsx" "app/messages-settings.tsx" "hooks/message-settings-store.ts" "types/message-settings.ts")
for f in "${FILES[@]}"; do
    if [ ! -f "$f" ]; then
        echo "⚠️  $f not found"
        ALL_EXIST=false
    else
        echo "✅ $f exists"
    fi
done
echo ""

# Step 4: Verify .env
echo "📍 Step 4: Checking .env file..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    if ! grep -q "EXPO_PUBLIC_BACKEND_URL=" .env; then
        echo "⚠️  EXPO_PUBLIC_BACKEND_URL not found in .env"
    else
        echo "✅ EXPO_PUBLIC_BACKEND_URL is set"
    fi
else
    echo "⚠️  .env file not found"
fi
echo ""

# Step 5: Ensure rork is installed locally
echo "📍 Step 5: Checking local rork installation..."
if [ ! -f "node_modules/.bin/rork" ]; then
    echo "⚠️  rork not found locally. Installing..."
    bun add rork || npm install rork --save-dev
    echo "✅ rork installed locally"
else
    echo "✅ rork already installed locally"
fi
echo ""

# Step 6: Fix package.json scripts (replace bunx with rork)
echo "📍 Step 6: Checking package.json scripts..."
if [ -f "package.json" ]; then
    if grep -q "bunx" package.json; then
        echo "⚠️  bunx detected in package.json scripts. Replacing with 'rork'..."
        sed -i 's/bunx rork/rork/g' package.json
        echo "✅ Scripts updated"
    else
        echo "✅ No bunx references found in scripts"
    fi
else
    echo "⚠️  package.json not found!"
    exit 1
fi
echo ""

# Step 7: Start the app
echo "📍 Step 7: Starting VibeSync app with clear cache..."
bun run start --clear
echo ""

# Step 8: Manual start options
echo "================================"
echo "📝 Manual Start Options"
echo "================================"
echo "If the app fails to start, try these commands:"
echo ""
echo "1. Standard start:"
echo "   bun run start"
echo ""
echo "2. Start with clear cache:"
echo "   bun run start --clear"
echo ""
echo "3. Web-only start:"
echo "   bun run start-web"
echo ""
echo "4. Clear everything and start fresh:"
echo "   rm -rf .expo node_modules/.cache && bun run start --clear"
echo ""
echo "✅ VibeSync Quick Fix complete!"

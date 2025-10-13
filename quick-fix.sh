#!/bin/bash

echo "🔧 VibeSync - Quick Fix for Dependencies"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🧹 Step 1: Cleaning up old files..."
rm -rf node_modules 2>/dev/null
rm -rf .expo 2>/dev/null
rm -rf node_modules/.cache 2>/dev/null
rm -f bun.lockb 2>/dev/null
echo -e "${GREEN}✅ Cleanup complete${NC}"
echo ""

echo "📦 Step 2: Installing dependencies with Bun..."
bun install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

echo "🔍 Step 3: Verifying Expo installation..."
if bunx expo --version > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Expo is installed and working${NC}"
else
    echo -e "${YELLOW}⚠️  Installing Expo CLI...${NC}"
    bun add -d expo-cli
fi
echo ""

echo "✅ All fixes applied!"
echo ""
echo "🚀 You can now start the app with:"
echo "   ./start-simple.sh"
echo ""

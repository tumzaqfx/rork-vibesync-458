#!/bin/bash

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║                                          ║"
echo "║      🔧 VIBESYNC QUICK FIX 🔧           ║"
echo "║                                          ║"
echo "╚══════════════════════════���═══════════════╝"
echo ""

# Step 1: Fix permissions
echo "📝 Step 1: Fixing permissions..."
chmod +x rebuild-sqlite.sh
chmod +x START_VIBESYNC_FIXED.sh

# Step 2: Rebuild better-sqlite3
echo ""
echo "🔧 Step 2: Rebuilding better-sqlite3..."
./rebuild-sqlite.sh

# Step 3: Clean cache
echo ""
echo "🧹 Step 3: Cleaning cache..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf dist

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║                                          ║"
echo "║         ✅ FIX COMPLETE! ✅             ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "Now run: ./START_VIBESYNC_FIXED.sh"
echo ""

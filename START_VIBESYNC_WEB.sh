#!/bin/bash

clear

cat << "EOF"
╔══════════════════════════════════════════╗
║                                          ║
║         🚀 VibeSync Web Launcher         ║
║                                          ║
╚══════════════════════════════════════════╝
EOF

echo ""
echo "🧹 Cleaning cache..."
rm -rf .expo node_modules/.cache 2>/dev/null

echo "✅ Cache cleared"
echo ""
echo "📱 Starting VibeSync..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  The app will open in your browser"
echo "  Press Ctrl+C to stop"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npx expo start --web --clear

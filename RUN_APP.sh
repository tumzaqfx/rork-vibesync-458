#!/bin/bash

echo "╔══════════════════════════════════════════╗"
echo "║                                          ║"
echo "║         🚀 VibeSync Launcher 🚀         ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "Starting VibeSync..."
echo ""

# Clean cache
rm -rf .expo node_modules/.cache 2>/dev/null

# Start the app
echo "📱 Opening web browser..."
echo ""
npx expo start --web --clear

echo ""
echo "✅ App closed"

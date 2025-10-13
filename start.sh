#!/bin/bash

echo "🚀 Starting VibeSync..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "⚠️  Warning: .env file not found"
  echo "Creating .env from .env.example..."
  cp .env.example .env 2>/dev/null || echo "No .env.example found"
fi

# Clear caches
echo "🧹 Clearing caches..."
rm -rf .expo
rm -rf node_modules/.cache
npx expo start --clear

echo ""
echo "✅ VibeSync is starting!"
echo "📱 Scan the QR code with Expo Go to test on your device"
echo "🌐 Press 'w' to open in web browser"

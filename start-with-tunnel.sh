#!/bin/bash

echo "🚀 Starting VibeSync with Tunnel Connection"
echo "============================================"
echo ""

# Check if backend is already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Backend is already running on port 3000"
else
    echo "⚠️  Backend is not running!"
    echo "Please start the backend in a separate terminal:"
    echo "  bun run backend/server.ts"
    echo ""
    read -p "Press Enter when backend is running..."
fi

echo ""
echo "📱 Starting Expo with tunnel URL..."
echo "Using: https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev"
echo ""

# Clear cache and start
npx expo start --clear

echo ""
echo "✅ Expo started!"
echo ""
echo "📋 Next steps:"
echo "1. Scan the QR code with Expo Go app"
echo "2. Try registering a new account"
echo "3. Check console for connection logs"
echo ""

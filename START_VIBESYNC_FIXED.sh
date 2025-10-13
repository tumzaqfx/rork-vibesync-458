#!/bin/bash

echo "╔════════════════════════════════════════╗"
echo "║     🎵 VibeSync Quick Start 🎵        ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Kill any existing processes on port 3000
echo "🧹 Cleaning up port 3000..."
pkill -f "backend/server.ts" 2>/dev/null || true
sleep 2

# Start backend in background
echo "🚀 Starting backend server..."
bun backend/server.ts > backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend to be ready
echo "⏳ Waiting for backend to start..."
sleep 5

# Check if backend is running
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is running!"
else
    echo "⚠️  Backend may not be ready yet, but continuing..."
fi

echo ""
echo "🎨 Starting Expo with tunnel..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📱 Scan the QR code with Expo Go app"
echo "  🌐 Backend: http://localhost:3000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start Expo with tunnel
npx expo start --tunnel

# Cleanup on exit
echo ""
echo "🛑 Stopping backend..."
kill $BACKEND_PID 2>/dev/null || true
echo "✅ Cleanup complete"

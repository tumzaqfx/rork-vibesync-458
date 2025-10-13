#!/bin/bash

echo "╔════════════════════════════════════════╗"
echo "║     🎵 VibeSync Clean Start 🎵        ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Kill any process on port 3000
echo "🔧 Killing processes on port 3000..."
pkill -f "bun.*server.ts" 2>/dev/null || true
pkill -f "node.*3000" 2>/dev/null || true
fuser -k 3000/tcp 2>/dev/null || true
sleep 2

# Clear caches
echo "🧹 Clearing caches..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf .next

# Start backend
echo ""
echo "🚀 Starting backend server..."
cd /home/user/rork-app
bun backend/server.ts > backend.log 2>&1 &
BACKEND_PID=$!
echo "   ✅ Backend started (PID: $BACKEND_PID)"

# Wait for backend
echo "⏳ Waiting for backend to be ready..."
for i in {1..30}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "   ✅ Backend is ready!"
    break
  fi
  sleep 1
  if [ $i -eq 30 ]; then
    echo "   ⚠️  Backend took too long, but continuing..."
  fi
done

# Start frontend
echo ""
echo "🎨 Starting frontend with Expo..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Backend: http://localhost:3000"
echo "  Frontend: Starting..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Use bunx expo start instead of npm
bunx expo start --clear

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT

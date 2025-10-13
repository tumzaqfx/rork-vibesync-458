#!/bin/bash

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║                                          ║"
echo "║           🚀 VIBESYNC 🚀                ║"
echo "║                                          ║"
echo "║      Production-Ready Social App         ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Kill any existing processes
echo "🧹 Cleaning up old processes..."
pkill -f "bun.*backend/server.ts" 2>/dev/null || true
pkill -f "expo start" 2>/dev/null || true
pkill -f "npx expo start" 2>/dev/null || true
sleep 1

# Rebuild better-sqlite3 for Bun
echo "🔧 Rebuilding better-sqlite3 for Bun..."
cd /home/user/rork-app
bun rebuild better-sqlite3

# Start backend
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Starting Backend Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

bun run backend/server.ts > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to be ready
echo "⏳ Waiting for backend to start..."
for i in {1..15}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is ready!"
    break
  fi
  if [ $i -eq 15 ]; then
    echo "⚠️  Backend took too long to start. Check backend.log for errors."
    echo "   Continuing anyway..."
  fi
  sleep 1
done

# Start frontend
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Starting Frontend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║                                          ║"
echo "║         ✅ VIBESYNC IS READY! ✅        ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "🌐 Backend:  http://localhost:3000"
echo "📱 Frontend: Starting Expo..."
echo ""
echo "Press 'w' to open in web browser"
echo "Press Ctrl+C to stop"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start Expo
npx expo start --web

# Cleanup on exit
trap "echo ''; echo '🛑 Shutting down...'; kill $BACKEND_PID 2>/dev/null; echo '✅ Stopped'; exit 0" EXIT INT TERM

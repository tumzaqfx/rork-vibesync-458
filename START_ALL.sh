#!/bin/bash

echo "╔══════════════════════════════════════════╗"
echo "║                                          ║"
echo "║      🚀 VibeSync Complete Startup 🚀    ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo ""

cd /home/user/rork-app

echo "🧹 Cleaning up old processes..."
pkill -f "bun.*backend" 2>/dev/null || true
pkill -f "expo start" 2>/dev/null || true
sleep 2

echo "✅ Ready to start"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Starting Backend Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

bun run backend/server-improved.ts &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
for i in {1..30}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is running!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
  fi
  sleep 1
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Starting Frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "╔══════════════════════════════════════════╗"
echo "║                                          ║"
echo "║         ✅ VibeSync is Ready! ✅        ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "🌐 Backend: http://localhost:3000"
echo "📱 Frontend: Starting now..."
echo ""
echo "Press 'w' to open in web browser"
echo "Press Ctrl+C to stop all services"
echo ""

trap "echo ''; echo '🛑 Stopping all services...'; kill $BACKEND_PID 2>/dev/null; exit 0" INT TERM

npx expo start --web

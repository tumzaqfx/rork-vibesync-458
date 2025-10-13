#!/bin/bash

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║                                          ║"
echo "║         🚀 VibeSync Launcher 🚀         ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Kill existing processes
echo "🧹 Cleaning up..."
pkill -f "backend/server.ts" 2>/dev/null
pkill -f "expo start" 2>/dev/null
sleep 1

# Start backend in background
echo "🔧 Starting backend..."
cd /home/user/rork-app
bun run backend/server.ts > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend
echo "⏳ Waiting for backend..."
for i in {1..15}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is ready!"
    break
  fi
  sleep 1
done

# Check if backend is actually running
if ! curl -s http://localhost:3000/health > /dev/null 2>&1; then
  echo ""
  echo "❌ Backend failed to start!"
  echo ""
  echo "Backend logs:"
  tail -20 backend.log
  echo ""
  exit 1
fi

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║                                          ║"
echo "║         ✅ Backend is Running! ✅       ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "📱 Starting frontend..."
echo ""
echo "🔐 Demo Login:"
echo "   Email: test@example.com"
echo "   Password: Test123!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start frontend
npx expo start --web

# Cleanup on exit
trap "echo ''; echo '🛑 Shutting down...'; kill $BACKEND_PID 2>/dev/null; echo '✅ Stopped'; exit 0" EXIT INT TERM

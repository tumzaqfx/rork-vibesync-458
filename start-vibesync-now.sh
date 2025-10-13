#!/bin/bash

echo "╔══════════════════════════════════════════╗"
echo "║                                          ║"
echo "║           🚀 VIBESYNC START 🚀          ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Kill any existing processes
echo "🧹 Cleaning up old processes..."
pkill -f "backend/server" 2>/dev/null
pkill -f "expo start" 2>/dev/null
sleep 1

# Start backend
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Starting Backend Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd /home/user/rork-app
bun run backend/server.ts > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend
echo "⏳ Waiting for backend to start..."
for i in {1..10}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is running!"
    break
  fi
  sleep 1
done

# Start frontend
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Starting Frontend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npx expo start --web

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT

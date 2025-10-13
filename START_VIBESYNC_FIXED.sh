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
pkill -f "node.*expo" 2>/dev/null || true

# Wait a moment
sleep 1

echo "✅ Ready to start"
echo ""

# Start backend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Starting Backend Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd /home/user/rork-app
bun backend/server.ts > backend.log 2>&1 &
BACKEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo ""

# Wait for backend to be ready
echo "⏳ Waiting for backend to start..."
for i in {1..15}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is ready!"
    break
  fi
  if [ $i -eq 15 ]; then
    echo "⚠️  Backend taking longer than expected, but continuing..."
  fi
  sleep 1
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Starting Frontend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start frontend
bun start

# Cleanup on exit
trap "echo ''; echo '🛑 Shutting down...'; kill $BACKEND_PID 2>/dev/null; echo '✅ Stopped'; exit" INT TERM
wait

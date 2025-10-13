#!/bin/bash
# VibeSync - One Command Startup

clear
echo "🚀 Starting VibeSync..."
echo ""

# Kill old processes
pkill -f "bun.*backend/server.ts" 2>/dev/null || true
pkill -f "expo start" 2>/dev/null || true
sleep 1

# Install better-sqlite3 if needed
if ! bun pm ls 2>/dev/null | grep -q "better-sqlite3"; then
  echo "📦 Installing better-sqlite3..."
  bun add better-sqlite3 > /dev/null 2>&1
fi

# Start backend
echo "🔧 Starting backend..."
bun run backend/server.ts > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend
echo "⏳ Waiting for backend..."
for i in {1..20}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend ready!"
    break
  fi
  sleep 1
done

# Start frontend
echo "📱 Starting frontend..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ VibeSync is starting!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Press 'w' for web browser"
echo "🔐 Demo: test@example.com / Test123!"
echo ""

npx expo start --clear

# Cleanup
trap "kill $BACKEND_PID 2>/dev/null; exit 0" INT TERM EXIT

#!/bin/bash

echo "🚀 Starting VibeSync Application"
echo "================================"
echo ""

# Kill any existing processes on port 3000
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

# Start backend in background
echo "🔧 Starting backend server..."
cd /home/user/rork-app
bun run backend/server.ts > backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend to be ready
echo "⏳ Waiting for backend to start..."
for i in {1..30}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ Backend failed to start. Check backend.log for details."
    cat backend.log
    kill $BACKEND_PID 2>/dev/null
    exit 1
  fi
  sleep 1
done

echo ""
echo "🌐 Starting frontend..."
echo "   You can access the app at the URL shown below"
echo ""

# Start frontend
bun rork start -p 7omq16pafeyh8vedwdyl6 --web --tunnel

# Cleanup on exit
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID 2>/dev/null; exit 0" INT TERM

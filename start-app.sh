#!/bin/bash

echo "🚀 Starting VibeSync Application"
echo "================================="
echo ""

# Kill any existing backend
echo "🧹 Cleaning up existing processes..."
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "   Killing process on port 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Start backend
echo ""
echo "🔧 Starting Backend Server..."
bun run backend/server.ts > backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend
echo "   Waiting for backend to start..."
sleep 5

# Test backend
echo ""
echo "🏥 Testing Backend Health..."
if curl -s http://localhost:3000/health | grep -q "ok"; then
    echo "   ✅ Backend is healthy!"
else
    echo "   ⚠️  Backend health check failed"
    echo "   Last 10 lines of backend log:"
    tail -n 10 backend.log
fi

# Start frontend
echo ""
echo "📱 Starting Frontend (Expo)..."
echo ""
npx expo start --tunnel

# Cleanup on exit
echo ""
echo "🧹 Cleaning up..."
kill $BACKEND_PID 2>/dev/null || true

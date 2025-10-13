#!/bin/bash

clear

echo "╔════════════════════════════════════════╗"
echo "║     🎵 VibeSync Startup Script 🎵     ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Kill any existing process on port 3000
echo "🔧 Cleaning up port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "   ✅ Killed existing process" || echo "   ✅ Port 3000 is free"
echo ""

# Start backend
echo "🚀 Starting backend server..."
bun run backend/server.ts &
BACKEND_PID=$!
echo "   ✅ Backend started (PID: $BACKEND_PID)"
echo ""

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 4
echo ""

# Check if backend is running
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy!"
else
    echo "⚠️  Backend health check failed, but continuing..."
fi
echo ""

# Start frontend
echo "🎨 Starting frontend..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Backend: http://localhost:3000"
echo "  Frontend: Will start on Expo port"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npx expo start

# Cleanup on exit
trap "echo ''; echo '🛑 Stopping backend...'; kill $BACKEND_PID 2>/dev/null; echo '✅ Stopped'; exit" INT TERM

#!/bin/bash

clear

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║                                          ║"
echo "║           🚀 VIBESYNC 🚀                ║"
echo "║      Production Social Media App         ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Kill existing processes
echo "🧹 Cleaning up old processes..."
pkill -f "bun.*backend/server.ts" 2>/dev/null || true
pkill -f "expo start" 2>/dev/null || true
pkill -f "node.*expo" 2>/dev/null || true
sleep 2
echo "✅ Cleanup complete"
echo ""

# Start backend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Starting Backend Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd /home/user/rork-app
bun run backend/server.ts &
BACKEND_PID=$!

echo "⏳ Waiting for backend to initialize..."
sleep 4

if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ Backend is running (PID: $BACKEND_PID)"
    echo "🌐 Backend URL: http://localhost:3000"
else
    echo "⚠️  Backend failed to start"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Starting Frontend App..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npx expo start --web &
FRONTEND_PID=$!

sleep 3

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║                                          ║"
echo "║         ✅ VIBESYNC IS READY! ✅        ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "🌐 Access the app:"
echo "   Web: http://localhost:8081"
echo "   Backend API: http://localhost:3000"
echo ""
echo "🔐 Demo Login Credentials:"
echo "   Email: test@example.com"
echo "   Password: Test123!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for user interrupt
wait

#!/bin/bash

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║                                          ║"
echo "║           🚀 VIBESYNC 🚀                ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Kill any existing processes
echo "🧹 Cleaning up..."
pkill -f "bun.*backend/server.ts" 2>/dev/null || true
pkill -f "expo start" 2>/dev/null || true
pkill -f "node.*expo" 2>/dev/null || true
sleep 2

# Start backend
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Starting Backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd /home/user/rork-app
bun run backend/server.ts > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend
echo "⏳ Waiting for backend to start..."
sleep 3

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ Backend started (PID: $BACKEND_PID)"
else
    echo "⚠️  Backend may have issues, check backend.log"
fi

# Start frontend
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Starting Frontend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npx expo start --web > frontend.log 2>&1 &
FRONTEND_PID=$!

sleep 3

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║                                          ║"
echo "║         ✅ VIBESYNC STARTED! ✅         ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "🌐 Backend:  http://localhost:3000"
echo "📱 Frontend: http://localhost:8081"
echo ""
echo "🔐 Demo Login:"
echo "   Email: test@example.com"
echo "   Password: Test123!"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop: pkill -f 'bun.*backend' && pkill -f 'expo'"
echo ""
echo "Press Ctrl+C to stop monitoring..."
echo ""

# Monitor logs
tail -f frontend.log

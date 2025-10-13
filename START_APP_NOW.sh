#!/bin/bash

clear

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 VibeSync - Complete Startup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Kill existing processes
echo "Step 1: Cleaning up existing processes..."
pkill -f "bun.*backend" 2>/dev/null || true
pkill -f "expo" 2>/dev/null || true
pkill -f "node.*8081" 2>/dev/null || true
sleep 2
echo "✅ Cleanup complete"
echo ""

# Step 2: Start backend
echo "Step 2: Starting Backend Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd /home/user/rork-app

# Start backend in background
bun backend/server.ts > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
echo ""

# Wait for backend
echo "Waiting for backend to initialize..."
sleep 4

# Check backend status
if ps -p $BACKEND_PID > /dev/null; then
   echo "✅ Backend is running"
   echo "   Check backend.log for details"
else
   echo "⚠️  Backend may have issues"
   echo "   Last 10 lines from backend.log:"
   tail -n 10 backend.log 2>/dev/null || echo "   (no log file yet)"
fi
echo ""

# Step 3: Start frontend
echo "Step 3: Starting Frontend (Expo Web)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Starting Expo with web and tunnel support..."
echo ""

# Start expo with web
exec bun expo start --web --tunnel

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ VibeSync is running!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

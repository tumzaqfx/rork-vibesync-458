#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 VibeSync - Simple Startup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Kill any existing processes on ports 3000 and 8081
echo "Step 1: Cleaning up ports..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
echo "✅ Ports cleaned"
echo ""

# Start backend
echo "Step 2: Starting Backend Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
bun backend/server-improved.ts &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
echo ""

# Wait for backend to be ready
echo "Waiting for backend to start..."
sleep 3

# Test backend health
echo "Testing backend health..."
HEALTH_CHECK=$(curl -s http://localhost:3000/health || echo "failed")
if [[ $HEALTH_CHECK == *"healthy"* ]]; then
  echo "✅ Backend is healthy!"
else
  echo "⚠️  Backend health check returned: $HEALTH_CHECK"
  echo "   Continuing anyway..."
fi
echo ""

# Start frontend
echo "Step 3: Starting Frontend (Expo)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
bun expo start --clear

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT

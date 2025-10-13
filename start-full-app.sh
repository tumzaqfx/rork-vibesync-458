#!/bin/bash

echo "🚀 Starting VibeSync Full Stack Application"
echo "==========================================="
echo ""

echo "This script will start both backend and frontend"
echo ""

# Step 1: Kill any existing processes on port 3000
echo "Step 1: Checking for existing backend processes..."
echo "---------------------------------------------------"
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Port 3000 is in use. Killing existing process..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    sleep 2
    echo "✅ Port 3000 is now free"
else
    echo "✅ Port 3000 is available"
fi

echo ""
echo "Step 2: Starting Backend Server..."
echo "-----------------------------------"
bun run backend/server.ts > backend.log 2>&1 &
BACKEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "⏳ Waiting 5 seconds for backend to initialize..."
sleep 5

echo ""
echo "Step 3: Testing Backend Health..."
echo "-----------------------------------"
BACKEND_URL="${EXPO_PUBLIC_RORK_API_BASE_URL:-http://localhost:3000}"
echo "Testing: $BACKEND_URL/health"

if curl -s "$BACKEND_URL/health" | grep -q "ok"; then
    echo "✅ Backend is healthy and ready!"
else
    echo "⚠️  Backend health check failed, but continuing..."
    echo "Backend logs:"
    tail -n 20 backend.log
fi

echo ""
echo "Step 4: Starting Frontend (Expo)..."
echo "-----------------------------------"
echo ""

npx expo start --tunnel

echo ""
echo "Cleaning up..."
kill $BACKEND_PID 2>/dev/null || true

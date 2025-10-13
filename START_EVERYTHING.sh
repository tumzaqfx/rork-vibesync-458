#!/bin/bash

echo ""
echo "🚀 Starting VibeSync - Full Stack"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Kill any existing processes on port 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "Cleaning up port 3000..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
fi

echo "Step 1: Starting Backend Server..."
echo ""

# Start backend in background
bun backend/server.ts &
BACKEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo ""
echo "Waiting for backend to be ready..."

# Wait for backend to be ready
for i in {1..30}; do
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend failed to start"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    sleep 1
done

echo ""
echo "Step 2: Starting Frontend..."
echo ""

# Start frontend
bun start

# Cleanup on exit
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID 2>/dev/null; exit" INT TERM

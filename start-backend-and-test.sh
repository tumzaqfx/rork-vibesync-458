#!/bin/bash

echo "🚀 VibeSync Backend Startup Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if port 3000 is in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 3000 is already in use!"
    echo ""
    echo "Options:"
    echo "  1. Kill existing process: lsof -ti:3000 | xargs kill -9"
    echo "  2. Use different port: PORT=3001 bun backend/server.ts"
    echo ""
    read -p "Kill existing process on port 3000? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Killing process on port 3000..."
        lsof -ti:3000 | xargs kill -9
        sleep 1
    else
        echo "Exiting..."
        exit 1
    fi
fi

echo "Starting backend server..."
echo ""

# Start backend in background
bun backend/server.ts &
BACKEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Waiting for server to start..."
sleep 3

echo ""
echo "Testing backend health..."
echo ""

# Test health endpoint
HEALTH_RESPONSE=$(curl -s http://localhost:3000/health)

if [ $? -eq 0 ]; then
    echo "✅ Backend is running!"
    echo ""
    echo "Health Check Response:"
    echo "$HEALTH_RESPONSE" | jq . 2>/dev/null || echo "$HEALTH_RESPONSE"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Backend is ready!"
    echo ""
    echo "Available endpoints:"
    echo "  🏥 Health: http://localhost:3000/health"
    echo "  🔌 API: http://localhost:3000/api/trpc"
    echo ""
    echo "To stop the backend:"
    echo "  kill $BACKEND_PID"
    echo ""
    echo "Now start your Expo app in another terminal:"
    echo "  bun start"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo "❌ Backend failed to start!"
    echo ""
    echo "Check the logs above for errors."
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Keep script running
wait $BACKEND_PID

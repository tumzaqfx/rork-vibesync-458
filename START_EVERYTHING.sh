#!/bin/bash

echo "🚀 Starting VibeSync Full Stack..."
echo ""

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

# Start backend in background
echo "🔧 Starting backend server..."
bun run backend/server.ts &
BACKEND_PID=$!

# Wait for backend to be ready
echo "⏳ Waiting for backend to start..."
sleep 3

# Check if backend is running
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ Backend is running!"
else
    echo "⚠️  Backend may not be ready yet, but continuing..."
fi

echo ""
echo "🎨 Starting frontend..."
echo ""

# Start frontend
bun rork start -p 7omq16pafeyh8vedwdyl6 --tunnel

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT

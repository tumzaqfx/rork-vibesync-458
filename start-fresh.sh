#!/bin/bash

echo "🧹 Cleaning up and starting fresh..."
echo ""

# Kill any process on port 3000
echo "🔍 Checking for processes on port 3000..."
PID=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$PID" ]; then
  echo "🔪 Killing process $PID on port 3000..."
  kill -9 $PID 2>/dev/null
  sleep 1
fi

# Kill any process on port 8081 (Metro bundler)
echo "🔍 Checking for processes on port 8081..."
PID=$(lsof -ti:8081 2>/dev/null)
if [ ! -z "$PID" ]; then
  echo "🔪 Killing process $PID on port 8081..."
  kill -9 $PID 2>/dev/null
  sleep 1
fi

echo ""
echo "✅ Ports cleared"
echo ""
echo "🚀 Starting backend server..."
echo ""

# Start backend in background
bun run backend/server.ts &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

echo ""
echo "✅ Backend started (PID: $BACKEND_PID)"
echo ""
echo "🌐 Starting Expo with tunnel..."
echo ""

# Start Expo
bun run start

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT

#!/bin/bash

echo ""
echo "🚀 Starting VibeSync Backend..."
echo ""

# Kill any existing process on port 3000
PID=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$PID" ]; then
  echo "Killing existing process on port 3000..."
  kill -9 $PID 2>/dev/null
  sleep 1
fi

# Start backend
echo "Starting backend server..."
cd /home/user/rork-app
bun run backend/server.ts

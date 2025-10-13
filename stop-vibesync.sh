#!/bin/bash

echo "🛑 Stopping VibeSync App"
echo "========================"
echo ""

# Kill backend processes
echo "Stopping backend server..."
pkill -f "bun run backend/server.ts" 2>/dev/null
pkill -f "backend/server.ts" 2>/dev/null

# Kill any process on port 3000
PORT_PID=$(lsof -ti:3000)
if [ ! -z "$PORT_PID" ]; then
    echo "Killing process on port 3000 (PID: $PORT_PID)"
    kill -9 $PORT_PID 2>/dev/null
fi

# Kill Expo processes
echo "Stopping Expo..."
pkill -f "expo start" 2>/dev/null
pkill -f "react-native" 2>/dev/null

echo ""
echo "✅ All processes stopped"
echo ""
echo "To start again, run: ./start-vibesync.sh"

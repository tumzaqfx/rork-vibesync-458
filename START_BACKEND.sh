#!/bin/bash

echo "🚀 Starting VibeSync Backend Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if port 3000 is already in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 3000 is already in use!"
    echo ""
    echo "Killing existing process on port 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 2
    echo "✅ Port 3000 is now free"
    echo ""
fi

# Start the backend server
echo "Starting backend server on http://localhost:3000"
echo ""
bun backend/server.ts

#!/bin/bash

echo ""
echo "🚀 Starting VibeSync Backend Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if port 3000 is in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 3000 is already in use!"
    echo ""
    echo "Options:"
    echo "  1. Kill existing process: lsof -ti:3000 | xargs kill -9"
    echo "  2. Or the backend is already running"
    echo ""
    read -p "Kill existing process? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Killing process on port 3000..."
        lsof -ti:3000 | xargs kill -9
        sleep 2
    else
        echo "Exiting..."
        exit 1
    fi
fi

echo "Starting backend server..."
echo ""

# Start the backend
bun backend/server.ts

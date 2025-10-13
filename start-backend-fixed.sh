#!/bin/bash

echo "🚀 VibeSync Backend Startup Script"
echo "=================================="
echo ""

echo "Step 1: Checking if port 3000 is in use..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 3000 is in use. Killing existing process..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    pkill -f "backend/server" 2>/dev/null || true
    sleep 2
    echo "✅ Port 3000 is now free"
else
    echo "✅ Port 3000 is available"
fi

echo ""
echo "Step 2: Checking environment variables..."
if [ -f .env ]; then
    echo "✅ .env file found"
    source .env
    
    if [ -z "$DATABASE_URL" ]; then
        echo "⚠️  DATABASE_URL not set, using default: postgresql://localhost:5432/vibesync"
    else
        echo "✅ DATABASE_URL is configured"
    fi
    
    if [ -z "$EXPO_PUBLIC_RORK_API_BASE_URL" ]; then
        echo "⚠️  EXPO_PUBLIC_RORK_API_BASE_URL not set"
    else
        echo "✅ Tunnel URL: $EXPO_PUBLIC_RORK_API_BASE_URL"
    fi
else
    echo "⚠️  .env file not found, using defaults"
fi

echo ""
echo "Step 3: Starting backend server..."
echo "=================================="
echo ""

bun run backend/server-improved.ts

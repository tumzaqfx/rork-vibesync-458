#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 VibeSync Backend Startup Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PORT=3000

echo "Step 1: Checking if port $PORT is in use..."
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port $PORT is in use. Killing existing process..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null
    sleep 2
    echo "✅ Port cleared"
else
    echo "✅ Port $PORT is available"
fi

echo ""
echo "Step 2: Checking database connection..."

if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client not found. Skipping database check."
    echo "   Make sure PostgreSQL is installed and running."
else
    if psql -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw vibesync; then
        echo "✅ Database 'vibesync' exists"
    else
        echo "⚠️  Database 'vibesync' not found!"
        echo ""
        echo "Creating database..."
        createdb vibesync 2>/dev/null
        
        if [ -f "backend/db/schema.sql" ]; then
            echo "Running schema..."
            psql vibesync < backend/db/schema.sql 2>/dev/null
            echo "✅ Database created and schema applied"
        else
            echo "❌ Schema file not found at backend/db/schema.sql"
            echo "   Please create the database manually"
        fi
    fi
fi

echo ""
echo "Step 3: Loading environment variables..."
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Environment variables loaded"
else
    echo "⚠️  .env file not found. Using defaults."
fi

echo ""
echo "Step 4: Starting backend server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

bun run backend/server.ts

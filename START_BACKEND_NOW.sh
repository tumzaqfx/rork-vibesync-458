#!/bin/bash

echo "🚀 Starting VibeSync Backend Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Kill any existing process on port 3000
echo "🔍 Checking for existing processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

# Check if database exists
if [ ! -f "./vibesync.db" ]; then
  echo "⚠️  Database not found. Creating new database..."
  echo ""
  bun run backend/db/migrate-to-sqlite.sh
  echo ""
fi

# Start the backend server
echo "🚀 Starting backend server..."
echo ""
bun run backend/server.ts

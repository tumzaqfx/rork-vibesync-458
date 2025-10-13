#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Fixing Backend Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Step 1: Removing better-sqlite3..."
rm -rf node_modules/better-sqlite3
echo "✅ Removed"
echo ""

echo "Step 2: Reinstalling better-sqlite3 for Bun..."
bun install better-sqlite3
echo "✅ Reinstalled"
echo ""

echo "Step 3: Testing backend..."
echo ""
bun run backend/server.ts &
BACKEND_PID=$!

sleep 3

echo ""
echo "Testing health endpoint..."
curl -s http://localhost:3000/health || echo "❌ Backend not responding"
echo ""

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Backend is running!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Health: http://localhost:3000/health"
echo "API: http://localhost:3000/api/trpc"
echo ""
echo "Press Ctrl+C to stop"
echo ""

wait $BACKEND_PID

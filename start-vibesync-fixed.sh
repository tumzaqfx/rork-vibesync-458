#!/bin/bash

echo "🚀 Starting VibeSync..."
echo ""

echo "Step 1: Killing any process on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "✅ Port 3000 is free"
echo ""

echo "Step 2: Starting backend server..."
bun run backend/server.ts &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
echo ""

sleep 3

echo "Step 3: Starting frontend..."
npx expo start

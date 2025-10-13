#!/bin/bash

echo "🚀 VibeSync App Startup Script"
echo "================================"
echo ""

echo "Step 1: Killing any processes on port 3000..."
echo "-----------------------------------"
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No process found on port 3000"
echo ""

echo "Step 2: Starting Backend Server..."
echo "-----------------------------------"
cd /home/user/rork-app
bun run backend/server.ts &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"
echo ""

sleep 3

echo "Step 3: Testing Backend Health..."
echo "-----------------------------------"
HEALTH_CHECK=$(curl -s http://localhost:3000/health 2>/dev/null || echo "failed")
if [[ $HEALTH_CHECK == *"ok"* ]]; then
  echo "✅ Backend is healthy and ready!"
else
  echo "⚠️  Backend health check failed, but continuing..."
fi
echo ""

echo "Step 4: Starting Frontend (Expo)..."
echo "-----------------------------------"
bun start
echo ""

echo "Cleaning up..."
kill $BACKEND_PID 2>/dev/null || true

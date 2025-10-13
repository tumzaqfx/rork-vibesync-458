#!/bin/bash

echo "🔧 Starting VibeSync Backend Only"
echo "=================================="
echo ""

echo "Step 1: Killing any processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No process found on port 3000"
echo ""

echo "Step 2: Starting Backend Server..."
cd /home/user/rork-app
bun run backend/server.ts

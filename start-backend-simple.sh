#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Starting VibeSync Backend (Simple)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Kill any existing process on port 3000
echo "Cleaning up port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

# Check if .env exists
if [ ! -f .env ]; then
  echo "❌ .env file not found!"
  echo "Creating .env from .env.example..."
  cp .env.example .env 2>/dev/null || echo "DATABASE_PATH=./vibesync.db
JWT_SECRET=your-secret-key-change-in-production-vibesync-2025
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3000
EXPO_ROUTER_APP_ROOT=app" > .env
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

echo "✅ Environment loaded"
echo ""

# Start the backend
echo "Starting backend server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

bun run backend/server.ts

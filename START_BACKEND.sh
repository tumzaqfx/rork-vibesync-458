#!/bin/bash

echo "🚀 Starting VibeSync Backend Server..."
echo ""

# Kill any existing process on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Wait a moment for port to be freed
sleep 1

# Start the backend server
bun run backend/server.ts

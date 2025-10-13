#!/bin/bash

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Starting VibeSync Backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Kill any existing backend process
pkill -f "backend/server-improved.ts" 2>/dev/null || true

# Start backend
echo "Starting backend server..."
bun run backend/server-improved.ts

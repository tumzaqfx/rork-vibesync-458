#!/bin/bash

echo "🔍 Finding processes on port 3000..."

# Find and kill processes on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Also check for any bun processes running backend
pkill -f "backend/server.ts" 2>/dev/null || true

echo "✅ Port 3000 is now free"
echo ""
echo "You can now start the backend with: bun run backend/server.ts"

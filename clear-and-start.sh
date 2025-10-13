#!/bin/bash

echo "🧹 Clearing all caches and restarting VibeSync..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Kill any running processes
echo "🛑 Stopping any running processes..."
pkill -f "bun.*backend" || true
pkill -f "expo" || true
pkill -f "webpack" || true
sleep 2
echo -e "${GREEN}✅ Processes stopped${NC}"
echo ""

# Clear all caches
echo "🧹 Clearing caches..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf .webpack
rm -rf dist
rm -rf web-build
echo -e "${GREEN}✅ Caches cleared${NC}"
echo ""

# Start backend
echo "🔧 Starting backend..."
cd "$(dirname "$0")"
bun run backend/server.ts &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
echo ""

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 3

# Test backend health
for i in {1..5}; do
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is healthy!${NC}"
        break
    else
        if [ $i -eq 5 ]; then
            echo -e "${YELLOW}⚠️  Backend health check failed, but continuing...${NC}"
        else
            echo "⏳ Retrying health check ($i/5)..."
            sleep 2
        fi
    fi
done
echo ""

# Start frontend with cleared cache
echo "🚀 Starting frontend with cleared cache..."
echo ""
npx expo start --clear --web

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT

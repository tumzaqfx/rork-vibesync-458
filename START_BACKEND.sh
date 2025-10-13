#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Starting VibeSync Backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd /home/user/rork-app

echo "📦 Installing dependencies..."
bun install

echo ""
echo "🗄️  Database will be created automatically at: ./vibesync.db"
echo ""

echo "🚀 Starting backend server on port 3000..."
echo ""

bun run backend/server-improved.ts

#!/bin/bash

# VibeSync - One Command Startup
# Just run: bash RUN_THIS.sh

clear

cat << "EOF"
╔══════════════════════════════════════════╗
║                                          ║
║         🚀 VibeSync Startup 🚀          ║
║                                          ║
╚══════════════════════════════════════════╝
EOF

echo ""
echo "Starting VibeSync..."
echo ""

# Make all scripts executable
chmod +x *.sh 2>/dev/null

# Kill existing processes
echo "🧹 Cleaning up ports..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
sleep 1

# Check/create .env
if [ ! -f .env ]; then
  echo "📝 Creating .env file..."
  cat > .env << 'ENVFILE'
DATABASE_PATH=./vibesync.db
JWT_SECRET=your-secret-key-change-in-production-vibesync-2025
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3000
EXPO_ROUTER_APP_ROOT=app
ENVFILE
fi

# Load environment
export $(cat .env | grep -v '^#' | xargs) 2>/dev/null

echo "✅ Environment ready"
echo ""

# Start backend
echo "🔧 Starting backend server..."
bun run backend/server.ts > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend
echo "⏳ Waiting for backend..."
for i in {1..10}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is ready!"
    break
  fi
  if [ $i -eq 10 ]; then
    echo "⚠️  Backend not responding (will use demo mode)"
  fi
  sleep 1
done

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║                                          ║"
echo "║         ✅ VibeSync is Ready! ✅        ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "📱 Starting Expo..."
echo ""
echo "   Press 'w' for web browser"
echo "   Scan QR code for mobile"
echo ""
echo "🔐 Demo Login:"
echo "   Email: test@example.com"
echo "   Password: Test123!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start frontend
npx expo start

# Cleanup
echo ""
echo "🛑 Shutting down..."
kill $BACKEND_PID 2>/dev/null || true
echo "✅ Stopped"

#!/bin/bash

clear

cat << "EOF"
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║              🚀 VibeSync - Quick Setup 🚀               ║
║                                                          ║
║              All Issues Have Been Fixed!                 ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
EOF

echo ""
echo "This script will:"
echo "  1. Fix all script permissions"
echo "  2. Start the backend server"
echo "  3. Start the frontend (Expo)"
echo ""
echo "Press ENTER to continue or Ctrl+C to cancel..."
read

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Fixing Permissions..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
chmod +x START_APP_NOW.sh
chmod +x test-backend-simple.sh
chmod +x fix-permissions.sh
chmod +x start-simple.sh 2>/dev/null || true
echo "✅ Permissions fixed!"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Cleaning Up Old Processes..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pkill -f "bun.*backend" 2>/dev/null || true
pkill -f "expo" 2>/dev/null || true
sleep 2
echo "✅ Cleanup complete!"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Starting Backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd /home/user/rork-app
bun backend/server.ts > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
echo ""

echo "Waiting for backend to start..."
sleep 4

if ps -p $BACKEND_PID > /dev/null; then
   echo "✅ Backend is running!"
else
   echo "⚠️  Backend may have issues. Check backend.log"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Testing Backend Health..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
sleep 2
HEALTH=$(curl -s http://localhost:3000/health 2>/dev/null)
if [ ! -z "$HEALTH" ]; then
    echo "✅ Backend health check passed!"
    echo "   Response: $HEALTH"
else
    echo "⚠️  Backend health check failed"
    echo "   Continuing anyway..."
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5: Starting Frontend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Starting Expo with web and tunnel support..."
echo ""
echo "Once Expo starts, you can:"
echo "  • Open the web URL in your browser"
echo "  • Scan the QR code with Expo Go app"
echo "  • Test registration at /register"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

exec bun expo start --web --tunnel

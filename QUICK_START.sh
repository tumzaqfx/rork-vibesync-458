#!/bin/bash

clear

cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              🚀 VIBESYNC - STARTING UP 🚀                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Cleanup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Kill existing processes
pkill -f "bun.*backend/server.ts" 2>/dev/null || true
pkill -f "expo start" 2>/dev/null || true
pkill -f "node.*expo" 2>/dev/null || true
sleep 2

echo "✅ Old processes cleaned"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Install Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if better-sqlite3 is installed
if ! bun pm ls 2>/dev/null | grep -q "better-sqlite3"; then
  echo "📦 Installing better-sqlite3..."
  bun add better-sqlite3
  echo "✅ Installed"
else
  echo "✅ better-sqlite3 already installed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Starting Backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start backend in background
bun run backend/server.ts > backend.log 2>&1 &
BACKEND_PID=$!

echo "🔧 Backend starting (PID: $BACKEND_PID)..."
echo "📝 Logs: tail -f backend.log"
echo ""

# Wait for backend
echo "⏳ Waiting for backend to be ready..."
BACKEND_READY=false
for i in {1..30}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    BACKEND_READY=true
    echo "✅ Backend is ready!"
    break
  fi
  echo -n "."
  sleep 1
done

echo ""

if [ "$BACKEND_READY" = false ]; then
  echo "⚠️  Backend not responding after 30 seconds"
  echo "📝 Check logs: tail -f backend.log"
  echo ""
  echo "Continue anyway? (y/n)"
  read -t 10 -n 1 response
  if [[ ! $response =~ ^[Yy]$ ]]; then
    echo ""
    echo "❌ Startup cancelled"
    kill $BACKEND_PID 2>/dev/null
    exit 1
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Starting Frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              ✅ VIBESYNC IS READY! ✅                       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

📱 CONTROLS:
   • Press 'w' to open in web browser
   • Scan QR code for mobile device
   • Press Ctrl+C to stop

🔐 DEMO LOGIN:
   Email:    test@example.com
   Password: Test123!

💡 TIP: Register a new account if this is your first time!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF

# Start Expo
npx expo start --clear

# Cleanup on exit
trap "echo ''; echo '🛑 Shutting down...'; kill $BACKEND_PID 2>/dev/null; echo '✅ Stopped'; exit 0" INT TERM EXIT

#!/bin/bash

clear

cat << "EOF"
╔══════════════════════════════════════════╗
║                                          ║
║         🚀 VibeSync Launcher 🚀         ║
║                                          ║
╚══════════════════════════════════════════╝
EOF

echo ""
echo "This will start both backend and frontend."
echo ""
echo "Press Ctrl+C to stop everything."
echo ""

# Make scripts executable
chmod +x start-backend.sh start-frontend.sh

# Kill any existing processes
pkill -f "backend/server-improved.ts" 2>/dev/null || true

# Start backend in background
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Starting Backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

bun run backend/server-improved.ts &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for backend to start..."
sleep 3

# Check if backend is running
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
  echo "✅ Backend is running!"
else
  echo "⚠️  Backend may not be ready yet, but continuing..."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Starting Frontend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔐 Demo Login:"
echo "   Email: test@example.com"
echo "   Password: Test123!"
echo ""

# Start frontend
npm start

# Cleanup on exit
trap "echo ''; echo 'Stopping backend...'; kill $BACKEND_PID 2>/dev/null; exit" INT TERM

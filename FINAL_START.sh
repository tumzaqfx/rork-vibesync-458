#!/bin/bash

clear

cat << "EOF"
╔══════════════════════════════════════════╗
║                                          ║
║      🚀 VibeSync Complete Setup 🚀      ║
║                                          ║
╚══════════════════════════════════════════╝
EOF

echo ""
echo "This script will:"
echo "  1. Setup the database"
echo "  2. Create test user"
echo "  3. Start backend server"
echo "  4. Start frontend app"
echo ""
echo "Press Ctrl+C to cancel, or wait 3 seconds to continue..."
sleep 3

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Cleaning up old processes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Kill any existing backend
pkill -f "backend/server-improved.ts" 2>/dev/null || true
echo "✅ Old processes cleaned"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Setting up database"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Remove old database
if [ -f "vibesync.db" ]; then
  echo "Removing old database..."
  rm vibesync.db
fi

# Start backend briefly to create database
echo "Creating database schema..."
timeout 3 bun run backend/server-improved.ts > /dev/null 2>&1 || true
sleep 1

# Check if database was created
if [ -f "vibesync.db" ]; then
  echo "✅ Database created"
else
  echo "❌ Failed to create database"
  exit 1
fi

# Create test user
echo ""
echo "Creating test user..."
bun run create-test-user.ts

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Starting backend server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start backend in background
bun run backend/server-improved.ts &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for backend to start..."
sleep 3

# Test backend
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
  echo "✅ Backend is running on http://localhost:3000"
else
  echo "⚠️  Backend may not be ready yet"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Starting frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat << "EOF"
╔��═════════════════════════════════════════╗
║                                          ║
║         ✅ Setup Complete! ✅           ║
║                                          ║
╚══════════════════════════════════════════╝

🔐 Login Credentials:
   Email: test@example.com
   Password: Test123!

📱 Mobile: Scan QR code with Expo Go
🌐 Web: Press 'w' in terminal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF

# Start frontend
npm start

# Cleanup on exit
trap "echo ''; echo 'Stopping backend...'; kill $BACKEND_PID 2>/dev/null; exit" INT TERM

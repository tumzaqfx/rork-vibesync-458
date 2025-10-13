#!/bin/bash

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🗄️  Setting up VibeSync Database"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Remove old database if exists
if [ -f "vibesync.db" ]; then
  echo "Removing old database..."
  rm vibesync.db
fi

# Create new database by running backend (it will auto-initialize)
echo "Creating database schema..."
timeout 3 bun run backend/server-improved.ts > /dev/null 2>&1 || true

# Wait a moment
sleep 1

# Check if database was created
if [ -f "vibesync.db" ]; then
  echo "✅ Database created successfully!"
  echo ""
  
  # Create test user
  echo "Creating test user..."
  bun run create-test-user.ts
else
  echo "❌ Failed to create database"
  exit 1
fi

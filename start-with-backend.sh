#!/bin/bash

echo "🚀 Starting VibeSync with Backend..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "⚠️  Warning: .env file not found"
  echo "Creating .env from .env.example..."
  cp .env.example .env 2>/dev/null || echo "No .env.example found"
fi

# Start backend in background
echo "🔧 Starting backend server..."
bun run backend/server.ts &
BACKEND_PID=$!

# Wait for backend to be ready
echo "⏳ Waiting for backend to start..."
sleep 3

# Check if backend is running
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
  echo "✅ Backend is running on http://localhost:3000"
else
  echo "⚠️  Backend health check failed, but continuing..."
fi

# Clear caches
echo "🧹 Clearing caches..."
rm -rf .expo
rm -rf node_modules/.cache

# Start frontend
echo "📱 Starting frontend..."
npx expo start --clear

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT

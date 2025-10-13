#!/bin/bash

echo ""
echo "🚀 Starting VibeSync Frontend..."
echo ""

# Wait for backend
echo "Waiting for backend to be ready..."
for i in {1..10}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is ready!"
    break
  fi
  echo "Waiting... ($i/10)"
  sleep 2
done

# Start frontend
echo ""
echo "Starting Expo..."
echo ""
cd /home/user/rork-app
npx expo start --web

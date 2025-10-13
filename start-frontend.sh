#!/bin/bash

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Starting VibeSync Frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
for i in {1..10}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is ready!"
    break
  fi
  echo "Waiting... ($i/10)"
  sleep 2
done

echo ""
echo "Starting Expo..."
echo ""
echo "🔐 Demo Login:"
echo "   Email: test@example.com"
echo "   Password: Test123!"
echo ""

npm start

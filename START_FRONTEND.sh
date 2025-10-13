#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Starting VibeSync Frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━��━━━━━━━━"
echo ""

cd /home/user/rork-app

echo "⏳ Waiting for backend to be ready..."
for i in {1..30}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "⚠️  Backend not responding, but starting frontend anyway..."
  fi
  sleep 1
done

echo ""
echo "📱 Starting Expo..."
echo ""
echo "Press 'w' to open in web browser"
echo ""

npx expo start --web

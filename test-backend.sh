#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Testing VibeSync Backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Testing backend health..."
response=$(curl -s http://localhost:3000/health)

if [ $? -eq 0 ]; then
  echo "✅ Backend is responding!"
  echo ""
  echo "Response:"
  echo "$response" | jq . 2>/dev/null || echo "$response"
  echo ""
  
  if echo "$response" | grep -q '"status":"ok"'; then
    echo "✅ Backend is healthy!"
    echo "✅ Database is connected!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎉 Backend is working perfectly!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  else
    echo "⚠️  Backend is responding but may have issues"
  fi
else
  echo "❌ Backend is not responding"
  echo ""
  echo "Make sure backend is running:"
  echo "  ./START_BACKEND.sh"
  echo ""
  echo "Or start everything:"
  echo "  ./RUN.sh"
fi

echo ""

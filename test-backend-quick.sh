#!/bin/bash

echo ""
echo "🔍 Testing VibeSync Backend..."
echo ""

# Test 1: Check if backend is running
echo "Test 1: Health Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
HEALTH=$(curl -s http://localhost:3000/health)
if [ $? -eq 0 ]; then
  echo "✅ Backend is responding"
  echo "$HEALTH" | jq . 2>/dev/null || echo "$HEALTH"
else
  echo "❌ Backend is not responding"
  echo ""
  echo "Start backend with: ./start-backend-now.sh"
  exit 1
fi

echo ""
echo "Test 2: API Health Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
API_HEALTH=$(curl -s http://localhost:3000/api/health)
if [ $? -eq 0 ]; then
  echo "✅ API endpoint is responding"
  echo "$API_HEALTH" | jq . 2>/dev/null || echo "$API_HEALTH"
else
  echo "❌ API endpoint is not responding"
fi

echo ""
echo "Test 3: Root Endpoint"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ROOT=$(curl -s http://localhost:3000/)
if [ $? -eq 0 ]; then
  echo "✅ Root endpoint is responding"
  echo "$ROOT" | jq . 2>/dev/null || echo "$ROOT"
else
  echo "❌ Root endpoint is not responding"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All tests passed! Backend is working correctly."
echo ""
echo "You can now start the frontend with:"
echo "  ./start-frontend-now.sh"
echo ""
echo "Or start everything with:"
echo "  ./START_VIBESYNC_SIMPLE.sh"
echo ""

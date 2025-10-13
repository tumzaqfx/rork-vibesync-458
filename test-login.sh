#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Testing VibeSync Login Flow"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Health Check
echo "Test 1: Backend Health Check"
echo "-----------------------------------"
HEALTH=$(curl -s http://localhost:3000/health)
if echo "$HEALTH" | grep -q "ok"; then
  echo "✅ Backend is healthy"
  echo "$HEALTH" | jq .
else
  echo "❌ Backend is not responding"
  echo "Response: $HEALTH"
  echo ""
  echo "💡 Tip: Start backend with: ./start-backend-simple.sh"
  echo "   Or use demo mode: test@example.com / Test123!"
  exit 1
fi
echo ""

# Test 2: Register a test user
echo "Test 2: Register Test User"
echo "-----------------------------------"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/trpc/auth.register \
  -H "Content-Type: application/json" \
  -d '{
    "0": {
      "json": {
        "email": "testuser@example.com",
        "password": "Test123!",
        "username": "testuser",
        "displayName": "Test User"
      }
    }
  }')

if echo "$REGISTER_RESPONSE" | grep -q "token\|already exists"; then
  echo "✅ Registration endpoint working"
  echo "$REGISTER_RESPONSE" | jq . 2>/dev/null || echo "$REGISTER_RESPONSE"
else
  echo "⚠️  Registration response:"
  echo "$REGISTER_RESPONSE"
fi
echo ""

# Test 3: Login
echo "Test 3: Login Test"
echo "-----------------------------------"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/trpc/auth.login \
  -H "Content-Type: application/json" \
  -d '{
    "0": {
      "json": {
        "usernameOrEmail": "testuser@example.com",
        "password": "Test123!"
      }
    }
  }')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
  echo "✅ Login successful!"
  echo "$LOGIN_RESPONSE" | jq . 2>/dev/null || echo "$LOGIN_RESPONSE"
else
  echo "⚠️  Login response:"
  echo "$LOGIN_RESPONSE"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━���━━━━━━"
echo "✅ Tests Complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Now you can:"
echo "   1. Start the app: npx expo start"
echo "   2. Login with: testuser@example.com / Test123!"
echo "   3. Or use demo: test@example.com / Test123!"
echo ""

#!/bin/bash

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Testing Backend Connection"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test root endpoint
echo "1️⃣  Testing root endpoint (/)..."
RESPONSE=$(curl -s http://localhost:3000/)
if [ $? -eq 0 ]; then
  echo "✅ Root endpoint working"
  echo "   Response: $RESPONSE"
else
  echo "❌ Root endpoint failed"
fi

echo ""

# Test health endpoint
echo "2️⃣  Testing health endpoint (/health)..."
RESPONSE=$(curl -s http://localhost:3000/health)
if [ $? -eq 0 ]; then
  echo "✅ Health endpoint working"
  echo "   Response: $RESPONSE"
else
  echo "❌ Health endpoint failed"
fi

echo ""

# Test tRPC endpoint
echo "3️⃣  Testing tRPC endpoint (/api/trpc)..."
RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"0":{"json":{"usernameOrEmail":"test@example.com","password":"Test123!"}}}' \
  http://localhost:3000/api/trpc/auth.login)

if [ $? -eq 0 ]; then
  echo "✅ tRPC endpoint responding"
  echo "   Response: ${RESPONSE:0:200}..."
else
  echo "❌ tRPC endpoint failed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Backend test complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

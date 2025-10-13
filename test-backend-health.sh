#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏥 Backend Health Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PORT=3000
BASE_URL="http://localhost:$PORT"

echo "Testing endpoints..."
echo ""

echo "1. Root endpoint (/):"
curl -s "$BASE_URL/" | jq '.' 2>/dev/null || echo "❌ Failed"
echo ""

echo "2. Health endpoint (/health):"
curl -s "$BASE_URL/health" | jq '.' 2>/dev/null || echo "❌ Failed"
echo ""

echo "3. API Health endpoint (/api/health):"
curl -s "$BASE_URL/api/health" | jq '.' 2>/dev/null || echo "❌ Failed"
echo ""

echo "4. tRPC endpoint test (auth.register):"
curl -s -X POST "$BASE_URL/api/trpc/auth.register" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass123","displayName":"Test User"}' \
  | jq '.' 2>/dev/null || echo "❌ Failed"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Health check complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

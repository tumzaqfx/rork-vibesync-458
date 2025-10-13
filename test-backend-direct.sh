#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Testing Backend Directly"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Health endpoint
echo "Test 1: Health Check"
echo "-----------------------------------"
curl -s http://localhost:3000/health | jq . || echo "❌ Health check failed"
echo ""

# Test 2: API Health endpoint
echo "Test 2: API Health Check"
echo "-----------------------------------"
curl -s http://localhost:3000/api/health | jq . || echo "❌ API health check failed"
echo ""

# Test 3: Root endpoint
echo "Test 3: Root Endpoint"
echo "-----------------------------------"
curl -s http://localhost:3000/ | jq . || echo "❌ Root endpoint failed"
echo ""

# Test 4: tRPC endpoint (should return method not allowed or similar)
echo "Test 4: tRPC Endpoint (GET - should fail gracefully)"
echo "-----------------------------------"
curl -s http://localhost:3000/api/trpc || echo "Response received"
echo ""

# Test 5: Try a tRPC query
echo "Test 5: tRPC Query Test"
echo "-----------------------------------"
curl -s -X POST http://localhost:3000/api/trpc/auth.login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"test@example.com","password":"test123"}' | jq . || echo "Response received"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Tests complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

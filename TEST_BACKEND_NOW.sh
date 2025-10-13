#!/bin/bash

echo "🧪 Testing Backend Connection"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test health endpoint
echo "1️⃣ Testing health endpoint..."
curl -s http://localhost:3000/health | jq . || echo "❌ Health check failed"
echo ""

# Test API health endpoint
echo "2️⃣ Testing API health endpoint..."
curl -s http://localhost:3000/api/health | jq . || echo "❌ API health check failed"
echo ""

# Test tRPC endpoint
echo "3️⃣ Testing tRPC endpoint..."
curl -s http://localhost:3000/api/trpc/example.hi | jq . || echo "❌ tRPC endpoint failed"
echo ""

echo "✅ Backend tests complete!"

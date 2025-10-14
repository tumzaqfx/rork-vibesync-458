#!/bin/bash

echo "🔍 Testing VibeSync Backend Connection"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test root endpoint
echo "1️⃣  Testing root endpoint (http://localhost:3000)..."
curl -s http://localhost:3000 | jq '.' 2>/dev/null || echo "❌ Root endpoint failed"
echo ""

# Test health endpoint
echo "2️⃣  Testing health endpoint (http://localhost:3000/health)..."
curl -s http://localhost:3000/health | jq '.' 2>/dev/null || echo "❌ Health endpoint failed"
echo ""

# Test API health endpoint
echo "3️⃣  Testing API health endpoint (http://localhost:3000/api/health)..."
curl -s http://localhost:3000/api/health | jq '.' 2>/dev/null || echo "❌ API health endpoint failed"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Backend connection test complete!"
echo ""
echo "If all tests passed, your backend is running correctly."
echo "If tests failed, make sure to start the backend with: ./START_BACKEND.sh"

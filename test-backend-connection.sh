#!/bin/bash

echo "🔍 Testing Backend Connection..."
echo ""

# Test if backend is running
echo "Testing http://localhost:3000/health"
curl -s http://localhost:3000/health || echo "❌ Backend not responding"
echo ""

echo "Testing http://localhost:3000/api/health"
curl -s http://localhost:3000/api/health || echo "❌ Backend not responding"
echo ""

# Check if port 3000 is in use
echo "Checking if port 3000 is in use..."
lsof -i :3000 || echo "❌ No process listening on port 3000"
echo ""

echo "💡 To start the backend, run: ./start-backend.sh"

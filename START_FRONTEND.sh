#!/bin/bash

echo ""
echo "🚀 Starting VibeSync Frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if backend is running
if ! curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "⚠️  Backend is not running!"
    echo ""
    echo "Please start the backend first:"
    echo "  ./START_BACKEND_FIRST.sh"
    echo ""
    echo "Or in a new terminal:"
    echo "  bun backend/server.ts"
    echo ""
    exit 1
fi

echo "✅ Backend is running"
echo ""
echo "Starting frontend..."
echo ""

# Start the frontend
bun start

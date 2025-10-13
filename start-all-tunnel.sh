#!/bin/bash

echo "🚀 Starting VibeSync - Backend (Tunnel) + Frontend"
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all processes..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Creating .env from .env.example..."
    cp .env.example .env 2>/dev/null || echo "No .env.example found either"
fi

PROJECT_ID="7omq16pafeyh8vedwdyl6"
BACKEND_URL="https://dev-$PROJECT_ID.rorktest.dev"

echo "📦 Step 1: Starting Backend with Rork Tunnel..."
echo "   Project ID: $PROJECT_ID"
echo "   Backend URL: $BACKEND_URL"
echo ""

# Start backend with tunnel in background
bunx rork backend -p $PROJECT_ID &
BACKEND_PID=$!

echo "⏳ Waiting for backend tunnel to establish..."
sleep 10

# Check if backend is accessible
if curl -f $BACKEND_URL/health > /dev/null 2>&1; then
    echo "✅ Backend tunnel is running!"
    echo ""
else
    echo "⚠️  Backend health check failed, but continuing..."
    echo "   The tunnel might still be establishing..."
    echo ""
fi

echo "📱 Step 2: Starting Frontend..."
echo ""

# Start frontend with Expo tunnel
npx expo start --tunnel --clear

# Wait for background processes
wait

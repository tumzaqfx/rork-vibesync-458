#!/bin/bash

echo "🚀 Starting VibeSync - Backend + Frontend"
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

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Set Expo Router app root
export EXPO_ROUTER_APP_ROOT=./app

# Set default port if not set
export PORT=${PORT:-3000}

echo "📦 Step 1: Starting Backend Server..."
echo "   Port: $PORT"
echo ""

# Start backend in background
bun backend/server.ts &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 5

# Check if backend is running
if curl -f http://localhost:$PORT/health > /dev/null 2>&1; then
    echo "✅ Backend is running!"
    echo ""
else
    echo "⚠️  Backend health check failed, but continuing..."
    echo ""
fi

echo "📱 Step 2: Starting Frontend..."
echo ""

# Start frontend with Expo (using web mode for now)
EXPO_ROUTER_APP_ROOT=./app bun expo start --web --clear

# Wait for background processes
wait

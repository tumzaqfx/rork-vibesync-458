#!/bin/bash

echo "🌐 Starting VibeSync Web"
echo ""

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Set Expo Router app root
export EXPO_ROUTER_APP_ROOT=./app

echo "📱 Starting Frontend (Web)..."
echo ""

# Start frontend with Expo in web mode
EXPO_ROUTER_APP_ROOT=./app bun expo start --web --clear

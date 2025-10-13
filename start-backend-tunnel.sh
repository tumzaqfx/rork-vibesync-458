#!/bin/bash

echo "🚀 Starting VibeSync Backend with Rork Tunnel..."
echo ""

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

PROJECT_ID="7omq16pafeyh8vedwdyl6"

echo "📍 Project ID: $PROJECT_ID"
echo "🌐 Backend URL: https://dev-$PROJECT_ID.rorktest.dev"
echo ""
echo "⏳ Starting backend with tunnel..."
echo ""

# Start the backend with Rork tunnel
bunx rork backend -p $PROJECT_ID

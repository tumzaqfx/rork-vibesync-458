#!/bin/bash

# VibeSync APK Build Startup Script
# This script helps you start everything needed to build a working APK

echo ""
echo "🚀 VibeSync APK Build Helper"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is running
check_backend() {
    echo "Checking backend health..."
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is running!${NC}"
        return 0
    else
        echo -e "${RED}❌ Backend is not running${NC}"
        return 1
    fi
}

# Function to start backend
start_backend() {
    echo ""
    echo "Starting backend server..."
    echo "Press Ctrl+C to stop the backend"
    echo ""
    bun backend/server.ts
}

# Function to start with ngrok
start_with_ngrok() {
    echo ""
    echo "🌐 Starting backend with Ngrok tunnel..."
    echo ""
    
    # Start backend in background
    bun backend/server.ts &
    BACKEND_PID=$!
    
    # Wait for backend to be ready
    echo "Waiting for backend to start..."
    sleep 3
    
    # Start ngrok
    echo ""
    echo "Starting Ngrok tunnel..."
    echo "Copy the HTTPS URL and update your .env file"
    echo ""
    npx ngrok http 3000
    
    # Kill backend when ngrok stops
    kill $BACKEND_PID 2>/dev/null
}

# Function to test local setup
test_setup() {
    echo ""
    echo "Testing local setup..."
    echo ""
    
    # Check if backend is running
    if check_backend; then
        echo ""
        echo -e "${GREEN}✅ Setup looks good!${NC}"
        echo ""
        echo "You can now:"
        echo "  1. Test the app: bun rork start -p 7omq16pafeyh8vedwdyl6"
        echo "  2. Build APK: bun rork build -p 7omq16pafeyh8vedwdyl6 --platform android"
        echo ""
    else
        echo ""
        echo -e "${YELLOW}⚠️  Backend is not running${NC}"
        echo ""
        echo "Start backend with: bun backend/server.ts"
        echo ""
    fi
}

# Function to show environment setup
show_env_setup() {
    echo ""
    echo "📝 Environment Configuration"
    echo "=================================="
    echo ""
    echo "For LOCAL testing (emulator/localhost):"
    echo ""
    echo "  EXPO_PUBLIC_BACKEND_URL=http://localhost:3000"
    echo "  EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3000"
    echo ""
    echo "For PHYSICAL DEVICE testing (with ngrok):"
    echo ""
    echo "  EXPO_PUBLIC_BACKEND_URL=https://your-ngrok-url.ngrok-free.app"
    echo "  EXPO_PUBLIC_RORK_API_BASE_URL=https://your-ngrok-url.ngrok-free.app"
    echo ""
    echo "For PRODUCTION APK:"
    echo ""
    echo "  EXPO_PUBLIC_BACKEND_URL=https://your-production-server.com"
    echo "  EXPO_PUBLIC_RORK_API_BASE_URL=https://your-production-server.com"
    echo ""
}

# Main menu
echo "What would you like to do?"
echo ""
echo "  1) Start backend only (localhost)"
echo "  2) Start backend with Ngrok (for physical devices)"
echo "  3) Test current setup"
echo "  4) Show environment configuration"
echo "  5) Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        start_backend
        ;;
    2)
        start_with_ngrok
        ;;
    3)
        test_setup
        ;;
    4)
        show_env_setup
        ;;
    5)
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "Done!"
echo ""

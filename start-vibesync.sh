#!/bin/bash

echo "🚀 Starting VibeSync App"
echo "========================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Creating .env file..."
    cat > .env << EOF
# Backend Configuration
DATABASE_URL=postgresql://localhost:5432/vibesync
JWT_SECRET=your-secret-key-change-in-production

# Backend URL for health checks and API calls
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000

# Rork Configuration
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev

# Optional: Redis for caching (if needed)
REDIS_URL=redis://localhost:6379

# Expo Router Configuration
EXPO_ROUTER_APP_ROOT=app
EOF
    echo -e "${GREEN}✅ .env file created${NC}"
    echo ""
fi

# Function to check if port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Check if backend is already running
if check_port 3000; then
    echo -e "${GREEN}✅ Backend is already running on port 3000${NC}"
    echo ""
else
    echo -e "${YELLOW}📦 Starting backend server...${NC}"
    echo ""
    
    # Start backend in background
    bun run backend/server.ts > backend.log 2>&1 &
    BACKEND_PID=$!
    
    # Wait for backend to start
    echo "Waiting for backend to start..."
    sleep 3
    
    # Check if backend started successfully
    if check_port 3000; then
        echo -e "${GREEN}✅ Backend started successfully (PID: $BACKEND_PID)${NC}"
        echo "   Logs: tail -f backend.log"
        echo ""
    else
        echo -e "${RED}❌ Failed to start backend${NC}"
        echo "   Check backend.log for errors"
        exit 1
    fi
fi

# Test backend health
echo "🏥 Testing backend health..."
HEALTH_CHECK=$(curl -s http://localhost:3000/health 2>/dev/null)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend health check passed${NC}"
    echo "   Response: $HEALTH_CHECK"
    echo ""
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    echo "   Make sure backend is running properly"
    echo ""
fi

# Start frontend
echo -e "${GREEN}📱 Starting frontend...${NC}"
echo ""
echo "Choose your platform:"
echo "1) Mobile (Expo Go)"
echo "2) Web"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "Starting Expo for mobile..."
        npx expo start --clear
        ;;
    2)
        echo ""
        echo "Starting Expo for web..."
        npx expo start --web --clear
        ;;
    *)
        echo ""
        echo "Starting Expo (default)..."
        npx expo start --clear
        ;;
esac

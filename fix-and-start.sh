#!/bin/bash

echo "🔧 VibeSync - Fix and Start"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Make all scripts executable
echo "📝 Making scripts executable..."
chmod +x *.sh
echo -e "${GREEN}✅ Scripts are now executable${NC}"
echo ""

# Check .env file
if [ ! -f .env ]; then
    echo "⚠️  No .env file found"
    if [ -f .env.example ]; then
        echo "📋 Creating .env from .env.example..."
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created${NC}"
    else
        echo -e "${YELLOW}⚠️  No .env.example found either${NC}"
        echo "Creating basic .env file..."
        cat > .env << 'EOF'
# Backend Configuration
DATABASE_URL=postgresql://localhost:5432/vibesync
JWT_SECRET=your-secret-key-change-in-production

# Backend URL for health checks and API calls
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000

# Rork Configuration
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379
EOF
        echo -e "${GREEN}✅ Basic .env file created${NC}"
    fi
    echo ""
fi

# Show available options
echo "🚀 Ready to start! Choose an option:"
echo ""
echo "1. Start everything (local backend + frontend)"
echo "2. Start with tunnel (for mobile testing)"
echo "3. Test backend only"
echo "4. Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting local backend + frontend..."
        echo ""
        ./start-all.sh
        ;;
    2)
        echo ""
        echo "🚀 Starting backend with tunnel + frontend..."
        echo ""
        ./start-all-tunnel.sh
        ;;
    3)
        echo ""
        echo "🧪 Testing backend..."
        echo ""
        ./test-backend.sh
        ;;
    4)
        echo ""
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Starting local backend + frontend by default..."
        echo ""
        ./start-all.sh
        ;;
esac

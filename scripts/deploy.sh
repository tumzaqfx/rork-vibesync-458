#!/bin/bash

# VibeSync Deployment Script
# This script helps deploy the backend and prepare for app store submission

set -e

echo "🚀 VibeSync Deployment Helper"
echo "=============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "Please create .env file with your backend URL"
    echo "Example: EXPO_PUBLIC_BACKEND_URL=https://your-backend.vercel.app"
    exit 1
fi

# Check if backend URL is configured
if ! grep -q "EXPO_PUBLIC_BACKEND_URL" .env; then
    echo -e "${YELLOW}⚠️  EXPO_PUBLIC_BACKEND_URL not found in .env${NC}"
    echo "Please add your backend URL to .env"
    exit 1
fi

echo -e "${GREEN}✅ Environment configuration found${NC}"
echo ""

# Menu
echo "What would you like to do?"
echo "1) Deploy backend to Vercel"
echo "2) Deploy backend to Railway"
echo "3) Test backend connection"
echo "4) Deploy privacy policy to GitHub Pages"
echo "5) Create production build (iOS)"
echo "6) Create production build (Android)"
echo "7) Run all tests"
echo "8) Exit"
echo ""
read -p "Enter your choice (1-8): " choice

case $choice in
    1)
        echo ""
        echo "📦 Deploying to Vercel..."
        echo ""
        
        # Check if vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}Installing Vercel CLI...${NC}"
            npm install -g vercel
        fi
        
        echo "Deploying..."
        vercel --prod
        
        echo ""
        echo -e "${GREEN}✅ Deployment complete!${NC}"
        echo "Don't forget to:"
        echo "1. Set environment variables in Vercel dashboard"
        echo "2. Update .env with your new backend URL"
        ;;
        
    2)
        echo ""
        echo "🚂 Deploying to Railway..."
        echo ""
        
        # Check if railway CLI is installed
        if ! command -v railway &> /dev/null; then
            echo -e "${YELLOW}Installing Railway CLI...${NC}"
            npm install -g @railway/cli
        fi
        
        echo "Deploying..."
        railway up
        
        echo ""
        echo -e "${GREEN}✅ Deployment complete!${NC}"
        echo "Get your URL with: railway domain"
        ;;
        
    3)
        echo ""
        echo "🔍 Testing backend connection..."
        echo ""
        
        # Extract backend URL from .env
        BACKEND_URL=$(grep EXPO_PUBLIC_BACKEND_URL .env | cut -d '=' -f2)
        
        if [ -z "$BACKEND_URL" ]; then
            echo -e "${RED}❌ Backend URL not found in .env${NC}"
            exit 1
        fi
        
        echo "Testing: $BACKEND_URL/health"
        
        if curl -f -s "$BACKEND_URL/health" > /dev/null; then
            echo -e "${GREEN}✅ Backend is healthy!${NC}"
            curl -s "$BACKEND_URL/health" | json_pp
        else
            echo -e "${RED}❌ Backend is not responding${NC}"
            echo "Please check:"
            echo "1. Backend is deployed"
            echo "2. URL is correct in .env"
            echo "3. Backend is running"
        fi
        ;;
        
    4)
        echo ""
        echo "📄 Deploying to GitHub Pages..."
        echo ""
        
        if [ ! -d ".git" ]; then
            echo -e "${RED}❌ Not a git repository${NC}"
            echo "Initialize git first: git init"
            exit 1
        fi
        
        echo "Committing docs folder..."
        git add docs/
        git commit -m "Add privacy policy and terms" || true
        git push origin main
        
        echo ""
        echo -e "${GREEN}✅ Pushed to GitHub!${NC}"
        echo "Enable GitHub Pages:"
        echo "1. Go to repository Settings"
        echo "2. Pages → Source: Deploy from branch"
        echo "3. Branch: main, Folder: /docs"
        echo "4. Save"
        ;;
        
    5)
        echo ""
        echo "📱 Creating iOS production build..."
        echo ""
        
        # Check if eas CLI is installed
        if ! command -v eas &> /dev/null; then
            echo -e "${YELLOW}Installing EAS CLI...${NC}"
            npm install -g eas-cli
        fi
        
        echo "Building for iOS..."
        eas build --platform ios --profile production
        
        echo ""
        echo -e "${GREEN}✅ Build started!${NC}"
        echo "Check progress: eas build:list"
        ;;
        
    6)
        echo ""
        echo "🤖 Creating Android production build..."
        echo ""
        
        # Check if eas CLI is installed
        if ! command -v eas &> /dev/null; then
            echo -e "${YELLOW}Installing EAS CLI...${NC}"
            npm install -g eas-cli
        fi
        
        echo "Building for Android..."
        eas build --platform android --profile production
        
        echo ""
        echo -e "${GREEN}✅ Build started!${NC}"
        echo "Check progress: eas build:list"
        ;;
        
    7)
        echo ""
        echo "🧪 Running tests..."
        echo ""
        
        # Test backend connection
        BACKEND_URL=$(grep EXPO_PUBLIC_BACKEND_URL .env | cut -d '=' -f2)
        
        echo "1. Testing backend health..."
        if curl -f -s "$BACKEND_URL/health" > /dev/null; then
            echo -e "${GREEN}   ✅ Backend healthy${NC}"
        else
            echo -e "${RED}   ❌ Backend not responding${NC}"
        fi
        
        echo ""
        echo "2. Checking environment variables..."
        if grep -q "EXPO_PUBLIC_BACKEND_URL" .env; then
            echo -e "${GREEN}   ✅ Backend URL configured${NC}"
        else
            echo -e "${RED}   ❌ Backend URL missing${NC}"
        fi
        
        echo ""
        echo "3. Checking privacy policy..."
        if [ -f "docs/privacy.html" ]; then
            echo -e "${GREEN}   ✅ Privacy policy exists${NC}"
        else
            echo -e "${RED}   ❌ Privacy policy missing${NC}"
        fi
        
        echo ""
        echo "4. Checking terms of service..."
        if [ -f "docs/terms.html" ]; then
            echo -e "${GREEN}   ✅ Terms of service exists${NC}"
        else
            echo -e "${RED}   ❌ Terms of service missing${NC}"
        fi
        
        echo ""
        echo "Tests complete!"
        ;;
        
    8)
        echo "Goodbye! 👋"
        exit 0
        ;;
        
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "Done! 🎉"

#!/bin/bash

# VibeSync Production Setup Script
# Prepares the app for production deployment

set -e

echo "🔧 VibeSync Production Setup"
echo "============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"

if ! command -v bun &> /dev/null; then
    echo -e "${RED}❌ Bun not found. Please install Bun first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Bun installed${NC}"

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git not found. Please install Git first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git installed${NC}"

echo ""

# Step 2: Install dependencies
echo -e "${BLUE}Step 2: Installing dependencies...${NC}"
bun install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 3: Setup environment
echo -e "${BLUE}Step 3: Setting up environment...${NC}"

if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env and add your backend URL${NC}"
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

# Check if backend URL is set
if grep -q "EXPO_PUBLIC_BACKEND_URL=https://dev-" .env; then
    echo -e "${YELLOW}⚠️  Backend URL is still using dev URL${NC}"
    echo "Please update EXPO_PUBLIC_BACKEND_URL in .env with your production URL"
fi

echo ""

# Step 4: Generate JWT secret
echo -e "${BLUE}Step 4: Generating secure JWT secret...${NC}"

if command -v openssl &> /dev/null; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "Your JWT secret (save this for backend deployment):"
    echo -e "${GREEN}$JWT_SECRET${NC}"
    echo ""
    echo "Add this to your backend environment variables:"
    echo "JWT_SECRET=$JWT_SECRET"
else
    echo -e "${YELLOW}⚠️  OpenSSL not found. Generate JWT secret manually.${NC}"
fi

echo ""

# Step 5: Check app.json
echo -e "${BLUE}Step 5: Checking app.json configuration...${NC}"

if grep -q "app.rork.vibesync" app.json; then
    echo -e "${YELLOW}⚠️  Bundle identifier still uses default${NC}"
    echo "Please update app.json manually:"
    echo "  - bundleIdentifier: com.vibesync.app"
    echo "  - package: com.vibesync.app"
else
    echo -e "${GREEN}✅ Bundle identifier configured${NC}"
fi

echo ""

# Step 6: Check legal documents
echo -e "${BLUE}Step 6: Checking legal documents...${NC}"

if [ -f "docs/privacy.html" ]; then
    echo -e "${GREEN}✅ Privacy policy exists${NC}"
else
    echo -e "${RED}❌ Privacy policy missing${NC}"
fi

if [ -f "docs/terms.html" ]; then
    echo -e "${GREEN}✅ Terms of service exists${NC}"
else
    echo -e "${RED}❌ Terms of service missing${NC}"
fi

if [ -f "docs/support.html" ]; then
    echo -e "${GREEN}✅ Support page exists${NC}"
else
    echo -e "${RED}❌ Support page missing${NC}"
fi

echo ""

# Step 7: Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Production setup complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Deploy Backend:"
echo "   - Run: ./scripts/deploy.sh"
echo "   - Or manually deploy to Vercel/Railway"
echo "   - See: DEPLOYMENT_GUIDE.md"
echo ""
echo "2. Update .env:"
echo "   - Add your production backend URL"
echo "   - EXPO_PUBLIC_BACKEND_URL=https://your-backend.com"
echo ""
echo "3. Host Legal Documents:"
echo "   - Enable GitHub Pages for /docs folder"
echo "   - Or deploy docs/ to Vercel"
echo "   - Update app.json with URLs"
echo ""
echo "4. Update app.json:"
echo "   - Change bundle identifier"
echo "   - Add privacy policy URL"
echo "   - Add terms of service URL"
echo "   - Add support URL"
echo ""
echo "5. Create App Store Assets:"
echo "   - Take screenshots on real devices"
echo "   - See: APP_STORE_ASSETS_GUIDE.md"
echo ""
echo "6. Create Developer Accounts:"
echo "   - Apple Developer Program (\$99/year)"
echo "   - Google Play Developer (\$25 one-time)"
echo ""
echo "7. Create Production Builds:"
echo "   - Install EAS CLI: npm install -g eas-cli"
echo "   - iOS: eas build --platform ios --profile production"
echo "   - Android: eas build --platform android --profile production"
echo ""
echo "8. Submit to Stores:"
echo "   - Follow: APP_STORE_SUBMISSION_CHECKLIST.md"
echo ""
echo "For detailed instructions, see:"
echo "  - DEPLOYMENT_GUIDE.md"
echo "  - APP_STORE_SUBMISSION_CHECKLIST.md"
echo ""
echo "Good luck! 🚀"

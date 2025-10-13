#!/bin/bash

# VibeSync - Create Test User Script
# Usage: ./create-user.sh

echo "🎨 VibeSync - Create Test User"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if backend is running
echo "🔍 Checking if backend is running..."
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not running"
    echo ""
    echo "Please start the backend first:"
    echo "  bun backend/server.ts"
    echo ""
    exit 1
fi

echo ""
echo "Please enter user details:"
echo ""

# Get user input
read -p "📧 Email: " email
read -p "👤 Username: " username
read -p "🏷️  Display Name: " displayName
read -sp "🔐 Password: " password
echo ""
echo ""

# Validate input
if [ -z "$email" ] || [ -z "$username" ] || [ -z "$displayName" ] || [ -z "$password" ]; then
    echo "❌ All fields are required"
    exit 1
fi

# Create user
echo "Creating user..."
bun scripts/create-test-user.ts "$email" "$password" "$username" "$displayName"

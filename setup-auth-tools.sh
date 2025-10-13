#!/bin/bash

# Setup Authentication Tools
# This script makes the user creation script executable

echo "🔧 Setting up authentication tools..."
echo ""

# Make create-user.sh executable
chmod +x create-user.sh
echo "✅ create-user.sh is now executable"

# Make this script executable too
chmod +x setup-auth-tools.sh
echo "✅ setup-auth-tools.sh is now executable"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "You can now use:"
echo "  ./create-user.sh - Interactive user creation"
echo ""
echo "Or directly:"
echo "  bun scripts/create-test-user.ts email password username \"Display Name\""
echo ""

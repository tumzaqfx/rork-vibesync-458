#!/bin/bash

echo "🔧 Fixing script permissions..."
echo ""

# Make all shell scripts executable
chmod +x START_APP_NOW.sh
chmod +x test-backend-simple.sh
chmod +x start-simple.sh
chmod +x start-vibesync-simple.sh 2>/dev/null || true
chmod +x kill-backend.sh 2>/dev/null || true

echo "✅ All scripts are now executable!"
echo ""
echo "You can now run:"
echo "  ./START_APP_NOW.sh"
echo ""

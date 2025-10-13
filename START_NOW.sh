#!/bin/bash

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║                                          ║"
echo "║      🚀 VibeSync - Starting Now! 🚀     ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Make all scripts executable
chmod +x RUN.sh START_VIBESYNC_SIMPLE.sh test-backend-quick.sh start-backend-now.sh start-frontend-now.sh 2>/dev/null

# Run the main script
exec ./RUN.sh

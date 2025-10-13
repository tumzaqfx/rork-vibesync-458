#!/bin/bash

echo "Making all scripts executable..."

chmod +x FINAL_START.sh
chmod +x START_APP.sh
chmod +x setup-database.sh
chmod +x start-backend.sh
chmod +x start-frontend.sh
chmod +x create-test-user.ts
chmod +x test-backend.ts

echo "✅ All scripts are now executable!"
echo ""
echo "You can now run:"
echo "  ./FINAL_START.sh"

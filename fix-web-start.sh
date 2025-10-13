#!/bin/bash

echo "🧹 Clearing caches..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf web-build

echo "✅ Cache cleared!"
echo ""
echo "🚀 Starting web app..."
bun run start-web

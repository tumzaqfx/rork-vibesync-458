#!/bin/bash

echo "🔧 Rebuilding better-sqlite3 for Bun..."

# Remove existing better-sqlite3
rm -rf node_modules/better-sqlite3

# Reinstall with bun
bun install better-sqlite3

echo "✅ better-sqlite3 rebuilt successfully"

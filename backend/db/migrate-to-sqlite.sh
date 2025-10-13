#!/bin/bash

# Script to convert PostgreSQL queries to SQLite syntax
# Replaces $1, $2, etc. with ?

echo "Converting PostgreSQL queries to SQLite syntax..."

# Find all .ts files in backend/trpc/routes and replace $N with ?
find backend/trpc/routes -name "*.ts" -type f -exec sed -i 's/\$[0-9]\+/?/g' {} \;

echo "✅ Conversion complete!"
echo "Note: You may need to manually adjust some queries for SQLite compatibility"

#!/bin/bash

echo "🔍 Checking for processes on port 3000..."

# Find and kill any process using port 3000
PID=$(lsof -ti:3000)

if [ -z "$PID" ]; then
  echo "✅ Port 3000 is free"
else
  echo "🔪 Killing process $PID on port 3000..."
  kill -9 $PID
  sleep 1
  echo "✅ Port 3000 is now free"
fi

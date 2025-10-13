#!/bin/bash

# Kill port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Start backend in background
bun run backend/server.ts &

# Wait 3 seconds
sleep 3

# Start frontend
npx expo start

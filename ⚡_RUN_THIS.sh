#!/bin/bash
clear
cat << "EOF"
╔══════════════════════════════════════════╗
║                                          ║
║         🚀 VIBESYNC STARTUP 🚀          ║
║                                          ║
╚══════════════════════════════════════════╝
EOF
echo ""
pkill -f "bun.*backend/server.ts" 2>/dev/null || true
pkill -f "expo start" 2>/dev/null || true
sleep 1
echo "🔧 Starting backend..."
bun run backend/server.ts > backend.log 2>&1 &
BACKEND_PID=$!
for i in {1..15}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend ready!"
    break
  fi
  sleep 1
done
echo "📱 Starting frontend..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Ready! Press 'w' for web"
echo "🔐 Login: test@example.com / Test123!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
npx expo start --clear
trap "kill $BACKEND_PID 2>/dev/null; exit 0" INT TERM EXIT

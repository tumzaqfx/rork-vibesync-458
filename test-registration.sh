#!/bin/bash

echo "🧪 Testing VibeSync Registration System"
echo "========================================"
echo ""

BACKEND_URL="${EXPO_PUBLIC_RORK_API_BASE_URL:-http://localhost:3000}"

echo "Step 1: Testing Backend Health..."
echo "URL: $BACKEND_URL/health"
echo ""

HEALTH_RESPONSE=$(curl -s "$BACKEND_URL/health")
if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo "✅ Backend is healthy!"
    echo "Response: $HEALTH_RESPONSE"
else
    echo "❌ Backend health check failed!"
    echo "Response: $HEALTH_RESPONSE"
    echo ""
    echo "Please start the backend first:"
    echo "  bash start-backend-fixed.sh"
    exit 1
fi

echo ""
echo "Step 2: Testing tRPC Endpoint..."
echo "URL: $BACKEND_URL/api/trpc"
echo ""

# Test if tRPC endpoint is accessible
TRPC_RESPONSE=$(curl -s "$BACKEND_URL/api/trpc")
if [ -n "$TRPC_RESPONSE" ]; then
    echo "✅ tRPC endpoint is accessible!"
else
    echo "❌ tRPC endpoint is not accessible!"
    exit 1
fi

echo ""
echo "Step 3: Testing Registration Endpoint..."
echo ""

# Generate random test user
RANDOM_NUM=$RANDOM
TEST_EMAIL="test${RANDOM_NUM}@example.com"
TEST_USERNAME="testuser${RANDOM_NUM}"
TEST_PASSWORD="Test123!@#"
TEST_DISPLAY_NAME="Test User ${RANDOM_NUM}"

echo "Test User Details:"
echo "  Email: $TEST_EMAIL"
echo "  Username: $TEST_USERNAME"
echo "  Password: $TEST_PASSWORD"
echo "  Display Name: $TEST_DISPLAY_NAME"
echo ""

# Create registration request
REGISTER_PAYLOAD=$(cat <<EOF
{
  "0": {
    "json": {
      "username": "$TEST_USERNAME",
      "email": "$TEST_EMAIL",
      "password": "$TEST_PASSWORD",
      "displayName": "$TEST_DISPLAY_NAME"
    }
  }
}
EOF
)

echo "Sending registration request..."
REGISTER_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "$REGISTER_PAYLOAD" \
  "$BACKEND_URL/api/trpc/auth.register")

echo ""
echo "Response:"
echo "$REGISTER_RESPONSE"
echo ""

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
    echo "✅ Registration successful!"
    echo ""
    echo "User has been created in the database."
    echo "You can now login with:"
    echo "  Email: $TEST_EMAIL"
    echo "  Password: $TEST_PASSWORD"
else
    echo "❌ Registration failed!"
    echo ""
    if echo "$REGISTER_RESPONSE" | grep -q "already exists"; then
        echo "Reason: User already exists (this is expected if you ran this test before)"
    else
        echo "Check the error message above for details."
    fi
fi

echo ""
echo "========================================"
echo "Test Complete!"
echo ""
echo "Next Steps:"
echo "1. Open the VibeSync app"
echo "2. Go to registration screen"
echo "3. Fill in the form with valid data"
echo "4. Complete all 4 steps"
echo "5. Click 'Finish & Start Vibing'"
echo ""
echo "If registration fails in the app, check:"
echo "- Backend is running (bash start-backend-fixed.sh)"
echo "- Database is accessible"
echo "- .env file has correct URLs"
echo "- Check logs for detailed error messages"

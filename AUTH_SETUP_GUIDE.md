# VibeSync Authentication Setup Guide

## Current Authentication Status

The VibeSync app has a fully functional authentication system that connects to a PostgreSQL database backend.

## How Authentication Works

### 1. **Backend Authentication (Primary)**
When the backend is running, the app will:
- Attempt to authenticate users against the PostgreSQL database
- Validate credentials using bcrypt password hashing
- Issue JWT tokens for authenticated sessions
- Support full user registration and login

### 2. **Demo Mode (Fallback)**
When the backend is NOT available, the app will:
- Fall back to demo mode automatically
- Only accept demo credentials: `test@example.com` / `Test123!`
- Use mock data for the user session
- Display a message indicating demo mode is active

## Setting Up Real User Authentication

### Step 1: Ensure Backend is Running

```bash
# Start the backend server
bun backend/server.ts

# Or use the convenience script
./start-backend.sh
```

The backend should start on `http://localhost:3000` and display:
```
✅ Backend server running on http://localhost:3000
🏥 Health check: http://localhost:3000/health
```

### Step 2: Verify Database Connection

Make sure your `.env` file has the correct database URL:

```env
DATABASE_URL=postgresql://localhost:5432/vibesync
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
```

### Step 3: Create a Test User

You can create a test user in two ways:

#### Option A: Use the Registration Screen
1. Open the app
2. Click "Sign Up" on the login screen
3. Fill in the registration form:
   - Email: your-email@example.com
   - Username: yourusername
   - Display Name: Your Name
   - Password: YourPassword123!
4. Submit the form

#### Option B: Insert Directly into Database

```sql
-- Connect to your PostgreSQL database
psql -d vibesync

-- Insert a test user (password is 'Test123!' hashed with bcrypt)
INSERT INTO users (username, email, password_hash, display_name)
VALUES (
  'testuser',
  'jason.zama@gmail.com',
  '$2a$10$YourBcryptHashHere',  -- You need to generate this
  'Jason Zama'
);
```

To generate a bcrypt hash for a password, you can use this Node.js script:

```javascript
const bcrypt = require('bcryptjs');
const password = 'YourPassword123!';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

### Step 4: Test Login

1. Open the app
2. Enter your email and password
3. Click "Login"
4. You should be authenticated and redirected to the home feed

## Troubleshooting

### Error: "Backend is not available. For demo mode, use: test@example.com / Test123!"

**Cause:** The backend server is not running or not reachable.

**Solution:**
1. Start the backend: `bun backend/server.ts`
2. Check that it's running on `http://localhost:3000`
3. Verify the health endpoint: `curl http://localhost:3000/health`
4. Check your `.env` file has `EXPO_PUBLIC_BACKEND_URL=http://localhost:3000`

### Error: "Invalid credentials"

**Cause:** The email/password combination doesn't exist in the database.

**Solution:**
1. Verify the user exists in the database: `SELECT * FROM users WHERE email = 'your-email@example.com';`
2. If not, create the user using the registration screen or SQL insert
3. Make sure the password is correct

### Error: "Network request failed"

**Cause:** The app cannot reach the backend server.

**Solution:**
1. Ensure backend is running
2. Check firewall settings
3. Verify the backend URL in `.env`
4. Try accessing the health endpoint in your browser: `http://localhost:3000/health`

## Demo Mode

If you just want to test the app without setting up authentication:

1. Use the demo credentials:
   - Email: `test@example.com`
   - Password: `Test123!`

2. This will work even if the backend is not running

## Email Functionality

Currently, email sending is not fully configured. To enable email features:

1. Set up an SMTP service (e.g., SendGrid, AWS SES, Mailgun)
2. Add SMTP credentials to `.env`
3. Configure the email service in `utils/email-service.ts`

## Security Notes

- Passwords are hashed using bcrypt with a cost factor of 10
- JWT tokens are used for session management
- Tokens expire after 30 days
- Rate limiting is enabled (5 attempts per minute per email)
- All sensitive data is stored securely using AsyncStorage encryption

## Next Steps

1. ✅ Backend authentication is working
2. ✅ Demo mode fallback is working
3. ⏳ Email verification (requires SMTP setup)
4. ⏳ Password reset emails (requires SMTP setup)
5. ⏳ Social authentication (optional)

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify backend is running and healthy
3. Check database connection
4. Review this guide for common solutions

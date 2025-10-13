# 🚀 Start VibeSync Backend

## Quick Start

```bash
chmod +x fix-backend.sh
./fix-backend.sh
```

This will:
1. Rebuild `better-sqlite3` for Bun
2. Start the backend server
3. Test the connection

## What was the problem?

The `better-sqlite3` module was compiled for Node.js, but we're using Bun. The fix script rebuilds it for Bun's runtime.

## After backend starts

In a **new terminal**, start the frontend:

```bash
bun start
```

Then press `w` to open in web browser.

## Test Login

- Email: `test@example.com`
- Password: `Test123!`

## Troubleshooting

If port 3000 is in use:
```bash
lsof -ti:3000 | xargs kill -9
./fix-backend.sh
```

If database errors occur:
```bash
rm vibesync.db
./fix-backend.sh
```

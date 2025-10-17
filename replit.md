# VibeSync - Replit Configuration

## Project Overview
VibeSync is an Expo React Native social media application with a Bun backend server. This project was migrated from Vercel to Replit on October 17, 2025.

## Architecture
- **Frontend**: Expo React Native (mobile/web)
- **Backend**: Bun + Hono + tRPC API server
- **Database**: SQLite (in-memory for development)
- **Package Manager**: Bun

## Replit Setup

### Environment Variables (Secrets)
The following secrets are configured via Replit Secrets:
- `JWT_SECRET`: Authentication token signing key
- `EXPO_PUBLIC_BACKEND_URL`: Backend API URL (https://8edf096c-5b0a-4bbd-a881-9a064ecfd3be-00-9bjy7bnk8qn2.janeway.replit.dev)
- `EXPO_PUBLIC_RORK_API_BASE_URL`: Same as backend URL
- `DATABASE_URL`: PostgreSQL connection string (if using PostgreSQL)

### Workflows
- **Backend Server**: Runs the Hono/tRPC API server on port 5000
  - Command: `bun run backend/replit-server.ts`
  - Port: 5000
  - Type: webview

## Project Structure
```
.
├── app/                    # Expo Router app directory
├── backend/               # Backend server code
│   ├── replit-server.ts  # Replit-compatible server entry (port 5000, 0.0.0.0)
│   ├── server.ts         # Original server entry
│   ├── hono.ts          # Hono app configuration
│   ├── trpc/            # tRPC routers and procedures
│   └── db/              # Database configuration
├── components/           # React components
├── hooks/               # Custom hooks and stores
└── lib/                # Utility libraries

```

## Recent Changes (Oct 17, 2025)

### Migration from Vercel to Replit
1. Updated backend server to use port 5000 and bind to 0.0.0.0 for Replit compatibility
2. Created `backend/replit-server.ts` for Replit-specific server configuration
3. Configured environment variables via Replit Secrets
4. Set up backend workflow to run on port 5000
5. Verified backend connectivity via public Replit URL

### Technical Details
- Backend now exports Bun server config object with port, hostname, and fetch handler
- Server runs on `0.0.0.0:5000` for public accessibility
- CORS configured to accept all origins for development
- Database uses SQLite in-memory mode (fallback from PostgreSQL)

## How to Run
The backend server automatically starts via the configured workflow. You can also run it manually:
```bash
bun run backend/replit-server.ts
```

## API Endpoints
- `GET /` - API status
- `GET /health` - Health check
- `GET /api/health` - API health check  
- `POST /api/trpc/*` - tRPC endpoints

## User Preferences
(To be added as user expresses preferences)

# 📊 VibeSync Architecture

## Current Setup (After Fix)

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR COMPUTER                            │
│                                                              │
│  ┌────────────────────┐         ┌─────────────────────┐    │
│  │   BACKEND SERVER   │         │   FRONTEND APP      │    │
│  │                    │         │                     │    │
│  │  Port: 3000        │◄────────┤  Expo + React       │    │
│  │  URL: localhost    │  HTTP   │  Native             │    │
│  │                    │         │                     │    │
│  │  ┌──────────────┐  │         │  ┌───────────────┐  │    │
│  ���  │  tRPC API    │  │         │  │  tRPC Client  │  │    │
│  │  │  /api/trpc   │  │         │  │               │  │    │
│  │  └──────────────┘  │         │  └───────────────┘  │    │
│  │                    │         │                     │    │
│  │  ┌──────────────┐  │         └─────────────────────┘    │
│  │  │  In-Memory   │  │                                     │
│  │  │  Database    │  │         ┌─────────────────────┐    │
│  │  └──────────────┘  │         │   YOUR DEVICE       │    │
│  │                    │         │                     │    │
│  └────────────────────┘         │  Scan QR Code       │    │
│                                 │  or Open Browser    │    │
│                                 │                     │    │
│                                 └─────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## What Was Wrong (Before Fix)

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR COMPUTER                            │
│                                                              │
│  ┌────────────────────┐                                     │
│  │   BACKEND SERVER   │                                     │
│  │                    │                                     │
│  │  ❌ NOT RUNNING    │                                     │
│  │                    │                                     │
│  └────────────────────┘                                     │
│                                                              │
│         ┌─────────────────────┐                             │
│         │   FRONTEND APP      │                             │
│         │                     │                             │
│         │  Trying to connect  │────────────X                │
│         │  to dead tunnel:    │   404 Error                 │
│         │                     │                             │
│         │  https://dev-...    │   ❌ Connection Failed      │
│         │  .rorktest.dev      │                             │
│         │                     │                             │
│         └─────────────────────┘                             │
│                                                              │
└───────────��─────────────────────────────────────────────────┘
```

## Request Flow (After Fix)

```
┌──────────────┐
│   User       │
│   Opens App  │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│   Frontend           │
│   (React Native)     │
└──────┬───────────────┘
       │
       │ HTTP Request
       │ http://localhost:3000/api/trpc
       │
       ▼
┌──────────────────────┐
│   Backend            │
│   (Hono + tRPC)      │
└──────┬───────────────┘
       │
       │ Query
       │
       ▼
┌──────────────────────┐
│   In-Memory DB       │
│   (No setup needed)  │
└──────────────────────┘
```

## Environment Variables

### `.env.local` (Active - Overrides `.env`)
```bash
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3000
```

### `.env` (Fallback)
```bash
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3000
```

## Startup Sequence

```
1. START_EVERYTHING.sh
   │
   ├─► Kill port 3000 (if in use)
   │
   ├─► Start Backend (bun backend/server.ts)
   │   │
   │   ├─► Initialize in-memory database
   │   ├─► Start Hono server on port 3000
   │   └─► Ready! ✅
   │
   ├─► Wait for backend health check
   │   │
   │   └─► curl http://localhost:3000/health
   │
   └─► Start Frontend (bun start)
       │
       ├─► Load environment variables
       ├─► Connect to backend
       ├─► Start Expo dev server
       └─► Show QR code ✅
```

## API Endpoints

### Backend (http://localhost:3000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info |
| `/health` | GET | Health check |
| `/api/health` | GET | API health check |
| `/api/trpc/*` | POST | tRPC procedures |

### tRPC Procedures

| Procedure | Type | Description |
|-----------|------|-------------|
| `auth.register` | mutation | Register new user |
| `auth.login` | mutation | Login user |
| `auth.me` | query | Get current user |
| `users.profile` | query | Get user profile |
| `posts.list` | query | List posts |
| `posts.create` | mutation | Create post |
| `live.list` | query | List live streams |
| `messages.conversations` | query | Get conversations |

## Database Schema (In-Memory)

```typescript
interface User {
  id: number;
  email: string;
  password: string;  // hashed
  username: string;
  full_name: string;
  bio: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface Post {
  id: number;
  user_id: number;
  content: string;
  media_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

// ... and more tables
```

## Tech Stack

### Frontend
- React Native 0.79.1
- Expo 53
- Expo Router (file-based routing)
- tRPC React Query
- TypeScript

### Backend
- Bun runtime
- Hono (web framework)
- tRPC (type-safe API)
- In-memory database
- TypeScript

## Development vs Production

### Development (Current)
- Backend: `http://localhost:3000`
- Database: In-memory (resets on restart)
- Auth: Simple JWT

### Production (Future)
- Backend: `https://api.vibesync.app`
- Database: PostgreSQL/MySQL
- Auth: OAuth + JWT
- CDN: For media files

## Why Localhost Works

✅ **Web Browser**: Direct connection to localhost
✅ **iOS Simulator**: Shares network with host
✅ **Android Emulator**: Can access host via localhost

❌ **Physical Device**: Cannot access localhost
   → Use tunnel: `./start-backend-tunnel.sh`

## Summary

The fix was simple:
1. Backend wasn't running
2. Frontend was trying to connect to dead tunnel URL
3. Changed `.env.local` to use `localhost:3000`
4. Created scripts to start both servers
5. Now everything works! ✅

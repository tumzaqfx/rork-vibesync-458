# 🔄 VibeSync Startup Flow

## Visual Startup Process

```
┌─────────────────────────────────────────────────────────────┐
│                    START_EVERYTHING.sh                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Check Port 3000     │
              │  Is it free?         │
              └──────────┬───────────┘
                         │
                    ┌────┴────┐
                    │         │
                   Yes       No
                    │         │
                    │         ▼
                    │    ┌─────────────────┐
                    │    │  Kill Process   │
                    │    │  on Port 3000   │
                    │    └────────┬────────┘
                    │             │
                    └─────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Start Backend       │
              │  bun backend/server  │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Initialize Database │
              │  (In-Memory)         │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Start Hono Server   │
              │  Port: 3000          │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Health Check Loop   │
              │  (30 attempts)       │
              └──────────┬───────────┘
                         │
                    ┌────┴────┐
                    │         │
                  Ready    Failed
                    │         │
                    │         ▼
                    │    ┌─────────────────┐
                    │    │  Show Error     │
                    │    │  Exit           │
                    │    └─────────────────┘
                    │
                    ▼
              ┌──────────────────────┐
              │  Start Frontend      │
              │  bun start           │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Load .env.local     │
              │  Get Backend URL     │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Initialize tRPC     │
              │  Client              │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Start Expo Server   │
              │  Show QR Code        │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  ✅ READY TO USE!    │
              └──────────────────────┘
```

## Request Flow (After Startup)

```
┌──────────────┐
│   User       │
│   Opens App  │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│   Login Screen       │
│   Enter Credentials  │
└──────┬───────────────┘
       │
       │ POST /api/trpc/auth.login
       │
       ▼
┌──────────────────────┐
│   tRPC Client        │
│   (Frontend)         │
└──────┬───────────────┘
       │
       │ HTTP Request
       │ http://localhost:3000/api/trpc
       │
       ▼
┌──────────────────────┐
│   Hono Server        │
│   (Backend)          │
└──────┬───────────────┘
       │
       │ Route to tRPC
       │
       ▼
┌──────────────────────┐
│   tRPC Router        │
│   auth.login         │
└──────┬───────────────┘
       │
       │ Query Database
       │
       ▼
┌──────────────────────┐
│   In-Memory DB       │
│   Find User          │
└──────┬───────────────┘
       │
       │ Return User Data
       │
       ▼
┌──────────────────────┐
│   Generate JWT       │
│   Token              │
└──────┬───────────────┘
       │
       │ Return Response
       │
       ▼
┌──────────────────────┐
│   tRPC Client        │
│   Receive Token      │
└──────┬───────────────┘
       │
       │ Store Token
       │
       ▼
┌──────────────────────┐
│   Navigate to        │
│   Home Screen        │
└──────────────────────┘
```

## Error Handling Flow

```
┌──────────────────────┐
│   Frontend Request   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│   Try Connect to     │
│   Backend            │
└──────┬───────────────┘
       │
  ┌────┴────┐
  │         │
Success   Error
  │         │
  │         ▼
  │    ┌─────────────────────┐
  │    │  Check Error Type   │
  │    └────────┬────────────┘
  │             │
  │        ┌────┴────┐
  │        │         │
  │       404      Other
  │        │         │
  │        ▼         ▼
  │    ┌────────┐ ┌──────────┐
  │    │Backend │ │ Network  │
  │    │Not     │ │ Error    │
  │    │Found   │ │          │
  │    └────┬───┘ └────┬─────┘
  │         │          │
  │         ▼          ▼
  │    ┌─────────────────────┐
  │    │  Show Error Message │
  │    │  with Instructions  │
  │    └─────────────────────┘
  │
  ▼
┌──────────────────────┐
│   Process Response   │
│   Update UI          │
└──────────────────────┘
```

## Health Check Flow

```
┌──────────────────────┐
│   Frontend Starts    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│   Load Environment   │
│   Variables          │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│   Get Backend URL    │
│   localhost:3000     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│   Try Health Check   │
│   GET /health        │
└──────┬───────────────┘
       │
  ┌────┴────┐
  │         │
Success   Fail
  │         │
  │         ▼
  │    ┌─────────────────────┐
  │    │  Show Warning       │
  │    │  "Backend not       │
  │    │   running"          │
  │    └─────────────────────┘
  │
  ▼
┌──────────────────────┐
│   Backend Healthy    │
│   Continue Startup   │
└──────────────────────┘
```

## Database Initialization Flow

```
┌──────────────────────┐
│   Backend Starts     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│   Import connection  │
│   module             │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│   Initialize         │
│   In-Memory Storage  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│   Create Empty       │
│   Collections:       │
│   - users            │
│   - posts            │
│   - comments         │
│   - etc.             │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│   Set Counters       │
│   to 1               │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│   ✅ Database Ready  │
└──────────────────────┘
```

## Troubleshooting Decision Tree

```
                    ┌──────────────────┐
                    │  App Not Working │
                    └────────┬─────────┘
                             │
                        ┌────┴────┐
                        │         │
                   Backend    Frontend
                    Error      Error
                        │         │
                        ▼         ▼
              ┌──────────────┐ ┌──────────────┐
              │ Port 3000    │ │ Clear Cache  │
              │ in use?      │ │ rm -rf .expo │
              └──────┬───────┘ └──────┬───────┘
                     │                │
                    Yes              No
                     │                │
                     ▼                ▼
              ┌──────────────┐ ┌──────────────┐
              │ Kill Process │ │ Check .env   │
              │ lsof -ti:3000│ │ .local       │
              └──────┬───────┘ └──────┬───────┘
                     │                │
                     └────────┬───────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Restart Both    │
                    │  Servers         │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Still Broken?   │
                    │  Read Docs       │
                    └──────────────────┘
```

## Summary

The startup process:
1. ✅ Check and free port 3000
2. ✅ Start backend server
3. ✅ Initialize in-memory database
4. ✅ Wait for backend to be ready
5. ✅ Start frontend with Expo
6. ✅ Connect to backend
7. ✅ Show QR code
8. ✅ Ready to use!

All of this is automated in `START_EVERYTHING.sh`! 🚀

import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import { isHealthy } from "./src/db/connection";

const app = new Hono();

app.use("*", cors({
  origin: (origin) => {
    console.log('[CORS] Request from origin:', origin);
    return origin;
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-trpc-source'],
  credentials: true,
  maxAge: 86400,
}));

app.use('*', async (c, next) => {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;
  
  console.log(`[${new Date().toISOString()}] → ${method} ${path}`);
  
  await next();
  
  const duration = Date.now() - start;
  console.log(`[${new Date().toISOString()}] ← ${method} ${path} ${c.res.status} (${duration}ms)`);
});

app.get("/", (c) => {
  return c.json({ 
    status: "ok", 
    message: "VibeSync API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      api_health: "/api/health",
      trpc: "/api/trpc",
    }
  });
});

app.get("/health", (c) => {
  try {
    const dbHealthy = isHealthy();
    
    if (!dbHealthy) {
      return c.json({ 
        status: "degraded",
        database: "disconnected",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        service: "VibeSync Backend"
      }, 503);
    }
    
    return c.json({ 
      status: "ok",
      database: "connected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: "VibeSync Backend"
    }, 200);
  } catch (error: any) {
    console.error('[Health Check] Error:', error.message);
    return c.json({ 
      status: "error",
      message: "Health check failed",
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

app.get("/api/health", (c) => {
  try {
    const dbHealthy = isHealthy();
    
    if (!dbHealthy) {
      return c.json({ 
        status: "degraded",
        database: "disconnected",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        service: "VibeSync Backend"
      }, 503);
    }
    
    return c.json({ 
      status: "ok",
      database: "connected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: "VibeSync Backend"
    }, 200);
  } catch (error: any) {
    console.error('[Health Check] Error:', error.message);
    return c.json({ 
      status: "error",
      message: "Health check failed",
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
    onError({ error, path, type, input }) {
      console.error('[tRPC Error]', {
        path,
        type,
        code: error.code,
        message: error.message,
        input: JSON.stringify(input).substring(0, 200),
      });
    },
  })
);

app.options("/api/trpc/*", (c) => {
  return c.text('', 204);
});

app.notFound((c) => {
  console.log('[404] Not found:', c.req.path);
  return c.json({ 
    error: "Not Found", 
    path: c.req.path,
    message: "The requested endpoint does not exist"
  }, 404);
});

app.onError((err, c) => {
  console.error('[Server Error]', {
    path: c.req.path,
    method: c.req.method,
    error: err.message,
    stack: err.stack,
  });
  
  return c.json({ 
    error: "Internal Server Error", 
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
    path: c.req.path,
  }, 500);
});

export default app;
import app from './hono';
import { testConnection, closePool } from './db/connection';

const port = parseInt(process.env.PORT || '5000', 10);
const hostname = process.env.HOST || '0.0.0.0';

console.log('');
console.log('🚀 VibeSync Backend Server');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`📍 Port: ${port}`);
console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

async function initializeServer() {
  console.log('[Init] Step 1: Testing database connection...');
  
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.error('');
    console.error('⚠️  WARNING: Database connection failed!');
    console.error('   Continuing with limited functionality...');
    console.error('');
  } else {
    console.log('[Init] ✅ Database connection successful');
  }
  
  console.log('');
  console.log('[Init] Step 2: Starting HTTP server...');
  
  try {
    const server = Bun.serve({
      port,
      hostname,
      fetch: app.fetch,
      error(error: any) {
        console.error('[Server] ❌ Request error:', error.message);
        return new Response(
          JSON.stringify({ 
            error: 'Internal Server Error',
            message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
          }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      },
    });

    console.log('');
    console.log('✅ Backend server is running!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌐 Server URL: http://${hostname}:${server.port}`);
    console.log(`🏥 Health Check: http://${hostname}:${server.port}/health`);
    console.log(`🔌 API Endpoint: http://${hostname}:${server.port}/api/trpc`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('Press Ctrl+C to stop the server');
    console.log('');

    return server;
  } catch (error: any) {
    if (error.code === 'EADDRINUSE') {
      console.error('');
      console.error(`❌ Port ${port} is already in use!`);
      console.error('');
      console.error('To fix this:');
      console.error(`  1. Kill existing process: lsof -ti:${port} | xargs kill -9`);
      console.error(`  2. Or use different port: PORT=3001 bun run backend/server.ts`);
      console.error('');
      process.exit(1);
    }
    
    console.error('');
    console.error('❌ Failed to start server:', error.message);
    console.error('');
    throw error;
  }
}

const server = await initializeServer();

process.on('SIGINT', async () => {
  console.log('');
  console.log('👋 Shutting down gracefully...');
  await closePool();
  console.log('✅ Server stopped');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('');
  console.log('👋 Shutting down gracefully...');
  await closePool();
  console.log('✅ Server stopped');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('');
  console.error('❌ Uncaught Exception:', error);
  console.error('');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('');
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  console.error('');
});

export default server;

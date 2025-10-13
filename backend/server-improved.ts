import app from './hono';

const port = parseInt(process.env.PORT || '3000', 10);

console.log('🚀 Starting VibeSync Backend Server...');
console.log(`📍 Port: ${port}`);
console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🗄️  Database: ${process.env.DATABASE_URL || 'postgresql://localhost:5432/vibesync'}`);

async function startServer() {
  try {
    const server = Bun.serve({
      port,
      fetch: app.fetch,
      development: process.env.NODE_ENV !== 'production',
    });

    console.log('');
    console.log('✅ Backend server running successfully!');
    console.log(`🌐 Server URL: http://localhost:${server.port}`);
    console.log(`🏥 Health check: http://localhost:${server.port}/health`);
    console.log(`🔌 tRPC endpoint: http://localhost:${server.port}/api/trpc`);
    console.log('');
    console.log('📝 Available routes:');
    console.log('   GET  /health');
    console.log('   GET  /api/health');
    console.log('   POST /api/trpc/auth.register');
    console.log('   POST /api/trpc/auth.login');
    console.log('   POST /api/trpc/auth.me');
    console.log('');
    console.log('Press Ctrl+C to stop the server');
    console.log('');

    process.on('SIGINT', () => {
      console.log('\n👋 Shutting down server gracefully...');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n👋 Shutting down server gracefully...');
      process.exit(0);
    });

    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    });

  } catch (error: any) {
    if (error.code === 'EADDRINUSE') {
      console.error('');
      console.error('❌ ERROR: Port 3000 is already in use!');
      console.error('');
      console.error('To fix this, run:');
      console.error('  bash kill-backend.sh');
      console.error('');
      console.error('Or manually kill the process:');
      console.error('  lsof -ti:3000 | xargs kill -9');
      console.error('');
      process.exit(1);
    } else {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }
}

startServer();

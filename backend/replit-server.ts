import app from './hono';
import { testConnection } from './db/connection';

const port = parseInt(process.env.PORT || '5000', 10);
const hostname = process.env.HOST || '0.0.0.0';

console.log('');
console.log('🚀 VibeSync Backend Server (Replit)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`📍 Port: ${port}`);
console.log(`🌐 Host: ${hostname}`);
console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

async function init() {
  console.log('[Init] Testing database connection...');
  
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.warn('⚠️  Database connection failed - using in-memory fallback');
  } else {
    console.log('✅ Database connection successful');
  }
  
  console.log('');
  console.log('✅ Backend ready!');
  console.log(`🏥 Health Check: http://${hostname}:${port}/health`);
  console.log(`🔌 API Endpoint: http://${hostname}:${port}/api/trpc`);
  console.log('');
}

init();

export default {
  port,
  hostname,
  fetch: app.fetch,
};

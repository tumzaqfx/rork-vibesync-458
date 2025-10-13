#!/usr/bin/env bun

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🧪 Testing Backend Connection');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

async function testBackend() {
  try {
    console.log('1️⃣  Testing health endpoint...');
    console.log('   URL:', `${BACKEND_URL}/health`);
    
    const healthResponse = await fetch(`${BACKEND_URL}/health`);
    const healthData = await healthResponse.json();
    
    if (healthData.status === 'ok') {
      console.log('   ✅ Health check passed');
      console.log('   Database:', healthData.database);
      console.log('   Uptime:', Math.floor(healthData.uptime), 'seconds');
    } else {
      console.log('   ⚠️  Health check returned:', healthData.status);
    }
    
    console.log('');
    console.log('2️⃣  Testing tRPC endpoint...');
    console.log('   URL:', `${BACKEND_URL}/api/trpc`);
    
    const trpcResponse = await fetch(`${BACKEND_URL}/api/trpc/auth.login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usernameOrEmail: 'test@example.com',
        password: 'Test123!',
      }),
    });
    
    if (trpcResponse.ok) {
      const trpcData = await trpcResponse.json();
      console.log('   ✅ tRPC endpoint working');
      console.log('   Response:', trpcData);
    } else {
      console.log('   ⚠️  tRPC returned status:', trpcResponse.status);
      const text = await trpcResponse.text();
      console.log('   Response:', text.substring(0, 200));
    }
    
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Backend is working correctly!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('You can now start the frontend:');
    console.log('  npm start');
    console.log('');
    
  } catch (error: any) {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('❌ Backend Connection Failed');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('Error:', error.message);
    console.log('');
    console.log('Possible causes:');
    console.log('  1. Backend is not running');
    console.log('  2. Port 3000 is blocked');
    console.log('  3. Database is not initialized');
    console.log('');
    console.log('To fix:');
    console.log('  1. Start backend: bun run backend/server-improved.ts');
    console.log('  2. Check health: curl http://localhost:3000/health');
    console.log('  3. Reset database: rm vibesync.db && ./setup-database.sh');
    console.log('');
    process.exit(1);
  }
}

testBackend();

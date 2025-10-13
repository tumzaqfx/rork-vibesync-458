#!/usr/bin/env bun

import { hashPassword } from '../backend/utils/auth';
import { query } from '../backend/db/connection';

async function createTestUser() {
  const email = process.argv[2];
  const password = process.argv[3];
  const username = process.argv[4];
  const displayName = process.argv[5];

  if (!email || !password || !username || !displayName) {
    console.error('Usage: bun scripts/create-test-user.ts <email> <password> <username> <displayName>');
    console.error('Example: bun scripts/create-test-user.ts jason.zama@gmail.com MyPassword123! jasonzama "Jason Zama"');
    process.exit(1);
  }

  try {
    console.log('🔐 Hashing password...');
    const passwordHash = await hashPassword(password);

    console.log('📝 Creating user in database...');
    const result = await query(
      `INSERT INTO users (username, email, password_hash, display_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, display_name, created_at`,
      [username, email, passwordHash, displayName]
    );

    const user = result.rows[0];
    
    console.log('\n✅ User created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email:        ${user.email}`);
    console.log(`👤 Username:     ${user.username}`);
    console.log(`🏷️  Display Name: ${user.display_name}`);
    console.log(`🆔 User ID:      ${user.id}`);
    console.log(`📅 Created:      ${user.created_at}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🎉 You can now log in with:');
    console.log(`   Email:    ${user.email}`);
    console.log(`   Password: ${password}`);
    console.log('');

    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Error creating user:', error.message);
    
    if (error.message?.includes('duplicate key')) {
      console.error('\n💡 This email or username already exists in the database.');
      console.error('   Try a different email or username.');
    } else if (error.message?.includes('connect')) {
      console.error('\n💡 Cannot connect to database.');
      console.error('   Make sure PostgreSQL is running and DATABASE_URL is correct in .env');
    }
    
    process.exit(1);
  }
}

createTestUser();

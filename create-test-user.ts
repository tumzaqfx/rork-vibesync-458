import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { join } from 'path';

const dbPath = process.env.DATABASE_PATH || join(process.cwd(), 'vibesync.db');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔧 Creating Test User');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('Database:', dbPath);
console.log('');

const db = new Database(dbPath);

const testUser = {
  email: 'test@example.com',
  username: 'testuser',
  password: 'Test123!',
  full_name: 'Test User',
  bio: 'This is a test account',
  avatar_url: 'https://i.pravatar.cc/300?u=test',
  verified: 1,
};

try {
  const passwordHash = bcrypt.hashSync(testUser.password, 10);
  
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(testUser.email);
  
  if (existingUser) {
    console.log('⚠️  User already exists. Updating password...');
    
    db.prepare(`
      UPDATE users 
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE email = ?
    `).run(passwordHash, testUser.email);
    
    console.log('✅ Password updated successfully!');
  } else {
    console.log('Creating new user...');
    
    const result = db.prepare(`
      INSERT INTO users (email, username, password_hash, full_name, bio, avatar_url, verified)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      testUser.email,
      testUser.username,
      passwordHash,
      testUser.full_name,
      testUser.bio,
      testUser.avatar_url,
      testUser.verified
    );
    
    console.log('✅ User created successfully!');
    console.log('   User ID:', result.lastInsertRowid);
  }
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 Test User Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('   Email:', testUser.email);
  console.log('   Password:', testUser.password);
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
} catch (error: any) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} finally {
  db.close();
}

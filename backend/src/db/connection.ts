
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Use the DATABASE_URL from the environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("FATAL: DATABASE_URL environment variable is not set.");
  console.error("Please create a .env file in the 'backend' folder and add your Supabase connection string.");
  console.error("Example: DATABASE_URL='postgresql://postgres:YourPassword@db.host.supabase.co:5432/postgres'");
  process.exit(1); // Exit the process if the database URL is not found
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase connections
  },
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('[Database] Query executed:', {
      query: text.substring(0, 100),
      duration: `${duration}ms`,
      rows: res.rowCount,
    });
    return res;
  } catch (error: any) {
    const duration = Date.now() - start;
    console.error('[Database] ❌ Query error:', {
      query: text.substring(0, 100),
      duration: `${duration}ms`,
      error: error.message,
    });
    throw error;
  }
};

export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('[Database] ✅ Connection test successful (PostgreSQL)');
    return true;
  } catch (error: any) {
    console.error('[Database] ❌ Connection test failed:', error.message);
    return false;
  }
};

export const isHealthy = async (): Promise<boolean> => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT 1');
        client.release();
        return result.rowCount === 1;
    } catch (error) {
        console.error('[Database] Health check failed:', error);
        return false;
    }
};

export const closePool = async (): Promise<void> => {
    await pool.end();
    console.log('[Database] 👋 Closed PostgreSQL connection pool');
};

console.log('[Database] ✅ PostgreSQL database connector initialized successfully');

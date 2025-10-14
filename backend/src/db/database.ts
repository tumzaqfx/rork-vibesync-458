import { query } from './connection';

export const database = {
  // User methods
  createUser: async (email: string, passwordHash: string, username: string, fullName: string) => {
    const result = await query(
      'INSERT INTO users (email, password, username, full_name) VALUES ($1, $2, $3, $4) RETURNING id',
      [email, passwordHash, username, fullName]
    );
    return result.rows[0];
  },

  getUserByEmail: async (email: string) => {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  // ... other database methods
};

import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { query } from '../../../../db/connection';
import { hashPassword, generateToken } from '../../../../utils/auth';
import { TRPCError } from '@trpc/server';

export const registerProcedure = publicProcedure
  .input(
    z.object({
      username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username too long'),
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      displayName: z.string().min(1, 'Display name is required').max(100, 'Display name too long'),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const { username, email, password, displayName } = input;

      console.log('[Register] Processing registration:', { username, email, displayName });

      const existingUser = await query(
        'SELECT id, username, email FROM users WHERE username = ? OR email = ?',
        [username.toLowerCase(), email.toLowerCase()]
      );

      if (existingUser.rows.length > 0) {
        const existing = existingUser.rows[0];
        if (existing.username === username.toLowerCase()) {
          console.log('[Register] Username already exists:', username);
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Username already exists',
          });
        }
        if (existing.email === email.toLowerCase()) {
          console.log('[Register] Email already exists:', email);
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Email already exists',
          });
        }
      }

      console.log('[Register] Hashing password...');
      const passwordHash = await hashPassword(password);

      console.log('[Register] Creating user in database...');
      const result = await query(
        `INSERT INTO users (username, email, password_hash, full_name)
         VALUES (?, ?, ?, ?)`,
        [username.toLowerCase(), email.toLowerCase(), passwordHash, displayName]
      );

      const userId = result.lastInsertRowid;
      
      if (!userId) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        });
      }

      const userResult = await query(
        'SELECT id, username, email, full_name as display_name, avatar_url as profile_image, verified as is_verified, created_at FROM users WHERE id = ?',
        [userId]
      );
      
      const user = userResult.rows[0];
      
      console.log('[Register] Generating JWT token...');
      const token = await generateToken(user.id);

      console.log('[Register] ✅ User registered successfully:', user.id);

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.display_name,
          profileImage: user.profile_image,
          isVerified: user.is_verified,
          createdAt: user.created_at,
        },
        token,
      };
    } catch (error: any) {
      console.error('[Register] ❌ Registration error:', {
        message: error.message,
        code: error.code,
        stack: error.stack?.substring(0, 200),
      });
      
      if (error instanceof TRPCError) {
        throw error;
      }
      
      if (error.code === '23505') {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Username or email already exists',
        });
      }
      
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Registration failed',
      });
    }
  });

export default registerProcedure;

import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { query } from '../../../../src/db/connection';
import { comparePassword, generateToken } from '../../../../utils/auth';
import { TRPCError } from '@trpc/server';

export const loginProcedure = publicProcedure
  .input(
    z.object({
      usernameOrEmail: z.string().min(1, 'Username or email is required'),
      password: z.string().min(1, 'Password is required'),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const { usernameOrEmail, password } = input;

      console.log('[Login] Attempting login for:', usernameOrEmail);

      const result = await query(
        `SELECT id, username, email, password_hash, full_name as display_name, avatar_url as profile_image, 
                verified as is_verified, followers_count, following_count, posts_count
         FROM users 
         WHERE (username = ? OR email = ?)`,
        [usernameOrEmail.toLowerCase(), usernameOrEmail.toLowerCase()]
      );

      if (result.rows.length === 0) {
        console.log('[Login] User not found:', usernameOrEmail);
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid username or password',
        });
      }

      const user = result.rows[0];
      
      console.log('[Login] Verifying password...');
      const isValidPassword = await comparePassword(password, user.password_hash);

      if (!isValidPassword) {
        console.log('[Login] Invalid password for user:', user.username);
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid username or password',
        });
      }

      console.log('[Login] Generating token...');
      const token = await generateToken(user.id);

      await query(
        'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [user.id]
      );

      console.log('[Login] ✅ Login successful:', user.username);

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.display_name,
          profileImage: user.profile_image,
          isVerified: user.is_verified,
          followersCount: user.followers_count,
          followingCount: user.following_count,
          postsCount: user.posts_count,
        },
        token,
      };
    } catch (error: any) {
      console.error('[Login] ❌ Login error:', {
        message: error.message,
        code: error.code,
      });
      
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Login failed',
      });
    }
  });

export default loginProcedure;

import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { query } from '../../../../src/db/connection';

export const followProcedure = protectedProcedure
  .input(z.object({ userId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    if (input.userId === ctx.userId) {
      throw new Error('You cannot follow yourself');
    }

    const existing = await query(
      'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
      [ctx.userId, input.userId]
    );

    if (existing.rows.length > 0) {
      throw new Error('Already following this user');
    }

    await query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
      [ctx.userId, input.userId]
    );

    await query(
      'UPDATE users SET followers_count = followers_count + 1 WHERE id = $1',
      [input.userId]
    );

    await query(
      'UPDATE users SET following_count = following_count + 1 WHERE id = $1',
      [ctx.userId]
    );

    return { success: true };
  });

export default followProcedure;

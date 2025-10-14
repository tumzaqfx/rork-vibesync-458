import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { query } from '../../../../src/db/connection';

export const unfollowProcedure = protectedProcedure
  .input(z.object({ userId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const result = await query(
      'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2 RETURNING id',
      [ctx.userId, input.userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Not following this user');
    }

    await query(
      'UPDATE users SET followers_count = GREATEST(followers_count - 1, 0) WHERE id = $1',
      [input.userId]
    );

    await query(
      'UPDATE users SET following_count = GREATEST(following_count - 1, 0) WHERE id = $1',
      [ctx.userId]
    );

    return { success: true };
  });

export default unfollowProcedure;

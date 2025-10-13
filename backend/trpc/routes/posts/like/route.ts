import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { query } from '../../../../db/connection';

export const likePostProcedure = protectedProcedure
  .input(z.object({ postId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const existing = await query(
      'SELECT id FROM likes WHERE user_id = $1 AND post_id = $2',
      [ctx.userId, input.postId]
    );

    if (existing.rows.length > 0) {
      await query(
        'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
        [ctx.userId, input.postId]
      );

      await query(
        'UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1',
        [input.postId]
      );

      return { liked: false };
    } else {
      await query(
        'INSERT INTO likes (user_id, post_id) VALUES ($1, $2)',
        [ctx.userId, input.postId]
      );

      await query(
        'UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1',
        [input.postId]
      );

      return { liked: true };
    }
  });

export default likePostProcedure;

import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { query } from '../../../../db/connection';

export const markReadProcedure = protectedProcedure
  .input(z.object({ notificationId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    await query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
      [input.notificationId, ctx.userId]
    );

    return { success: true };
  });

export default markReadProcedure;

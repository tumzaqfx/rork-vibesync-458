import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { query } from '../../../../src/db/connection';

export const listNotificationsProcedure = protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    })
  )
  .query(async ({ input, ctx }) => {
    const result = await query(
      `SELECT * FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [ctx.userId, input.limit, input.offset]
    );

    return result.rows.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.is_read,
      createdAt: notification.created_at,
      actionData: notification.action_data,
    }));
  });

export default listNotificationsProcedure;

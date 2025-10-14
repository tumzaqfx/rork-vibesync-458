import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { query } from '../../../../db/connection';

export const createLiveProcedure = protectedProcedure
  .input(
    z.object({
      title: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      audience: z.enum(['everyone', 'followers', 'close-friends']).default('everyone'),
      commentsEnabled: z.boolean().default(true),
      shareToFeedAfter: z.boolean().default(false),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const result = await query(
      `INSERT INTO live_sessions (host_id, title, description, audience, comments_enabled, share_to_feed_after, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'setup')
       RETURNING *`,
      [
        ctx.userId,
        input.title || null,
        input.description || null,
        input.audience,
        input.commentsEnabled,
        input.shareToFeedAfter,
      ]
    );

    const session = result.rows[0];

    return {
      id: session.id,
      hostId: session.host_id,
      title: session.title,
      description: session.description,
      audience: session.audience,
      commentsEnabled: session.comments_enabled,
      shareToFeedAfter: session.share_to_feed_after,
      status: session.status,
      viewerCount: session.viewer_count,
      createdAt: session.created_at,
    };
  });

export default createLiveProcedure;

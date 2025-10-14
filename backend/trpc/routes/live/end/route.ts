import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { query } from '../../../../db/connection';

export const endLiveProcedure = protectedProcedure
  .input(z.object({ sessionId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const result = await query(
      `UPDATE live_sessions 
       SET status = 'ended', ended_at = NOW()
       WHERE id = $1 AND host_id = $2
       RETURNING *`,
      [input.sessionId, ctx.userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Live session not found or unauthorized');
    }

    const session = result.rows[0];

    return {
      id: session.id,
      status: session.status,
      endedAt: session.ended_at,
      viewerCount: session.viewer_count,
      peakViewerCount: session.peak_viewer_count,
      totalViews: session.total_views,
    };
  });

export default endLiveProcedure;

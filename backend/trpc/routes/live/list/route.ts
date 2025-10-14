import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { query } from '../../../../src/db/connection';

export const listLiveProcedure = publicProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(50).default(10),
    })
  )
  .query(async ({ input }) => {
    const result = await query(
      `SELECT ls.*, 
              u.username as host_username, u.display_name as host_display_name, 
              u.profile_image as host_avatar, u.is_verified as host_verified
       FROM live_sessions ls
       JOIN users u ON ls.host_id = u.id
       WHERE ls.status = 'live'
       ORDER BY ls.viewer_count DESC, ls.started_at DESC
       LIMIT $1`,
      [input.limit]
    );

    return result.rows.map((session) => ({
      id: session.id,
      title: session.title,
      description: session.description,
      streamerId: session.host_id,
      streamerName: session.host_display_name,
      streamerAvatar: session.host_avatar,
      category: 'Live',
      viewers: session.viewer_count,
      isLive: true,
      startedAt: session.started_at,
      thumbnailUrl: session.thumbnail_url,
      streamUrl: session.stream_url,
    }));
  });

export default listLiveProcedure;

import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { query } from '../../../../db/connection';

export const createVibeProcedure = protectedProcedure
  .input(
    z.object({
      caption: z.string(),
      videoUrl: z.string(),
      thumbnailUrl: z.string().optional(),
      duration: z.number(),
      soundId: z.string().optional(),
      soundName: z.string().optional(),
      soundArtist: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const result = await query(
      `INSERT INTO vibes (user_id, caption, video_url, thumbnail_url, duration, sound_id, sound_name, sound_artist)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        ctx.userId,
        input.caption,
        input.videoUrl,
        input.thumbnailUrl || null,
        input.duration,
        input.soundId || null,
        input.soundName || null,
        input.soundArtist || null,
      ]
    );

    const vibe = result.rows[0];

    return {
      id: vibe.id,
      userId: vibe.user_id,
      caption: vibe.caption,
      videoUrl: vibe.video_url,
      thumbnailUrl: vibe.thumbnail_url,
      duration: vibe.duration,
      soundId: vibe.sound_id,
      soundName: vibe.sound_name,
      soundArtist: vibe.sound_artist,
      likes: vibe.likes_count,
      comments: vibe.comments_count,
      shares: vibe.shares_count,
      views: vibe.views_count,
      timestamp: vibe.created_at,
    };
  });

export default createVibeProcedure;

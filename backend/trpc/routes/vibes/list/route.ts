import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { query } from '../../../../src/db/connection';

export const listVibesProcedure = publicProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
    })
  )
  .query(async ({ input, ctx }) => {
    const result = await query(
      `SELECT v.*, 
              u.username, u.display_name as user_display_name, u.profile_image, u.is_verified,
              ${ctx.userId ? `EXISTS(SELECT 1 FROM likes WHERE user_id = '${ctx.userId}' AND post_id = v.id) as is_liked,` : 'false as is_liked,'}
              ${ctx.userId ? `EXISTS(SELECT 1 FROM saved_posts WHERE user_id = '${ctx.userId}' AND post_id = v.id) as is_saved` : 'false as is_saved'}
       FROM vibes v
       JOIN users u ON v.user_id = u.id
       ORDER BY v.created_at DESC
       LIMIT $1 OFFSET $2`,
      [input.limit, input.offset]
    );

    return result.rows.map((vibe) => ({
      id: vibe.id,
      userId: vibe.user_id,
      username: vibe.username,
      userDisplayName: vibe.user_display_name,
      profileImage: vibe.profile_image,
      isVerified: vibe.is_verified,
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
      isLiked: vibe.is_liked,
      isSaved: vibe.is_saved,
    }));
  });

export default listVibesProcedure;
